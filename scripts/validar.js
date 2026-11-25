#!/usr/bin/env node
/* Validação do portal (roda no CI antes de publicar, e localmente: `node scripts/validar.js`).
 * Verifica: sintaxe dos JS, catálogo dos 66 livros, dicionários de i18n,
 * e todo o conteúdo registrado (capítulos, cenas, fundos e elementos das ilustrações).
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
for (const rel of [...listarJs('js'), ...listarJs('conteudo')]) {
  try { new vm.Script(fs.readFileSync(path.join(RAIZ, rel), 'utf8'), { filename: rel }); }
  catch (e) { erro(`Sintaxe em ${rel}: ${e.message}`); }
}

/* ---------- 2. núcleo ---------- */
['js/i18n.js', 'js/livros.js', 'js/ilustracoes.js'].forEach(carregar);
const { I18N, BIBLIA, ILUSTRA, CONTEUDO } = ctx;
if (!I18N || !BIBLIA || !ILUSTRA || !CONTEUDO) {
  erro('Falha ao carregar i18n.js / livros.js / ilustracoes.js');
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
      for (const [n, cap] of Object.entries(dados.capitulos || {})) {
        const onde = `${l.id} ${n} [${idioma}]`;
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
