#!/usr/bin/env node
/* Validação do portal (roda no CI antes de publicar, e localmente: `node scripts/validar.js`).
 * Verifica: sintaxe dos JS, catálogo dos 66 livros, dicionários de i18n, o texto bíblico de referência
 * (Bíblia Livre) e todo o conteúdo registrado: capítulos, cenas, ilustrações e referências bíblicas,
 * que são conferidas contra o texto (versículo existe? cenas cobrem o capítulo? nomes batem?).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const erros = [];
const avisos = [];
const erro = (m) => erros.push(m);

/* ---------- ambiente mínimo de navegador ---------- */
const ctx = {
  console,
  location: { search: '', hash: '' },
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { documentElement: {}, querySelectorAll: () => [] },
  Intl,
};
ctx.window = ctx;
vm.createContext(ctx);

function carregar(rel) {
  const arq = path.join(RAIZ, rel);
  const codigo = fs.readFileSync(arq, 'utf8');
  try {
    vm.runInContext(codigo, ctx, { filename: rel });
  } catch (e) {
    erro(`${rel}: ${e.message}`);
  }
}

/* ---------- 1. sintaxe de todos os JS ---------- */
const listarJs = (dir) => fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true }).flatMap((d) => {
  const rel = path.join(dir, d.name);
  return d.isDirectory() ? listarJs(rel) : d.name.endsWith('.js') ? [rel] : [];
});
for (const rel of [...listarJs('js'), ...listarJs('conteudo'), ...listarJs('scripts')]) {
  try { new vm.Script(fs.readFileSync(path.join(RAIZ, rel), 'utf8'), { filename: rel }); }
  catch (e) { erro(`Sintaxe em ${rel}: ${e.message}`); }
}

/* ---------- 2. núcleo ---------- */
['js/i18n.js', 'js/livros.js', 'js/versiculos.js', 'js/biblia-texto.js', 'js/ilustracoes.js'].forEach(carregar);
const { I18N, BIBLIA, ILUSTRA, CONTEUDO, TEXTO_BIBLICO: TB, VERSICULOS } = ctx;
if (!I18N || !BIBLIA || !ILUSTRA || !CONTEUDO || !TB || !VERSICULOS) {
  erro('Falha ao carregar i18n.js / livros.js / versiculos.js / biblia-texto.js / ilustracoes.js');
} else {
  /* catálogo */
  if (BIBLIA.livros.length !== 66) erro(`Catálogo tem ${BIBLIA.livros.length} livros (esperado 66)`);
  const totalCaps = BIBLIA.livros.reduce((s, l) => s + l.capitulos, 0);
  if (totalCaps !== 1189) erro(`Total de capítulos ${totalCaps} (esperado 1189)`);
  const ids = new Set();
  for (const l of BIBLIA.livros) {
    if (ids.has(l.id)) erro(`Livro duplicado: ${l.id}`);
    ids.add(l.id);
    if (!BIBLIA.SECOES[l.secao]) erro(`${l.id}: seção desconhecida "${l.secao}"`);
  }

  /* texto bíblico de referência */
  for (const [sigla, info] of Object.entries(TB.TRADUCOES)) {
    let nVers = 0;
    for (const l of BIBLIA.livros) {
      const rel = `biblia/${sigla}/${l.id}.js`;
      if (!fs.existsSync(path.join(RAIZ, rel))) { erro(`${info.sigla}: falta ${rel}`); continue; }
      carregar(rel);
      const caps = TB._dados[`${sigla}/${l.id}`];
      if (!caps) { erro(`${rel}: não registrou o texto`); continue; }
      if (caps.length !== l.capitulos) erro(`${rel}: ${caps.length} capítulos (catálogo: ${l.capitulos})`);
      caps.forEach((vs, i) => {
        nVers += vs.length;
        if (VERSICULOS[l.id]?.[i] !== vs.length) erro(`${rel}: cap. ${i + 1} com ${vs.length} versículos (versiculos.js: ${VERSICULOS[l.id]?.[i]})`);
        vs.forEach((v, k) => { if (!v) erro(`${rel}: ${i + 1}:${k + 1} vazio`); });
      });
    }
    console.log(`Texto bíblico ${info.sigla}: ${nVers} versículos verificados.`);
  }
  /* referências cruzadas (OpenBible.info): todas precisam existir na versificação da BLIVRE */
  let nRefs = 0;
  for (const l of BIBLIA.livros) {
    const rel = `biblia/referencias/${l.id}.js`;
    if (!fs.existsSync(path.join(RAIZ, rel))) { erro(`falta ${rel}`); continue; }
    carregar(rel);
    const mapa = ctx.REFERENCIAS && ctx.REFERENCIAS._dados[l.id];
    if (!mapa) { erro(`${rel}: não registrou as referências`); continue; }
    for (const [k, lista] of Object.entries(mapa)) {
      const e = TB.verificar(k, l.id, VERSICULOS);
      if (e) erro(`${rel}: origem ${e}`);
      for (const r of lista) { nRefs++; const e2 = TB.verificar(r, l.id, VERSICULOS); if (e2) erro(`${rel} ${k}: ${e2}`); }
    }
  }
  console.log(`Referências cruzadas: ${nRefs} verificadas.`);

  for (const [idioma, sigla] of Object.entries(TB.POR_IDIOMA)) if (!TB.TRADUCOES[sigla]) erro(`biblia-texto.js: idioma ${idioma} aponta para tradução inexistente "${sigla}"`);

  /* i18n */
  const base = I18N._UI['pt-BR'];
  const chavesBase = Object.keys(base);
  for (const { codigo } of I18N.IDIOMAS) {
    const d = I18N._UI[codigo];
    if (!d) { erro(`i18n: idioma ${codigo} listado sem dicionário`); continue; }
    const faltam = chavesBase.filter((k) => !(k in d));
    const sobram = Object.keys(d).filter((k) => !(k in base));
    if (faltam.length) avisos.push(`i18n ${codigo}: ${faltam.length} chave(s) sem tradução (usa fallback): ${faltam.join(', ')}`);
    if (sobram.length) erro(`i18n ${codigo}: chaves que não existem em pt-BR: ${sobram.join(', ')}`);
    for (const [k, v] of Object.entries(d)) {
      if (v && typeof v === 'object' && !Array.isArray(v) && !('other' in v)) erro(`i18n ${codigo}: plural "${k}" sem a forma "other"`);
      const vars = (s) => new Set(String(s).match(/\{\w+\}/g) || []);
      if (typeof v === 'string' && typeof base[k] === 'string') {
        const vb = vars(base[k]);
        for (const x of vars(v)) if (!vb.has(x)) erro(`i18n ${codigo}: "${k}" usa ${x}, que não existe em pt-BR`);
      }
    }
  }
  for (const [codigo, nomes] of Object.entries(I18N._NOMES)) {
    if (nomes && nomes.split('|').length !== 66) erro(`i18n ${codigo}: ${nomes.split('|').length} nomes de livros (esperado 66)`);
  }
  for (const k of Object.keys(BIBLIA.SECOES)) if (!(('secao.' + k) in base)) erro(`i18n pt-BR: falta "secao.${k}"`);

  /* ---------- 3. conteúdo ---------- */
  // palavras com inicial maiúscula em "personagens" que não são nomes próprios
  const COMUNS = new Set('O A Os As Um Uma Sua Seu Estrangeiros Deus Senhor Anjo Anjos Três Dois Duas Doze Todo Poderoso Rei Família Filhos Filhas Irmãos Esposa Homem Mulher Primeiro Primeira Visitantes Construtores Chefes Descendentes Animais Copeiro Padeiro Faraó'.split(' '));
  const elementos = new Set(ILUSTRA.elementos);
  const fundos = new Set(ILUSTRA.fundos);
  let nCaps = 0, nCenas = 0;

  const validarCena = (onde, cena) => {
    if (!cena || !fundos.has(cena.fundo)) erro(`${onde}: fundo desconhecido "${cena && cena.fundo}"`);
    for (const e of (cena && cena.el) || []) {
      if (!elementos.has(e.t)) erro(`${onde}: elemento desconhecido "${e.t}"`);
      if ((e.t === 'fala' || e.t === 'rotulo') && !e.texto) erro(`${onde}: "${e.t}" sem texto`);
    }
    try { ILUSTRA.render(cena); } catch (ex) { erro(`${onde}: erro ao renderizar: ${ex.message}`); }
  };

  for (const l of BIBLIA.livros) {
    for (const idioma of l.idiomas) {
      const rel = `conteudo/${idioma}/${l.id}.js`;
      if (!fs.existsSync(path.join(RAIZ, rel))) { erro(`${l.id}: idioma ${idioma} registrado, mas ${rel} não existe`); continue; }
      carregar(rel);
      const dados = CONTEUDO.obter(l.id, idioma);
      if (!dados) { erro(`${rel}: não chamou CONTEUDO.registrar('${l.id}', …, '${idioma}')`); continue; }
      if (dados.capa) validarCena(`${rel} capa`, dados.capa);
      for (const p of dados.partes || []) {
        if (p.de < 1 || p.ate > l.capitulos || p.de > p.ate) erro(`${rel}: parte "${p.titulo}" com faixa inválida ${p.de}-${p.ate}`);
      }
      // nomes só são comparados quando o conteúdo está no mesmo idioma da tradução bíblica de referência
      const siglaRef = TB.traducaoPara(idioma);
      const textoLivro = TB.TRADUCOES[siglaRef].idioma === idioma ? (TB._dados[`${siglaRef}/${l.id}`] || []).flat().join(' ') : '';
      const cobertura = {}; // capítulo -> Set(versículos recontados), somando cenas de todos os capítulos do livro
      for (const [n, cap] of Object.entries(dados.capitulos || {})) {
        const onde = `${l.id} ${n} [${idioma}]`;
        /* referências bíblicas: precisam existir no texto de referência */
        if (cap.versiculo) { const e = TB.verificar(cap.versiculo, l.id, VERSICULOS); if (e) erro(`${onde} versiculo: ${e}`); }
        for (const cn of cap.cenas || []) {
          if (!cn.ref) { avisos.push(`${onde}: cena sem referência bíblica`); continue; }
          const e = TB.verificar(cn.ref, l.id, VERSICULOS);
          if (e) erro(`${onde} cena: ${e}`);
          else TB.expandir(cn.ref, l.id, VERSICULOS).forEach((x) => { if (x.livro === l.id) (cobertura[x.c] = cobertura[x.c] || new Set()).add(x.v); });
          if (cn.veja != null) {
            if (!Array.isArray(cn.veja)) erro(`${onde}: "veja" deve ser uma lista de referências`);
            else cn.veja.forEach((r) => { const ev = TB.verificar(r, l.id, VERSICULOS); if (ev) erro(`${onde} veja: ${ev}`); });
          }
        }
        /* nomes próprios dos personagens devem existir no texto bíblico (mesma grafia) */
        if (textoLivro) {
          for (const p of cap.personagens || []) {
            const nomes = (p.replace(/\([^)]*\)/g, '').match(/\p{Lu}[\p{L}-]+/gu) || []).filter((w) => !COMUNS.has(w));
            for (const w of nomes) if (!new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, 'u').test(textoLivro)) avisos.push(`${onde}: personagem "${w}" não aparece com essa grafia no texto bíblico`);
          }
        }
        if (+n < 1 || +n > l.capitulos) erro(`${onde}: capítulo fora do intervalo 1-${l.capitulos}`);
        if (!cap.titulo) erro(`${onde}: sem título`);
        if (!Array.isArray(cap.cenas) || !cap.cenas.length) { erro(`${onde}: sem cenas`); continue; }
        nCaps++;
        cap.cenas.forEach((cn, i) => {
          nCenas++;
          if (!cn.texto) erro(`${onde} cena ${i + 1}: sem texto`);
          validarCena(`${onde} cena ${i + 1}`, cn.cena);
        });
      }
      /* cobertura: as cenas devem recontar cada capítulo publicado por inteiro */
      for (const n of Object.keys(dados.capitulos || {})) {
        const total = VERSICULOS[l.id]?.[+n - 1] || 0, cob = cobertura[n] || new Set(), faltam = [];
        for (let v = 1; v <= total; v++) if (!cob.has(v)) faltam.push(v);
        if (faltam.length) avisos.push(`${l.id} ${n} [${idioma}]: versículos sem cena: ${faltam.join(', ')}`);
      }
      // traduções devem ter os mesmos capítulos do original
      const original = l.idiomas[0];
      if (idioma !== original) {
        const o = CONTEUDO.obter(l.id, original);
        if (o) for (const n of Object.keys(o.capitulos)) if (!dados.capitulos[n]) avisos.push(`${l.id} [${idioma}]: capítulo ${n} ainda não traduzido`);
      }
    }
  }
  console.log(`Conteúdo: ${nCaps} capítulo(s), ${nCenas} cena(s) validados.`);
}

/* ---------- 4. arquivos referenciados no index.html ---------- */
const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
for (const [, ref] of html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)) {
  if (!fs.existsSync(path.join(RAIZ, ref))) erro(`index.html referencia ${ref}, que não existe`);
}

avisos.forEach((a) => console.log('⚠️  ' + a));
if (erros.length) {
  erros.forEach((e) => console.error('❌ ' + e));
  console.error(`\n${erros.length} erro(s). Publicação bloqueada.`);
  process.exit(1);
}
console.log('✅ Validação concluída sem erros.');
