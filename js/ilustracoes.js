/* Motor de ilustrações: monta cenas SVG (800x450) a partir de um fundo + lista de elementos.
 *
 * Uso no conteúdo:
 *   cena: { fundo: 'dia', el: [ {t:'sol', x:650, y:90, anim:'brilhar'}, {t:'pessoa', x:300, y:380, cor:'#7a4'} ] }
 *
 * Atributos comuns a todo elemento: x, y, s (escala), anim, atraso (s), espelho (bool).
 * Animações: flutuar, brilhar, balancar, surgir, cair, nadar, voar, pulsar, girar, andar, tremer, piscar.
 * Deus não é desenhado como figura humana: sua presença é representada pelo elemento 'luz'.
 */
window.ILUSTRA = (function () {
  let uid = 0;
  const W = 800, H = 450;

  /* ---------- utilidades ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function rnd(seed) {
    let t = seed >>> 0;
    return () => { t += 0x6d2b79f5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
  }

  function grupo(o, inner, semEspelho) {
    const x = o.x ?? 400, y = o.y ?? 300, s = o.s ?? 1;
    const fx = !semEspelho && o.espelho ? -1 : 1;
    const cls = o.anim ? ` class="a-${o.anim}"` : '';
    const st = o.atraso != null ? ` style="animation-delay:${o.atraso}s"` : '';
    const op = o.opacidade != null ? ` opacity="${o.opacidade}"` : '';
    return `<g transform="translate(${x} ${y}) scale(${s * fx} ${s})"${op}><g${cls}${st}>${inner}</g></g>`;
  }

  /* ---------- fundos ---------- */
  function ceu(id, cores) {
    const stops = cores.map((c, i) => `<stop offset="${(i / (cores.length - 1)) * 100}%" stop-color="${c}"/>`).join('');
    return `<defs><linearGradient id="${id}-ceu" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${id}-ceu)"/>`;
  }
  function chao(cor, y = 360, cor2) {
    return `<path d="M0 ${y} Q200 ${y - 18} 400 ${y} T800 ${y} V450 H0Z" fill="${cor}"/>` +
      (cor2 ? `<path d="M0 ${y + 30} Q250 ${y + 14} 520 ${y + 32} T800 ${y + 26} V450 H0Z" fill="${cor2}"/>` : '');
  }

  const FUNDOS = {
    trevas: (id) => ceu(id, ['#05060a', '#0d1020', '#111a2a']) +
      `<g class="a-nadar" opacity=".35"><path d="M-40 330 Q60 300 160 330 T360 330 T560 330 T760 330 T960 330" stroke="#2c3e5a" stroke-width="3" fill="none"/>
       <path d="M-60 370 Q40 345 140 370 T340 370 T540 370 T740 370 T940 370" stroke="#22324a" stroke-width="3" fill="none"/>
       <path d="M-20 410 Q80 385 180 410 T380 410 T580 410 T780 410 T980 410" stroke="#1a2840" stroke-width="3" fill="none"/></g>`,
    aurora: (id) => ceu(id, ['#1b2140', '#6b4a7a', '#f3a76a']) + chao('#3a3550', 370),
    ceu: (id) => ceu(id, ['#5fa8e8', '#a9d6f5', '#e6f4ff']),
    dia: (id) => ceu(id, ['#5fa8e8', '#a9d6f5', '#e6f4ff']) + chao('#7cbf5a', 360, '#68ad49'),
    jardim: (id) => ceu(id, ['#6fc0f0', '#bfe7fb', '#f2fbff']) + chao('#5fb65a', 350, '#49a04a'),
    noite: (id) => ceu(id, ['#0b1026', '#1c2550', '#33407a']) + chao('#1d2a2a', 365, '#172222'),
    deserto: (id) => ceu(id, ['#f2b56b', '#f7d79a', '#fbeccc']) + chao('#e3b873', 360, '#d4a35e'),
    'por-do-sol': (id) => ceu(id, ['#3b2a5a', '#c4566a', '#f6a35b']) + chao('#4a2e3a', 365, '#3a2430'),
    tempestade: (id) => ceu(id, ['#2a2f3a', '#4a5262', '#6b7484']) + chao('#3c4a3a', 370),
    mar: (id) => ceu(id, ['#4b7fb8', '#8ab8dd', '#cfe4f2']) +
      `<rect y="250" width="800" height="200" fill="#2f6fa3"/><rect y="320" width="800" height="130" fill="#285f8e"/>`,
    egito: (id) => ceu(id, ['#e9a24f', '#f5cf7d', '#fdf0c8']) + chao('#e0b46a', 355) +
      `<path d="M0 395 Q200 380 400 395 T800 392 V418 Q600 405 400 420 T0 416Z" fill="#3f8fc0" opacity=".85"/>` +
      `<path d="M0 418 Q300 408 800 420 V450 H0Z" fill="#cfa25a"/>`,
    interior: (id) => `<rect width="800" height="450" fill="#c9a77c"/>
      <g fill="#b8956a" opacity=".6">${Array.from({ length: 6 }, (_, r) => Array.from({ length: 9 }, (_, c) =>
        `<rect x="${c * 100 - (r % 2) * 50}" y="${r * 60}" width="96" height="56" rx="3"/>`).join('')).join('')}</g>
      <rect y="360" width="800" height="90" fill="#8a6644"/><rect y="360" width="800" height="6" fill="#6e5034"/>`,
    prisao: (id) => `<rect width="800" height="450" fill="#5a5450"/>
      <g fill="#4c4743">${Array.from({ length: 6 }, (_, r) => Array.from({ length: 9 }, (_, c) =>
        `<rect x="${c * 100 - (r % 2) * 50}" y="${r * 60}" width="96" height="56" rx="3"/>`).join('')).join('')}</g>
      <rect y="365" width="800" height="85" fill="#3c3835"/>`,
    montanha: (id) => ceu(id, ['#6aa6dc', '#b6d8f0', '#eef7fc']) +
      `<path d="M0 360 L180 170 L300 280 L430 120 L600 300 L700 220 L800 300 V450 H0Z" fill="#8a8f9e"/>
       <path d="M430 120 L470 170 L450 165 L430 185 L410 162 L395 168Z" fill="#fff"/>` + chao('#7a9a5a', 370),
    fogo: (id) => ceu(id, ['#3a0a0a', '#a3261a', '#f07a2a']) + chao('#2a1a14', 365),
    agua: (id) => ceu(id, ['#56708a', '#7f97ab', '#a9b9c6']) +
      `<rect y="230" width="800" height="220" fill="#3d6688"/>`,
  };

  /* ---------- pessoa ---------- */
  const PELES = ['#f1c9a0', '#d9a67a', '#b97d53', '#8d5a3a'];
  function pessoa(o) {
    const cor = o.cor || '#7a5a9a';
    const pele = o.pele || PELES[1];
    const velho = !!o.velho;
    const cabelo = o.cabelo || (velho ? '#e8e8e8' : '#3a2a1e');
    const barba = o.barba === true ? cabelo : o.barba;
    const br = o.bracos || 'baixo';
    const bracos = {
      baixo: ['M-12 -64 L-22 -28', 'M12 -64 L22 -28'],
      cima: ['M-12 -64 L-30 -104', 'M12 -64 L30 -104'],
      aberto: ['M-12 -64 L-44 -62', 'M12 -64 L44 -62'],
      frente: ['M-12 -64 L-4 -40', 'M12 -64 L34 -52'],
      orando: ['M-12 -64 L-2 -80', 'M12 -64 L2 -80'],
      rosto: ['M-12 -64 L-8 -86', 'M12 -64 L8 -86'],
    }[br];
    const listras = o.listras
      ? `<clipPath id="cl${++uid}"><path d="M-22 0 L-14 -70 Q0 -78 14 -70 L22 0Z"/></clipPath>
         <g clip-path="url(#cl${uid})">${['#d9483b', '#f2b134', '#3c9a5f', '#3a6fc4', '#9b4dbb', '#e07b2a'].map((c, i) =>
          `<rect x="-30" y="${-78 + i * 13}" width="60" height="13" fill="${c}"/>`).join('')}</g>` : '';
    const ajoelhado = o.pose === 'ajoelhado';
    const deitado = o.pose === 'deitado';
    const corpo = ajoelhado
      ? `<path d="M-20 0 L-14 -50 Q0 -58 14 -50 L24 0Z" fill="${cor}"/>`
      : `<path d="M-22 0 L-14 -70 Q0 -78 14 -70 L22 0Z" fill="${cor}"/>${listras}`;
    const dy = ajoelhado ? 20 : 0;
    const cab = `<g transform="translate(0 ${dy})">
      ${o.veu ? `<path d="M-19 -82 Q-20 -108 0 -108 Q20 -108 19 -82 L22 -60 L-22 -60Z" fill="${o.veu}"/>` : ''}
      ${o.longo && !o.veu ? `<path d="M-15 -94 Q-22 -62 -16 -58 L16 -58 Q22 -62 15 -94Z" fill="${cabelo}"/>` : ''}
      <circle cy="-88" r="14" fill="${pele}"/>
      ${o.veu ? '' : `<path d="M-14 -90 Q-14 -104 0 -104 Q14 -104 14 -90 Q8 -98 0 -98 Q-8 -98 -14 -90Z" fill="${cabelo}"/>`}
      ${barba ? `<path d="M-11 -86 Q-12 -66 0 -64 Q12 -66 11 -86 Q6 -78 0 -78 Q-6 -78 -11 -86Z" fill="${barba}"/>` : ''}
      <circle cx="-5" cy="-90" r="1.8" fill="#2a1a10"/><circle cx="5" cy="-90" r="1.8" fill="#2a1a10"/>
      ${o.triste ? '<path d="M-4 -80 Q0 -83 4 -80" stroke="#6a3a2a" stroke-width="1.6" fill="none"/>' : (barba ? '' : '<path d="M-4 -82 Q0 -79 4 -82" stroke="#6a3a2a" stroke-width="1.6" fill="none"/>')}
      ${o.coroa ? `<path d="M-12 -100 L-12 -112 L-6 -105 L0 -114 L6 -105 L12 -112 L12 -100Z" fill="#f2c230" stroke="#c99a10" stroke-width="1"/>` : ''}
      ${o.halo ? `<ellipse cy="-110" rx="14" ry="4" fill="none" stroke="#ffe680" stroke-width="3"/>` : ''}
    </g>`;
    const bracosSvg = bracos.map((d) => `<path d="${d}" transform="translate(0 ${dy})" stroke="${cor}" stroke-width="8" stroke-linecap="round" fill="none"/>`).join('') +
      bracos.map((d) => { const p = d.split('L')[1].trim().split(' '); return `<circle cx="${p[0]}" cy="${+p[1] + dy}" r="4.5" fill="${pele}"/>`; }).join('');
    const cajado = o.cajado ? `<path d="M30 0 L30 -112 Q30 -124 20 -122" stroke="#7a5230" stroke-width="5" fill="none" stroke-linecap="round"/>` : '';
    const sombra = `<ellipse cy="2" rx="26" ry="5" fill="#000" opacity=".18"/>`;
    const tudo = sombra + cajado + corpo + bracosSvg + cab;
    return deitado ? `<g transform="rotate(-90) translate(-10 0)">${tudo}</g>` : tudo;
  }

  /* ---------- elementos ---------- */
  const E = {
    pessoa,
    crianca: (o) => pessoa({ ...o, barba: false }),
    anjo: (o) => `<g class="a-brilhar"><ellipse cy="-60" rx="70" ry="80" fill="#fff8d0" opacity=".25"/></g>
      <path d="M-10 -66 Q-70 -110 -64 -40 Q-40 -50 -12 -50Z" fill="#fff" stroke="#e5e0c8"/>
      <path d="M10 -66 Q70 -110 64 -40 Q40 -50 12 -50Z" fill="#fff" stroke="#e5e0c8"/>` +
      pessoa({ cor: '#fdfbf2', pele: o.pele || PELES[0], cabelo: '#e8c66a', halo: true, bracos: o.bracos || 'aberto', espada: o.espada }),
    luz: (o) => {
      const n = 12, r = o.r || 520;
      const raios = Array.from({ length: n }, (_, i) => {
        const a0 = Math.PI * (0.05 + (i / n) * 0.9), a1 = a0 + 0.035;
        return `<path d="M0 0 L${Math.cos(a0) * r} ${Math.sin(a0) * r} L${Math.cos(a1) * r} ${Math.sin(a1) * r}Z"/>`;
      }).join('');
      return `<defs><radialGradient id="lz${++uid}"><stop offset="0" stop-color="#fffbe0"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient></defs>
        <g fill="#fff4b0" opacity=".45">${raios}</g><circle r="${o.nucleo || 90}" fill="url(#lz${uid})"/>`;
    },
    sol: () => `<circle r="70" fill="#ffe27a" opacity=".25"/><circle r="52" fill="#ffd54f" opacity=".5"/><circle r="40" fill="#ffca28"/>`,
    lua: () => `<circle r="44" fill="#f5f3ce" opacity=".15"/><path d="M0 -30 A30 30 0 1 0 0 30 A22 22 0 1 1 0 -30Z" fill="#f5f3ce"/>`,
    estrelas: (o) => {
      const r = rnd(o.semente || 7), n = o.n || 40, w = o.w || 800, h = o.h || 240;
      return Array.from({ length: n }, (_, i) => {
        const x = r() * w, y = r() * h, s = 0.6 + r() * 1.6;
        return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})"><path class="a-piscar" style="animation-delay:${(r() * 3).toFixed(2)}s" d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3Z" fill="#fff8d8"/></g>`;
      }).join('');
    },
    nuvem: (o) => { const c = o.cor || '#ffffff'; return `<g fill="${c}" opacity=".95"><ellipse cx="0" cy="0" rx="60" ry="26"/><ellipse cx="-34" cy="6" rx="34" ry="20"/><ellipse cx="34" cy="6" rx="38" ry="20"/><ellipse cx="6" cy="-18" rx="34" ry="24"/></g>`; },
    chuva: (o) => {
      const r = rnd(3), w = o.w || 800, h = o.h || 360;
      return `<g stroke="${o.cor || '#bcd3e8'}" stroke-width="2" opacity=".7">` + Array.from({ length: o.n || 80 }, () => {
        const x = r() * w, y = r() * h;
        return `<line class="a-cair" style="animation-delay:${(r() * 1).toFixed(2)}s" x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x - 6).toFixed(0)}" y2="${(y + 18).toFixed(0)}"/>`;
      }).join('') + '</g>';
    },
    agua: (o) => {
      const c = o.cor || '#3f7fb5', c2 = o.cor2 || '#2f6a9c', h = o.h || 140;
      const onda = (cy, cc) => `<path d="M-100 ${cy} Q-50 ${cy - 12} 0 ${cy} T100 ${cy} T200 ${cy} T300 ${cy} T400 ${cy} T500 ${cy} T600 ${cy} T700 ${cy} T800 ${cy} T900 ${cy} V${h + 20} H-100Z" fill="${cc}"/>`;
      return `<g class="a-nadar">${onda(0, c)}</g><g class="a-nadar" style="animation-delay:-2s">${onda(30, c2)}</g>`;
    },
    rio: () => `<path d="M-400 0 Q-200 -14 0 0 T400 0 V22 Q200 10 0 24 T-400 20Z" fill="#4f9bd0"/><path class="a-nadar" d="M-300 10 h60 M-100 8 h40 M120 12 h70" stroke="#bfe3f7" stroke-width="2"/>`,
    peixe: (o) => { const c = o.cor || '#f28c38'; return `<ellipse rx="22" ry="11" fill="${c}"/><path d="M18 0 L34 -10 L34 10Z" fill="${c}"/><circle cx="-12" cy="-3" r="2.5" fill="#222"/>`; },
    passaro: (o) => `<path class="a-bater" d="M-18 0 Q-9 -12 0 0 Q9 -12 18 0" stroke="${o.cor || '#333'}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    pomba: (o) => `<ellipse rx="20" ry="11" fill="#fff" stroke="#ddd"/><circle cx="-18" cy="-8" r="8" fill="#fff" stroke="#ddd"/><path d="M-26 -8 L-32 -6 L-26 -4Z" fill="#f0a030"/>
      <circle cx="-20" cy="-10" r="1.5" fill="#333"/><path class="a-bater" d="M-4 -4 Q8 -34 22 -20 Q14 -6 -4 -4Z" fill="#f4f4f4" stroke="#ddd"/><path d="M18 0 L32 -6 L30 6Z" fill="#fff" stroke="#ddd"/>
      ${o.ramo ? '<path d="M-32 -6 q-10 6 -18 2" stroke="#4a7a2a" stroke-width="2" fill="none"/><ellipse cx="-42" cy="-2" rx="6" ry="3" fill="#6aa84a"/><ellipse cx="-50" cy="2" rx="5" ry="2.5" fill="#6aa84a"/>' : ''}`,
    arvore: (o) => {
      const c = o.cor || '#3f9a4a', f = o.fruto;
      const frutos = f ? [[-24, -112], [18, -128], [26, -96], [-8, -140], [-30, -84], [6, -100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${f}"/>`).join('') : '';
      return `<ellipse cy="2" rx="40" ry="7" fill="#000" opacity=".15"/><path d="M-8 0 L-6 -70 L6 -70 L8 0Z" fill="#7a5230"/>
        <g class="a-balancar"><circle cx="0" cy="-110" r="44" fill="${c}"/><circle cx="-32" cy="-86" r="30" fill="${c}"/><circle cx="32" cy="-88" r="30" fill="${c}"/><circle cx="0" cy="-140" r="28" fill="${c}"/>${frutos}</g>`;
    },
    palmeira: () => `<path d="M0 0 Q-6 -60 6 -130" stroke="#8a6234" stroke-width="10" fill="none"/>
      <g class="a-balancar" transform="translate(6 -130)" fill="#3f9a4a">
      <path d="M0 0 Q-40 -20 -70 10 Q-40 -5 0 0"/><path d="M0 0 Q40 -20 70 10 Q40 -5 0 0"/><path d="M0 0 Q-30 -40 -50 -40 Q-25 -20 0 0"/><path d="M0 0 Q30 -40 55 -38 Q25 -20 0 0"/><path d="M0 0 Q0 -40 -6 -55 Q6 -30 0 0"/></g>`,
    flores: (o) => {
      const r = rnd(o.semente || 11), w = o.w || 300, cores = ['#ff6b8a', '#ffd23f', '#ffffff', '#c38cff', '#ff9f43'];
      return Array.from({ length: o.n || 14 }, () => {
        const x = r() * w, c = cores[Math.floor(r() * cores.length)];
        return `<g transform="translate(${x.toFixed(0)} ${(r() * 20).toFixed(0)})"><path d="M0 0 V-16" stroke="#3f8a3a" stroke-width="2"/><g class="a-balancar">${[0, 72, 144, 216, 288].map((a) => `<circle transform="rotate(${a} 0 -18)" cx="0" cy="-23" r="4" fill="${c}"/>`).join('')}<circle cy="-18" r="3" fill="#f7b500"/></g></g>`;
      }).join('');
    },
    trigo: (o) => {
      const n = o.n || 7, seco = o.seco, c = seco ? '#9a7a4a' : '#e7b53a';
      return Array.from({ length: n }, (_, i) => {
        const x = (i - (n - 1) / 2) * 12;
        return `<g transform="translate(${x} 0)" class="a-balancar" style="animation-delay:${i * 0.15}s"><path d="M0 0 V-70" stroke="${seco ? '#8a6a3a' : '#c99a2a'}" stroke-width="2"/>
          ${Array.from({ length: seco ? 3 : 6 }, (_, k) => `<ellipse cx="${k % 2 ? 4 : -4}" cy="${-70 - k * 7}" rx="${seco ? 2 : 4}" ry="${seco ? 4 : 6}" fill="${c}"/>`).join('')}</g>`;
      }).join('');
    },
    feixe: (o) => `<g transform="rotate(${o.curvado ? 25 : 0} 0 0)"><g fill="#e7b53a">${[-14, -7, 0, 7, 14].map((x) => `<path d="M${x / 2} 0 L${x} -70" stroke="#c99a2a" stroke-width="3"/><ellipse cx="${x}" cy="-76" rx="5" ry="10"/>`).join('')}</g><rect x="-12" y="-40" width="24" height="7" fill="#a0702a"/></g>`,
    montanha: (o) => { const w = o.w || 300, h = o.h || 200; return `<path d="M${-w / 2} 0 L0 ${-h} L${w / 2} 0Z" fill="${o.cor || '#8a8f9e'}"/><path d="M0 ${-h} L${w * 0.09} ${-h * 0.8} L${w * 0.03} ${-h * 0.83} L${-w * 0.03} ${-h * 0.76} L${-w * 0.09} ${-h * 0.8}Z" fill="#fff"/>`; },
    colina: (o) => `<ellipse rx="${o.w || 220}" ry="${o.h || 70}" fill="${o.cor || '#6aa84a'}"/>`,
    serpente: () => `<path class="a-balancar" d="M-40 0 Q-20 -30 0 -10 T40 -20 Q55 -26 60 -44" stroke="#4f9a3a" stroke-width="12" fill="none" stroke-linecap="round"/>
      <ellipse cx="62" cy="-48" rx="11" ry="8" fill="#4f9a3a"/><circle cx="66" cy="-51" r="2" fill="#ff0"/><path d="M72 -46 l10 2 m-10 -2 l9 -4" stroke="#d22" stroke-width="1.5"/>`,
    ovelha: (o) => `<ellipse cy="2" rx="30" ry="5" fill="#000" opacity=".15"/><g fill="#333"><rect x="-16" y="-14" width="5" height="16"/><rect x="10" y="-14" width="5" height="16"/></g>
      <g fill="${o.cor || '#f7f7f2'}">${[[-14, -26], [0, -32], [14, -26], [-6, -20], [8, -20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13"/>`).join('')}</g>
      <ellipse cx="-28" cy="-30" rx="9" ry="11" fill="#3a3a3a"/><circle cx="-31" cy="-32" r="1.5" fill="#fff"/>
      ${o.chifres ? '<path d="M-26 -40 q10 -6 8 6 q-2 6 -6 2" stroke="#b8a07a" stroke-width="4" fill="none"/>' : ''}`,
    leao: () => `<ellipse cy="2" rx="40" ry="6" fill="#000" opacity=".15"/><ellipse cy="-28" rx="40" ry="20" fill="#e0a23a"/><g fill="#e0a23a"><rect x="-32" y="-18" width="8" height="20"/><rect x="22" y="-18" width="8" height="20"/></g>
      <path d="M38 -30 q20 -10 16 -26" stroke="#e0a23a" stroke-width="5" fill="none"/><circle cx="-40" cy="-44" r="24" fill="#b5651d"/><circle cx="-40" cy="-44" r="15" fill="#f0b44a"/>
      <circle cx="-45" cy="-47" r="2" fill="#222"/><circle cx="-35" cy="-47" r="2" fill="#222"/><path d="M-43 -38 q3 3 6 0" stroke="#222" fill="none"/>`,
    camelo: () => `<ellipse cy="2" rx="40" ry="6" fill="#000" opacity=".15"/><g fill="#c89a5a"><rect x="-26" y="-40" width="6" height="42"/><rect x="18" y="-40" width="6" height="42"/>
      <ellipse cy="-48" rx="34" ry="16"/><ellipse cx="-4" cy="-62" rx="16" ry="14"/><path d="M-30 -52 Q-44 -70 -44 -88 L-36 -90 Q-34 -72 -24 -56Z"/><ellipse cx="-46" cy="-92" rx="11" ry="7"/></g><circle cx="-50" cy="-94" r="1.5" fill="#222"/>
      <rect x="-20" y="-68" width="30" height="8" fill="#b8432f"/>`,
    vaca: (o) => { const sx = o.magra ? 0.6 : 1, c = o.cor || (o.magra ? '#8a7a6a' : '#f2e8dc'); return `<ellipse cy="2" rx="36" ry="5" fill="#000" opacity=".15"/>
      <g fill="#5a4a3a"><rect x="-24" y="-24" width="5" height="26"/><rect x="18" y="-24" width="5" height="26"/></g><ellipse cy="-34" rx="${34 * sx + (o.magra ? 6 : 0)}" ry="${16 * sx + 2}" fill="${c}"/>
      ${o.magra ? '<path d="M-10 -40 v10 M-4 -42 v12 M2 -42 v12 M8 -40 v10" stroke="#5a4a3a" stroke-width="1.5"/>' : '<ellipse cx="8" cy="-36" rx="9" ry="6" fill="#6a4a3a"/>'}
      <ellipse cx="-38" cy="-40" rx="11" ry="9" fill="${c}"/><path d="M-44 -48 l-6 -6 M-32 -48 l6 -6" stroke="#ddd" stroke-width="3"/><circle cx="-41" cy="-42" r="1.6" fill="#222"/>`; },
    arca: () => `<path d="M-170 -40 L170 -40 L140 20 L-140 20Z" fill="#8a5a30"/><path d="M-160 -26 H160 M-150 -8 H150 M-142 8 H142" stroke="#6e4422" stroke-width="2"/>
      <rect x="-110" y="-90" width="220" height="50" fill="#a06a3a"/><path d="M-120 -90 L0 -120 L120 -90Z" fill="#7a4a24"/>
      <rect x="-80" y="-76" width="26" height="18" fill="#3a2410"/><rect x="-14" y="-76" width="26" height="18" fill="#3a2410"/><rect x="52" y="-76" width="26" height="18" fill="#3a2410"/>`,
    'arco-iris': () => ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#5b4bd1', '#9b59b6'].map((c, i) =>
      `<path d="M${-300 + i * 14} 0 A${300 - i * 14} ${260 - i * 14} 0 0 1 ${300 - i * 14} 0" stroke="${c}" stroke-width="14" fill="none" opacity=".85"/>`).join(''),
    torre: (o) => { const n = o.andares || 5; return Array.from({ length: n }, (_, i) => { const w = 220 - i * 36, h = 44;
      return `<rect x="${-w / 2}" y="${-(i + 1) * h}" width="${w}" height="${h}" fill="${i % 2 ? '#c99a62' : '#b88850'}" stroke="#8a6234"/><rect x="-8" y="${-(i + 1) * h + 14}" width="16" height="22" fill="#6a4a2a"/>`; }).join('') +
      `<path d="M-30 ${-n * 44} l10 -14 l12 8 l10 -12 l12 10 l8 -6 V${-n * 44}Z" fill="#c99a62" opacity=".7"/>`; },
    tenda: (o) => { const c = o.cor || '#c8704a'; return `<path d="M-80 0 L0 -100 L80 0Z" fill="${c}"/><path d="M-50 0 L0 -100 L50 0" stroke="#fff" stroke-opacity=".35" stroke-width="6" fill="none"/>
      <path d="M-18 0 L0 -44 L18 0Z" fill="#3a2410"/><path d="M0 -100 V-112" stroke="#6a4a2a" stroke-width="3"/>`; },
    altar: (o) => `<g fill="#9a9a90" stroke="#6a6a60">${[[-36, -18], [-12, -18], [12, -18], [-24, -36], [0, -36], [-12, -54]].map(([x, y]) => `<rect x="${x}" y="${y}" width="24" height="18" rx="4"/>`).join('')}</g>` +
      (o.fogo === false ? '' : `<g transform="translate(0 -54)">${E.fogo({})}</g>`),
    fogo: () => `<g class="a-tremer"><path d="M-20 0 Q-26 -30 -6 -50 Q-8 -30 4 -26 Q2 -44 14 -60 Q30 -30 20 0Z" fill="#f05a28"/><path d="M-10 0 Q-14 -20 0 -34 Q2 -18 10 -16 Q16 -8 10 0Z" fill="#ffc83a"/></g>`,
    cidade: (o) => { const c = o.cor || '#a88a6a', r = rnd(o.semente || 5); let x = -(o.w || 300) / 2, s = '';
      while (x < (o.w || 300) / 2) { const w = 30 + r() * 40, h = 40 + r() * 90; s += `<rect x="${x.toFixed(0)}" y="${-h.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${c}" stroke="#00000022"/>` +
        `<rect x="${(x + w / 2 - 5).toFixed(0)}" y="${(-h + 14).toFixed(0)}" width="10" height="12" fill="${o.janela || '#5a4030'}"/>`; x += w + 2; }
      return s; },
    piramide: (o) => `<path d="M-120 0 L0 -${o.h || 150} L120 0Z" fill="#e2b66a"/><path d="M0 -${o.h || 150} L120 0 L30 0Z" fill="#c99a4f"/>`,
    poco: () => `<ellipse cy="-40" rx="40" ry="12" fill="#5a5a55"/><path d="M-40 -40 V0 Q0 14 40 0 V-40" fill="#9a958a"/><path d="M-40 -28 Q0 -16 40 -28 M-40 -14 Q0 -2 40 -14" stroke="#7a756a" fill="none"/>
      <ellipse cy="-40" rx="32" ry="8" fill="#2a4a6a"/><path d="M-36 -40 V-90 M36 -40 V-90 M-42 -90 H42" stroke="#7a5230" stroke-width="5"/><path d="M0 -90 V-62" stroke="#a88" stroke-width="2"/><rect x="-8" y="-62" width="16" height="12" fill="#7a5230"/>`,
    escada: (o) => { const h = o.h || 330; return `<g class="a-brilhar"><path d="M-30 0 L-14 ${-h} M30 0 L14 ${-h}" stroke="#ffe9a0" stroke-width="6"/>${Array.from({ length: 14 }, (_, i) => {
      const t = (i + 1) / 15, y = -h * t, dx = 30 - 16 * t; return `<path d="M${-dx} ${y} H${dx}" stroke="#ffe9a0" stroke-width="4"/>`; }).join('')}</g>`; },
    palacio: () => `<rect x="-200" y="-200" width="400" height="200" fill="#e8d2a2"/><rect x="-220" y="-224" width="440" height="28" fill="#cfa96a"/>
      ${[-170, -100, -30, 40, 110, 180].map((x) => `<rect x="${x - 12}" y="-196" width="24" height="196" fill="#f3e3bf"/><rect x="${x - 16}" y="-200" width="32" height="10" fill="#d9b678"/>`).join('')}
      <path d="M-220 -224 H220" stroke="#3a7ab0" stroke-width="6"/>`,
    grades: () => `<rect x="-60" y="-80" width="120" height="80" fill="#1a1816"/><g stroke="#888" stroke-width="5">${[-40, -20, 0, 20, 40].map((x) => `<path d="M${x} -80 V0"/>`).join('')}</g><rect x="-64" y="-84" width="128" height="88" fill="none" stroke="#3a3632" stroke-width="8"/>`,
    coroa: () => `<path d="M-30 0 L-30 -30 L-15 -14 L0 -36 L15 -14 L30 -30 L30 0Z" fill="#f2c230" stroke="#b8900f" stroke-width="2"/><circle cy="-8" r="4" fill="#d22"/>`,
    tunica: () => `<clipPath id="tn${++uid}"><path d="M-40 -90 L-70 -60 L-55 -45 L-40 -55 L-36 0 H36 L40 -55 L55 -45 L70 -60 L40 -90 Q0 -80 -40 -90Z"/></clipPath>
      <g clip-path="url(#tn${uid})">${['#d9483b', '#f2b134', '#3c9a5f', '#3a6fc4', '#9b4dbb', '#e07b2a', '#d9483b'].map((c, i) => `<rect x="-80" y="${-95 + i * 14}" width="160" height="14" fill="${c}"/>`).join('')}</g>`,
    saco: (o) => `<path d="M-22 0 Q-30 -30 -14 -44 L-8 -52 H8 L14 -44 Q30 -30 22 0Z" fill="#c9a26a" stroke="#8a6a3a"/><path d="M-10 -48 H10" stroke="#6a4a2a" stroke-width="3"/>
      ${o.moedas ? '<g fill="#f2c230" stroke="#b8900f"><circle cx="-4" cy="-56" r="5"/><circle cx="6" cy="-58" r="5"/></g>' : ''}`,
    taca: () => `<path d="M-16 -50 H16 Q14 -26 0 -24 Q-14 -26 -16 -50Z" fill="#d8dde3" stroke="#9aa"/><path d="M0 -24 V-6 M-10 0 H10 L6 -6 H-6Z" stroke="#9aa" fill="#d8dde3" stroke-width="2"/>`,
    pedras: () => `<g fill="#9a9a90" stroke="#6a6a60">${[[-30, -16, 18], [0, -16, 20], [30, -16, 17], [-15, -40, 17], [15, -40, 17], [0, -62, 15]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}"/>`).join('')}</g>`,
    'espada-fogo': () => `<g class="a-girar"><path d="M0 -70 V40" stroke="#ffcc33" stroke-width="6"/><path d="M-6 -70 Q0 -110 6 -70" fill="#ff7a2a"/>${E.fogo({}).replace('class="a-tremer"', 'transform="translate(0 -60) scale(.7)"')}</g>`,
    tocha: () => `<rect x="-10" y="-30" width="20" height="30" fill="#5a3a20"/><g transform="translate(0 -28)">${E.fogo({})}</g>`,
    trono: () => `<rect x="-36" y="-110" width="72" height="20" rx="6" fill="#d9a520"/><rect x="-30" y="-90" width="60" height="60" fill="#c8941a"/><rect x="-40" y="-34" width="80" height="14" fill="#d9a520"/><rect x="-36" y="-20" width="8" height="20" fill="#a87410"/><rect x="28" y="-20" width="8" height="20" fill="#a87410"/>`,
    cesto: () => `<path d="M-30 -24 H30 L24 0 H-24Z" fill="#b8864a"/><path d="M-30 -24 H30" stroke="#8a5a2a" stroke-width="3"/>${[-16, 0, 16].map((x) => `<ellipse cx="${x}" cy="-30" rx="10" ry="7" fill="#e6b86a"/>`).join('')}`,
    videira: () => `<path d="M0 0 Q-10 -40 10 -80 Q24 -110 0 -130" stroke="#6a4a2a" stroke-width="5" fill="none"/>${[[-10, -60], [16, -96], [-6, -118]].map(([x, y]) => `<ellipse cx="${x + 10}" cy="${y - 6}" rx="12" ry="7" fill="#4f9a3a"/><g fill="#7a3a9a">${[[0, 0], [6, 0], [3, 6], [9, 6], [6, 12], [-3, 6]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b + 4}" r="3.5"/>`).join('')}</g>`).join('')}`,
    mesa: () => `<rect x="-120" y="-50" width="240" height="12" fill="#8a5a30"/><rect x="-110" y="-38" width="10" height="38" fill="#6e4422"/><rect x="100" y="-38" width="10" height="38" fill="#6e4422"/>
      <ellipse cx="-60" cy="-56" rx="24" ry="7" fill="#eee"/><ellipse cx="-60" cy="-62" rx="14" ry="8" fill="#c98a3a"/><ellipse cx="10" cy="-58" rx="18" ry="9" fill="#e6b86a"/><circle cx="64" cy="-60" r="9" fill="#7a3a9a"/><circle cx="76" cy="-58" r="8" fill="#d23a2a"/>`,
    carroca: () => `<rect x="-60" y="-50" width="120" height="30" fill="#9a6a3a"/><circle cx="-36" cy="-14" r="16" fill="none" stroke="#5a3a1a" stroke-width="5"/><circle cx="36" cy="-14" r="16" fill="none" stroke="#5a3a1a" stroke-width="5"/><path d="M-60 -36 H-100" stroke="#5a3a1a" stroke-width="4"/>`,
    moedas: () => `<g fill="#f2c230" stroke="#b8900f">${[[-14, -6], [0, -6], [14, -6], [-7, -16], [7, -16], [0, -26]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5"/>`).join('')}</g>`,
    caverna: () => `<path d="M-140 0 Q-140 -140 0 -150 Q140 -140 140 0Z" fill="#8a7a66"/><path d="M-50 0 Q-50 -80 0 -84 Q50 -80 50 0Z" fill="#2a221a"/>`,
    bebe: () => `<ellipse cy="-12" rx="24" ry="12" fill="#f4efe2" stroke="#d8cdb4"/><circle cx="-18" cy="-16" r="9" fill="#f1c9a0"/><path d="M-21 -17 h2 M-16 -17 h2" stroke="#333"/>`,
    coracao: (o) => `<path d="M0 10 C-30 -10 -24 -36 0 -24 C24 -36 30 -10 0 10Z" fill="${o.cor || '#e74c5c'}"/>`,
    sonho: () => `<g fill="#fff" opacity=".9"><circle cx="0" cy="0" r="5"/><circle cx="14" cy="-16" r="8"/></g>`,
    fala: (o) => {
      const t = esc(o.texto || ''), linhas = t.split('\n'), w = Math.max(...linhas.map((l) => l.length)) * 9.4 + 28, h = linhas.length * 22 + 16;
      const tx = o.cauda === 'dir' ? w - 24 : 24;
      return `<g class="a-surgir"><rect x="0" y="${-h}" width="${w}" height="${h}" rx="14" fill="#fffdf6" stroke="#3a2e22" stroke-width="2"/>
        <path d="M${tx - 8} -1 L${tx} 16 L${tx + 10} -1" fill="#fffdf6" stroke="#3a2e22" stroke-width="2"/><path d="M${tx - 7} -2 H${tx + 9}" stroke="#fffdf6" stroke-width="4"/>
        ${linhas.map((l, i) => `<text x="14" y="${-h + 26 + i * 22}" font-family="Nunito, system-ui, sans-serif" font-size="17" font-weight="700" fill="#3a2e22">${l}</text>`).join('')}</g>`;
    },
    rotulo: (o) => { const t = esc(o.texto || ''), w = t.length * 10 + 30;
      return `<rect width="${w}" height="34" rx="17" fill="#000" opacity=".35"/><text x="${w / 2}" y="23" text-anchor="middle" font-family="Merriweather, Georgia, serif" font-size="17" font-weight="700" fill="#fff">${t}</text>`; },
  };

  const SEM_ESPELHO = new Set(['fala', 'rotulo']);

  function render(cena, opts = {}) {
    const id = 'c' + (++uid);
    const fundo = (FUNDOS[cena.fundo] || FUNDOS.dia)(id);
    const els = (cena.el || []).map((o) => {
      const f = E[o.t];
      if (!f) { console.warn('Elemento desconhecido:', o.t); return ''; }
      return grupo(o, f(o), SEM_ESPELHO.has(o.t));
    }).join('');
    const titulo = opts.titulo ? `<title>${esc(opts.titulo)}</title>` : '';
    return `<svg class="cena-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid slice">${titulo}${fundo}${els}</svg>`;
  }

  return { render, elementos: Object.keys(E), fundos: Object.keys(FUNDOS) };
})();
