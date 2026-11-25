#!/usr/bin/env node
/* Importa as referências cruzadas do OpenBible.info (CC BY) para o portal.
 *
 * Uso:
 *   curl -LO https://a.openbible.info/data/cross-references.zip && unzip cross-references.zip
 *   node scripts/importar-referencias.js cross_references.txt [--max 8] [--min-votos 1]
 *
 * Formato de entrada (TSV): "Gen.1.1<TAB>Rom.1.19-Rom.1.20<TAB>60"
 * Gera biblia/referencias/<livro>.js:
 *   REFERENCIAS.registrar('genesis', { '1:1': ['exodo 20:11', 'atos 17:24', …], … })
 * As listas ficam ordenadas por relevância (votos da comunidade), da mais para a menos votada.
 * Referências que não existem na versificação da BLIVRE (js/versiculos.js) são descartadas.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const args = process.argv.slice(2);
const origem = args.find((a) => !a.startsWith('--'));
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? +args[i + 1] : d; };
const MAX = opt('max', 8), MIN_VOTOS = opt('min-votos', 1);
if (!origem) { console.error('Uso: node scripts/importar-referencias.js cross_references.txt [--max 8] [--min-votos 1]'); process.exit(1); }

const RAIZ = path.resolve(__dirname, '..');
const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
for (const f of ['js/livros.js', 'js/versiculos.js']) vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), ctx);
const { BIBLIA, VERSICULOS } = ctx;

// abreviações OSIS (ordem canônica) -> ids de js/livros.js
const OSIS = 'Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev'.split(' ');
const idPorOsis = Object.fromEntries(OSIS.map((o, i) => [o, BIBLIA.livros[i].id]));

const existe = (id, c, v) => !!VERSICULOS[id] && c >= 1 && c <= VERSICULOS[id].length && v >= 1 && v <= VERSICULOS[id][c - 1];
function ponto(s) { // "Gen.1.1" -> {id, c, v}
  const m = s.match(/^(\w+)\.(\d+)\.(\d+)$/);
  if (!m || !idPorOsis[m[1]]) return null;
  return { id: idPorOsis[m[1]], c: +m[2], v: +m[3] };
}
function destino(s) { // "Rom.1.19-Rom.1.20" -> 'romanos 1:19-20'
  const [a, b] = s.split('-');
  const p = ponto(a), q = b ? ponto(b) : p;
  if (!p || !q || p.id !== q.id || !existe(p.id, p.c, p.v) || !existe(q.id, q.c, q.v)) return null;
  if (p.c === q.c && p.v === q.v) return `${p.id} ${p.c}:${p.v}`;
  if (p.c === q.c) return q.v > p.v ? `${p.id} ${p.c}:${p.v}-${q.v}` : null;
  return q.c > p.c ? `${p.id} ${p.c}:${p.v}-${q.c}:${q.v}` : null;
}

const porVerso = {}; // 'id' -> { 'c:v' -> [[ref, votos]] }
let lidas = 0, aceitas = 0, descartadas = 0;
for (const linha of fs.readFileSync(origem, 'utf8').split(/\r?\n/)) {
  const [de, para, votos] = linha.split('\t');
  if (!para || isNaN(+votos)) continue;
  lidas++;
  if (+votos < MIN_VOTOS) continue;
  const p = ponto(de), ref = destino(para);
  if (!p || !existe(p.id, p.c, p.v) || !ref) { descartadas++; continue; }
  const k = `${p.c}:${p.v}`;
  ((porVerso[p.id] = porVerso[p.id] || {})[k] = porVerso[p.id][k] || []).push([ref, +votos]);
  aceitas++;
}

const saida = path.join(RAIZ, 'biblia', 'referencias');
fs.mkdirSync(saida, { recursive: true });
let gravadas = 0;
for (const l of BIBLIA.livros) {
  const mapa = {};
  for (const [k, lista] of Object.entries(porVerso[l.id] || {})) {
    mapa[k] = lista.sort((a, b) => b[1] - a[1]).slice(0, MAX).map(([r]) => r);
    gravadas += mapa[k].length;
  }
  fs.writeFileSync(path.join(saida, l.id + '.js'),
    `/* ${l.nome}: referências cruzadas (OpenBible.info, CC BY). Gerado por scripts/importar-referencias.js; não edite à mão. */\n` +
    `REFERENCIAS.registrar(${JSON.stringify(l.id)}, ${JSON.stringify(mapa)});\n`);
}
console.log(`${lidas} lidas; ${aceitas} aceitas (votos >= ${MIN_VOTOS}); ${descartadas} descartadas (fora da versificação da BLIVRE); ${gravadas} gravadas (máx. ${MAX} por versículo).`);
