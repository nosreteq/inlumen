/* Texto bíblico de referência do portal.
 *
 * Base do projeto: Bíblia Livre (BLIVRE), atualização da tradução de João Ferreira de Almeida (1819),
 * licença CC BY 4.0. Os arquivos ficam em biblia/<sigla>/<livro>.js e são carregados sob demanda.
 *
 * Referências aceitas (separadas por ';'):
 *   '1:1'  '1:1-5'  '1:31-2:3'  '12'  'lucas 17:32'  (sem livro = livro atual)
 */
window.TEXTO_BIBLICO = (function () {
  const TRADUCOES = {
    blivre: {
      sigla: 'BLIVRE',
      nome: 'Bíblia Livre',
      idioma: 'pt-BR',
      descricao: 'atualização da tradução de João Ferreira de Almeida (1819), edição Textus Receptus',
      direitos: 'Copyright © 2018 Diego Santos, Mario Sérgio e Marco Teles',
      licenca: 'Creative Commons Atribuição 4.0 Brasil (CC BY 4.0)',
      urlLicenca: 'https://creativecommons.org/licenses/by/4.0/deed.pt_BR',
      urlFonte: 'https://ebible.org/porbr2018/',
      versao: 'eBible.org, arquivos-fonte de 12/12/2025',
    },
  };
  // idioma da interface -> tradução bíblica. Idiomas sem tradução própria usam a padrão.
  // Para adicionar: importe com scripts/importar-biblia.js e registre aqui (ex.: en: 'web').
  const POR_IDIOMA = { 'pt-BR': 'blivre' };
  const PADRAO = 'blivre';

  const dados = {};     // 'sigla/livro' -> [[v1, v2…], …]
  const carregando = {};

  function registrar(sigla, livro, capitulos) { dados[sigla + '/' + livro] = capitulos; }

  function traducaoPara(idioma) { return POR_IDIOMA[idioma] || PADRAO; }

  function carregarLivro(sigla, livro) {
    const k = sigla + '/' + livro;
    if (dados[k]) return Promise.resolve(dados[k]);
    if (typeof document === 'undefined') return Promise.resolve(null);
    if (!carregando[k]) {
      carregando[k] = new Promise((ok) => {
        const s = document.createElement('script');
        s.src = `biblia/${sigla}/${livro}.js`;
        s.onload = () => ok(dados[k] || null);
        s.onerror = () => { delete carregando[k]; ok(null); };
        document.head.appendChild(s);
      });
    }
    return carregando[k];
  }

  /* '1:1-5; lucas 2:1' -> [{livro, c1, v1, c2, v2}]  (v1/v2 null = capítulo inteiro). null se inválida. */
  function interpretar(ref, livroPadrao) {
    const trechos = [];
    for (let parte of String(ref).split(';')) {
      parte = parte.trim();
      let livro = livroPadrao;
      const mLivro = parte.match(/^([0-9]?[a-zà-ú]+)\s+(.+)$/i);
      if (mLivro) { livro = mLivro[1].toLowerCase(); parte = mLivro[2]; }
      let m;
      if ((m = parte.match(/^(\d+):(\d+)-(\d+):(\d+)$/))) trechos.push({ livro, c1: +m[1], v1: +m[2], c2: +m[3], v2: +m[4] });
      else if ((m = parte.match(/^(\d+):(\d+)(?:-(\d+))?$/))) trechos.push({ livro, c1: +m[1], v1: +m[2], c2: +m[1], v2: m[3] ? +m[3] : +m[2] });
      else if ((m = parte.match(/^(\d+)$/))) trechos.push({ livro, c1: +m[1], v1: null, c2: +m[1], v2: null });
      else return null;
    }
    return trechos.length ? trechos : null;
  }

  /* Valida uma referência contra a contagem de versículos (window.VERSICULOS). Retorna mensagem de erro ou null. */
  function verificar(ref, livroPadrao, contagens = window.VERSICULOS) {
    const trechos = interpretar(ref, livroPadrao);
    if (!trechos) return `referência inválida "${ref}"`;
    for (const t of trechos) {
      const caps = contagens[t.livro];
      if (!caps) return `livro desconhecido "${t.livro}" em "${ref}"`;
      const n1 = caps[t.c1 - 1], n2 = caps[t.c2 - 1];
      if (!n1 || !n2) return `capítulo inexistente em "${ref}"`;
      if (t.v1 != null && (t.v1 < 1 || t.v1 > n1)) return `${t.livro} ${t.c1}:${t.v1} não existe (cap. tem ${n1} versículos) em "${ref}"`;
      if (t.v2 != null && (t.v2 < 1 || t.v2 > n2)) return `${t.livro} ${t.c2}:${t.v2} não existe (cap. tem ${n2} versículos) em "${ref}"`;
      if (t.c2 < t.c1 || (t.c2 === t.c1 && t.v1 != null && t.v2 < t.v1)) return `intervalo invertido em "${ref}"`;
    }
    return null;
  }

  /* Expande uma referência em versículos: [{livro, c, v}] */
  function expandir(ref, livroPadrao, contagens = window.VERSICULOS) {
    const out = [];
    for (const t of interpretar(ref, livroPadrao) || []) {
      const caps = contagens[t.livro] || [];
      for (let c = t.c1; c <= t.c2; c++) {
        const ini = c === t.c1 && t.v1 != null ? t.v1 : 1;
        const fim = c === t.c2 && t.v2 != null ? t.v2 : caps[c - 1] || 0;
        for (let v = ini; v <= fim; v++) out.push({ livro: t.livro, c, v });
      }
    }
    return out;
  }

  /* Busca o texto: Promise<[{livro, c, v, texto}]> */
  async function obter(ref, livroPadrao, sigla = PADRAO) {
    const vs = expandir(ref, livroPadrao);
    const livros = [...new Set(vs.map((x) => x.livro))];
    await Promise.all(livros.map((l) => carregarLivro(sigla, l)));
    return vs.map((x) => ({ ...x, texto: dados[sigla + '/' + x.livro]?.[x.c - 1]?.[x.v - 1] ?? null }));
  }

  /* HTML seguro de um versículo; [palavras acrescentadas] ficam em itálico, como nas edições impressas. */
  function formatar(texto) {
    const esc = String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    return esc.replace(/\[([^\]]+)\]/g, '<em class="acrescimo">$1</em>');
  }

  /* Texto de atribuição exigido pela licença. */
  function credito(sigla = PADRAO) {
    const t = TRADUCOES[sigla];
    return `${t.nome} (${t.sigla}), ${t.direitos}. ${t.licenca}.`;
  }

  return { TRADUCOES, POR_IDIOMA, PADRAO, registrar, traducaoPara, carregarLivro, interpretar, verificar, expandir, obter, formatar, credito, _dados: dados };
})();

/* Referências cruzadas (OpenBible.info, CC BY): biblia/referencias/<livro>.js, carregadas sob demanda.
 * Cada versículo tem até 8 referências, ordenadas da mais para a menos relevante. */
window.REFERENCIAS = (function () {
  const CREDITO = {
    nome: 'OpenBible.info Cross References',
    url: 'https://www.openbible.info/labs/cross-references/',
    licenca: 'CC BY',
    urlLicenca: 'https://creativecommons.org/licenses/by/4.0/',
    base: 'Treasury of Scripture Knowledge (domínio público)',
  };
  const dados = {};
  const carregando = {};

  function registrar(livro, mapa) { dados[livro] = mapa; }

  function carregar(livro) {
    if (dados[livro]) return Promise.resolve(dados[livro]);
    if (typeof document === 'undefined') return Promise.resolve(null);
    if (!carregando[livro]) {
      carregando[livro] = new Promise((ok) => {
        const s = document.createElement('script');
        s.src = `biblia/referencias/${livro}.js`;
        s.onload = () => ok(dados[livro] || null);
        s.onerror = () => { delete carregando[livro]; ok(null); };
        document.head.appendChild(s);
      });
    }
    return carregando[livro];
  }

  /* Referências de um versículo: Promise<['romanos 4:3', …]> */
  async function doVersiculo(livro, c, v) {
    const m = await carregar(livro);
    return (m && m[`${c}:${v}`]) || [];
  }

  /* "Veja também" de um trecho: junta as referências de todos os versículos, pontua pela posição
   * (mais relevantes primeiro), remove o que cai dentro do próprio trecho e devolve as `max` melhores. */
  async function doTrecho(ref, livroPadrao, max = 6) {
    const TB = window.TEXTO_BIBLICO;
    const vs = TB.expandir(ref, livroPadrao);
    const proprios = new Set(vs.map((x) => `${x.livro} ${x.c}:${x.v}`));
    await Promise.all([...new Set(vs.map((x) => x.livro))].map(carregar));
    const pontos = new Map();
    for (const x of vs) {
      ((dados[x.livro] || {})[`${x.c}:${x.v}`] || []).forEach((r, i) => pontos.set(r, (pontos.get(r) || 0) + (8 - i)));
    }
    const escolhidas = [], usados = new Set(proprios);
    for (const [r] of [...pontos.entries()].sort((a, b) => b[1] - a[1])) {
      const chaves = TB.expandir(r).map((y) => `${y.livro} ${y.c}:${y.v}`);
      if (chaves.some((k) => usados.has(k))) continue; // sobrepõe o próprio trecho ou uma já escolhida
      chaves.forEach((k) => usados.add(k));
      escolhidas.push(r);
      if (escolhidas.length >= max) break;
    }
    return escolhidas;
  }

  return { CREDITO, registrar, carregar, doVersiculo, doTrecho, _dados: dados };
})();
