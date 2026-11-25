#!/usr/bin/env node
/* Conferência de números: procura cada número escrito em algarismos nas histórias (narração e rótulos)
 * no texto bíblico da BLIVRE, por extenso ("novecentos e sessenta e nove") ou em algarismos.
 * Ferramenta de revisão (não roda no CI): números como "Dia 1" ou "Mandamentos 1 a 4" são legítimos.
 *
 * Uso: node scripts/conferir-numeros.js [livro]   (ex.: genesis; sem argumento, todos os publicados)
 * Saída: cada número não encontrado no trecho da cena, indicando se aparece no capítulo ou no livro.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const RAIZ = path.resolve(__dirname, '..');
const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
for (const f of ['js/livros.js', 'js/versiculos.js', 'js/biblia-texto.js']) vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), ctx);
const { BIBLIA, TEXTO_BIBLICO: TB, CONTEUDO } = ctx;

const UN = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const DEZ = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const CEN = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
function ate999(n) {
  if (n < 20) return UN[n];
  if (n < 100) return DEZ[Math.floor(n / 10)] + (n % 10 ? ' e ' + UN[n % 10] : '');
  if (n === 100) return 'cem';
  return CEN[Math.floor(n / 100)] + (n % 100 ? ' e ' + ate999(n % 100) : '');
}
function extenso(n) {
  if (n < 1000) return [ate999(n)];
  const mil = Math.floor(n / 1000), resto = n % 1000;
  const base = (mil === 1 ? 'mil' : ate999(mil) + ' mil');
  return resto ? [base + ' e ' + ate999(resto), base + ' ' + ate999(resto)] : [base];
}
const norm = (s) => s.toLowerCase().replace(/[.,;:!?“”"()\[\]]/g, ' ').replace(/\s+/g, ' ');
const contem = (texto, n) => {
  const t = ' ' + norm(texto) + ' ';
  const formas = [String(n), ...extenso(n)];
  if (n === 1) formas.push('uma', 'primeiro', 'primeira');
  if (n === 2) formas.push('duas', 'segundo', 'segunda');
  if (n >= 3 && n <= 10) formas.push(['', '', '', 'terceiro', 'quarto', 'quinto', 'sexto', 'sétimo', 'oitavo', 'nono', 'décimo'][n]);
  if (n % 100 === 2 && n > 100) formas.push(extenso(n)[0].replace(/dois$/, 'duas'));
  return formas.some((f) => t.includes(' ' + f + ' '));
};

/* números por extenso no reconto ("seiscentos mil", "quarenta dias") */
const VAL = {}; UN.forEach((w, i) => (VAL[w] = i)); DEZ.forEach((w, i) => w && (VAL[w] = i * 10)); CEN.forEach((w, i) => w && (VAL[w] = i * 100));
Object.assign(VAL, { cem: 100, duas: 2, uma: 1, duzentas: 200, trezentas: 300, quatrocentas: 400, quinhentas: 500, seiscentas: 600 });
const TOK = Object.keys(VAL).sort((a, b) => b.length - a.length).join('|');
const PALAVRAS = new RegExp(`(?<![\\p{L}])(?:${TOK})(?:\\s+e\\s+(?:${TOK}))*(?:\\s+mil(?:\\s+e\\s+(?:${TOK})(?:\\s+e\\s+(?:${TOK}))*)?)?(?![\\p{L}])`, 'gu');
function valorPorExtenso(txt) {
  let total = 0, atual = 0;
  for (const w of txt.split(/\s+/)) { if (w === 'e') continue; if (w === 'mil') { total += (atual || 1) * 1000; atual = 0; } else atual += VAL[w] || 0; }
  return total + atual;
}

const filtro = process.argv[2];
let total = 0, alertas = 0;
for (const l of BIBLIA.livros.filter((x) => x.disponivel && (!filtro || x.id === filtro))) {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, `biblia/blivre/${l.id}.js`), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, `conteudo/pt-BR/${l.id}.js`), 'utf8'), ctx);
  const caps = TB._dados['blivre/' + l.id], dados = CONTEUDO.obter(l.id, 'pt-BR');
  const livroTxt = caps.flat().join(' ');
  for (const [n, cap] of Object.entries(dados.capitulos)) {
    cap.cenas.forEach((cn, i) => {
      const fontes = [cn.texto, ...(cn.cena.el || []).filter((e) => e.t === 'rotulo' || e.t === 'fala').map((e) => e.texto)].join(' ');
      const achados = [...fontes.matchAll(/(\d+)(\s*mil)?(?!º|ª)/g)].map((m) => [m[0].trim(), +m[1] * (m[2] ? 1000 : 1)]);
      for (const m of fontes.toLowerCase().matchAll(PALAVRAS)) { const v = valorPorExtenso(m[0]); if (v >= 3) achados.push([m[0], v]); }
      for (const m of achados) {
        const num = m[1];
        total++;
        const trecho = TB.expandir(cn.ref, l.id).map((x) => (TB._dados['blivre/' + x.livro] || caps)[x.c - 1][x.v - 1]).join(' ');
        if (contem(trecho, num)) continue;
        const onde = contem(caps[+n - 1].join(' '), num) ? 'no capítulo' : contem(livroTxt, num) ? 'no livro' : 'NÃO ENCONTRADO';
        alertas++;
        console.log(`${l.id} ${n}.${i + 1} (${cn.ref}): "${m[0]}" → ${onde}`);
      }
    });
  }
}
console.log(`\n${total} números conferidos; ${alertas} fora do trecho da cena (revisar manualmente).`);
