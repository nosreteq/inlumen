#!/usr/bin/env node
/* Importa uma tradução bíblica no formato VPL do eBible.org ("GEN 1:1 texto…") para o portal.
 *
 * Uso:
 *   curl -LO https://ebible.org/Scriptures/porbr2018_vpl.zip && unzip porbr2018_vpl.zip
 *   node scripts/importar-biblia.js porbr2018_vpl.txt blivre
 *
 * Gera:
 *   biblia/<sigla>/<livro>.js   um arquivo por livro (carregado sob demanda pelo site)
 *   js/versiculos.js            nº de versículos por capítulo dos 66 livros (só na 1ª tradução / --versiculos)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const [, , origem, sigla, ...flags] = process.argv;
if (!origem || !sigla) {
  console.error('Uso: node scripts/importar-biblia.js <arquivo_vpl.txt> <sigla> [--versiculos]');
  process.exit(1);
}
const RAIZ = path.resolve(__dirname, '..');

// códigos USFM, na ordem canônica, correspondentes aos ids de js/livros.js
const USFM = 'GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SOL ISA JER LAM EZE DAN HOS JOE AMO OBA JON MIC NAH HAB ZEP HAG ZEC MAL MAT MAR LUK JOH ACT ROM 1CO 2CO GAL EPH PHI COL 1TH 2TH 1TI 2TI TIT PHM HEB JAM 1PE 2PE 1JO 2JO 3JO JUD REV'.split(' ');
const ALT = { SNG: 'SOL', EZK: 'EZE', JOL: 'JOE', NAM: 'NAH', PHP: 'PHI', JHN: 'JOH', MRK: 'MAR', JAS: 'JAM' };

const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/livros.js'), 'utf8'), ctx);
const livros = ctx.BIBLIA.livros;
const idPorUsfm = Object.fromEntries(USFM.map((u, i) => [u, livros[i].id]));

const dados = {}; // id -> [[v1, v2…], …]
let n = 0;
for (const linha of fs.readFileSync(origem, 'utf8').split(/\r?\n/)) {
  const m = linha.match(/^(\S+) (\d+):(\d+) (.*)$/);
  if (!m) continue;
  const id = idPorUsfm[ALT[m[1]] || m[1]];
  if (!id) continue; // livros fora do cânon de 66
  const c = +m[2], v = +m[3];
  const caps = (dados[id] = dados[id] || []);
  const vs = (caps[c - 1] = caps[c - 1] || []);
  vs[v - 1] = m[4].trim();
  n++;
}

const erros = [];
const saida = path.join(RAIZ, 'biblia', sigla);
fs.mkdirSync(saida, { recursive: true });
const contagens = {};
for (const l of livros) {
  const caps = dados[l.id];
  if (!caps) { erros.push(`${l.id}: ausente na fonte`); continue; }
  if (caps.length !== l.capitulos) erros.push(`${l.id}: ${caps.length} capítulos na fonte, ${l.capitulos} no catálogo`);
  caps.forEach((vs, i) => { for (let k = 0; k < (vs || []).length; k++) if (vs[k] == null) { vs[k] = ''; erros.push(`${l.id} ${i + 1}:${k + 1} ausente`); } });
  contagens[l.id] = caps.map((vs) => (vs || []).length);
  fs.writeFileSync(path.join(saida, l.id + '.js'),
    `/* ${l.nome}: texto bíblico (${sigla}). Gerado por scripts/importar-biblia.js; não edite à mão. */\n` +
    `TEXTO_BIBLICO.registrar(${JSON.stringify(sigla)}, ${JSON.stringify(l.id)}, ${JSON.stringify(caps)});\n`);
}

if (flags.includes('--versiculos') || !fs.existsSync(path.join(RAIZ, 'js/versiculos.js'))) {
  fs.writeFileSync(path.join(RAIZ, 'js/versiculos.js'),
    `/* Número de versículos por capítulo (66 livros), extraído de ${sigla}. Gerado por scripts/importar-biblia.js. */\n` +
    `window.VERSICULOS = ${JSON.stringify(contagens)};\n`);
}

console.log(`${n} versículos importados em biblia/${sigla}/ (${Object.keys(dados).length} livros).`);
if (erros.length) { erros.forEach((e) => console.error('⚠️  ' + e)); process.exit(1); }
