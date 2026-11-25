/* In Lumen: aplicação de página única com rotas por hash:
 *   #/                       início (todos os livros)
 *   #/livro/<id>             página do livro
 *   #/livro/<id>/<capítulo>  história ilustrada do capítulo
 *   #/sobre                  sobre o projeto
 * Todos os textos de interface vêm de I18N.t(); o conteúdo vem de conteudo/<idioma>/<livro>.js.
 */
(function () {
  const { livros, porId, SECOES } = window.BIBLIA;
  const { t } = I18N;
  const app = document.getElementById('app');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nome = (l) => I18N.nomeLivro(l);
  /* lang + dir de um trecho cujo idioma pode diferir da interface (ex.: história em pt-BR numa interface em árabe) */
  const attrsIdioma = (idioma) => ` lang="${idioma}" dir="${(I18N.IDIOMAS.find((i) => i.codigo === idioma) || I18N.info()).dir}"`;
  const attrsUI = () => attrsIdioma(I18N.atual);
  const nCaps = (n) => t('capitulos', { n });

  /* ---------- armazenamento local (progresso de leitura) ---------- */
  const CHAVE = 'inlumen:lidos';
  let lidos = new Set();
  try { lidos = new Set(JSON.parse(localStorage.getItem(CHAVE) || '[]')); } catch (e) { /* sem armazenamento */ }
  const salvarLidos = () => { try { localStorage.setItem(CHAVE, JSON.stringify([...lidos])); } catch (e) { /* ignora */ } };
  const foiLido = (id, c) => lidos.has(`${id}:${c}`);
  const marcarLido = (id, c, v = true) => { v ? lidos.add(`${id}:${c}`) : lidos.delete(`${id}:${c}`); salvarLidos(); };
  const lidosDoLivro = (id) => [...lidos].filter((k) => k.startsWith(id + ':')).length;

  /* ---------- tema ---------- */
  try { const tm = localStorage.getItem('inlumen:tema'); if (tm) document.documentElement.dataset.tema = tm; } catch (e) { /* ignora */ }
  document.getElementById('alternar-tema')?.addEventListener('click', () => {
    const escuroAgora = document.documentElement.dataset.tema
      ? document.documentElement.dataset.tema === 'escuro'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    const novo = escuroAgora ? 'claro' : 'escuro';
    document.documentElement.dataset.tema = novo;
    try { localStorage.setItem('inlumen:tema', novo); } catch (e) { /* ignora */ }
  });

  /* ---------- seletor de idioma ---------- */
  const seletor = document.getElementById('idioma');
  if (seletor) {
    seletor.innerHTML = I18N.IDIOMAS.map((i) => `<option value="${i.codigo}" lang="${i.codigo}">${esc(i.nome)}</option>`).join('');
    seletor.value = I18N.atual;
    seletor.addEventListener('change', () => { I18N.definir(seletor.value); atualizarRodape(); rotear(); });
  }
  I18N.aplicarDocumento();
  const rodapeBiblia = document.getElementById('credito-biblia');
  const atualizarRodape = () => { if (rodapeBiblia) rodapeBiblia.innerHTML = `<span${attrsUI()}>${esc(t('rodape.biblia'))}</span> ${creditoHtml(siglaBiblia())}<br>${creditoRefsHtml()}`; };

  /* ---------- carregamento preguiçoso do conteúdo (idioma → original) ---------- */
  const carregando = {};
  function carregarArquivo(id, idioma) {
    const k = idioma + '/' + id;
    if (CONTEUDO.obter(id, idioma)) return Promise.resolve(CONTEUDO.obter(id, idioma));
    if (!carregando[k]) {
      carregando[k] = new Promise((ok) => {
        const s = document.createElement('script');
        s.src = `conteudo/${idioma}/${id}.js`;
        s.onload = () => ok(CONTEUDO.obter(id, idioma) || null);
        s.onerror = () => { delete carregando[k]; ok(null); };
        document.head.appendChild(s);
      });
    }
    return carregando[k];
  }
  /* Retorna { dados, idioma } no idioma atual se existir; senão no idioma original do livro. */
  async function carregarConteudo(id) {
    const l = porId[id];
    if (!l?.disponivel) return { dados: null, idioma: null };
    const ordem = [...new Set([I18N.atual, ...l.idiomas])].filter((i) => l.idiomas.includes(i));
    for (const idioma of ordem) {
      const dados = await carregarArquivo(id, idioma);
      if (dados) return { dados, idioma };
    }
    return { dados: null, idioma: null };
  }
  /* ---------- texto bíblico (Bíblia Livre por padrão) ---------- */
  const TB = window.TEXTO_BIBLICO;
  const siglaBiblia = () => TB.traducaoPara(I18N.atual);
  const rotuloRef = (livro, ref) => `${nome(livro)} ${ref}`;
  /* HTML dos versículos com números; usado no painel "Ler na Bíblia" e no bloco "Para guardar". */
  async function htmlVersiculos(livro, ref, { numeros = true } = {}) {
    const sigla = siglaBiblia();
    const vs = await TB.obter(ref, livro.id, sigla);
    if (!vs.length || vs.some((v) => v.texto == null)) return `<p class="erro-biblia">${esc(t('biblia.erro'))}</p>`;
    const corpo = vs.map((v) => (numeros ? `<sup>${v.c}:${v.v}</sup> ` : '') + TB.formatar(v.texto)).join(' ');
    const info = TB.TRADUCOES[sigla];
    return `<blockquote${attrsIdioma(info.idioma)}>${corpo}</blockquote><cite${attrsIdioma(info.idioma)}>${esc(rotuloRef(livro, ref))} · <abbr title="${esc(TB.credito(sigla))}">${info.sigla}</abbr></cite>`;
  }

  /* 'romanos 4:3-6' (ou '4:3-6' + livro padrão) -> 'Romanos 4:3-6' no idioma da interface */
  function rotuloRefCompleta(ref, livroPadrao) {
    const m = String(ref).match(/^([0-9]?[a-zà-ú]+)\s+(.+)$/i);
    const livro = porId[m ? m[1].toLowerCase() : livroPadrao];
    return `${livro ? nome(livro) : ''} ${m ? m[2] : ref}`.trim();
  }
  /* link para o leitor da Bíblia, no capítulo inicial do trecho, com os versículos destacados */
  function linkLeitor(ref, livroPadrao) {
    const tr = (TB.interpretar(ref, livroPadrao) || [])[0];
    if (!tr) return '#/biblia';
    const r = String(ref).replace(/^([0-9]?[a-zà-ú]+)\s+/i, '');
    return `#/biblia/${tr.livro}/${tr.c1}?r=${encodeURIComponent(r)}`;
  }
  /* chips "Veja também" para uma lista de referências */
  const chipsRefs = (refs, livroPadrao) => refs.map((r) => `<a class="chip-ref" href="${linkLeitor(r, livroPadrao)}">${esc(rotuloRefCompleta(r, livroPadrao))}</a>`).join('');

  const avisoTraducao = (idiomaConteudo) => idiomaConteudo && idiomaConteudo !== I18N.atual
    ? `<div class="aviso" lang="${I18N.atual}">🌐 ${esc(t('cap.semTraducao', { idioma: I18N.info().nome, original: I18N.nomeIdioma(idiomaConteudo) }))}</div>` : '';

  /* ---------- narração por voz (Web Speech API) ---------- */
  const Voz = {
    ok: 'speechSynthesis' in window,
    vozPara(lang) {
      const vs = speechSynthesis.getVoices(), base = lang.split('-')[0];
      return vs.find((v) => v.lang === lang) || vs.find((v) => v.lang?.replace('_', '-').startsWith(base)) || null;
    },
    falar(texto, lang, aoTerminar) {
      if (!this.ok) { aoTerminar && setTimeout(aoTerminar, 7000); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = lang; u.rate = 0.95;
      const v = this.vozPara(lang); if (v) u.voice = v;
      u.onend = () => aoTerminar && aoTerminar();
      speechSynthesis.speak(u);
    },
    parar() { if (this.ok) speechSynthesis.cancel(); },
  };
  if (Voz.ok) speechSynthesis.getVoices();

  /* ---------- cenas de capa para os testamentos ---------- */
  const CAPA_AT = { fundo: 'aurora', el: [
    { t: 'luz', x: 400, y: -20, anim: 'brilhar' }, { t: 'estrelas', x: 0, y: 0, n: 30, h: 200 },
    { t: 'montanha', x: 560, y: 372, w: 340, h: 200, cor: '#4a4060' }, { t: 'tenda', x: 250, y: 380, s: .9 },
    { t: 'pessoa', x: 380, y: 392, cor: '#7a4a2a', barba: true, velho: true, cajado: true, bracos: 'cima' },
    { t: 'ovelha', x: 470, y: 396, s: .8 }, { t: 'ovelha', x: 520, y: 400, s: .7, espelho: true },
  ] };
  const CAPA_NT = { fundo: 'noite', el: [
    { t: 'estrelas', x: 0, y: 0, n: 50, h: 250 }, { t: 'luz', x: 560, y: 60, r: 400, nucleo: 50, anim: 'pulsar' },
    { t: 'colina', x: 400, y: 400, w: 500, h: 80, cor: '#22322a' }, { t: 'cidade', x: 640, y: 370, w: 220, cor: '#2c2a3a', janela: '#f2c26a' },
    { t: 'pessoa', x: 300, y: 395, cor: '#5a6a8a', barba: true, cajado: true }, { t: 'ovelha', x: 360, y: 400, s: .8, espelho: true },
  ] };

  const migalhas = (...itens) => `<div class="migalhas">${itens.map((i) => (i.href ? `<a href="${i.href}">${esc(i.txt)}</a>` : esc(i.txt))).join(' › ')}</div>`;
  const testamentoNome = (l) => t(l.testamento === 'AT' ? 'at.titulo' : 'nt.titulo');

  /* ================= VIEWS ================= */

  function viewInicio() {
    const total = livros.reduce((s, l) => s + l.capitulos, 0);
    const feitos = lidos.size;
    const pct = I18N.numero(feitos / total, { style: 'percent', maximumFractionDigits: 1 });
    const continuar = proximoNaoLido();
    const ptBR = I18N.atual === 'pt-BR';

    const blocoTestamento = (tst) => {
      const secoes = Object.entries(SECOES).filter(([, s]) => s.testamento === tst);
      return `<section class="testamento"><h2>${t(tst === 'AT' ? 'at.titulo' : 'nt.titulo')} <small>${t(tst === 'AT' ? 'at.sub' : 'nt.sub')}</small></h2>
        ${secoes.map(([sid, s]) => `<div class="secao" style="--cor:${s.cor}"><h3>${esc(t('secao.' + sid))}</h3><div class="grade-livros">
          ${livros.filter((l) => l.secao === sid).map((l) => {
            const n = lidosDoLivro(l.id);
            const busca = [nome(l), l.nome, l.abrev, ptBR ? l.resumo : ''].join(' ').toLowerCase();
            return `<a class="cartao-livro" href="#/livro/${l.id}" style="--cor:${s.cor}" data-busca="${esc(busca)}">
              ${l.disponivel ? `<span class="selo">${t('selo.disponivel')}</span>` : `<span class="selo breve">${t('selo.breve')}</span>`}
              <span class="nome">${I18N.numero(l.ordem)}. ${esc(nome(l))}</span>
              <span class="meta">${ptBR ? l.abrev + ' · ' : ''}${esc(nCaps(l.capitulos))}</span>
              ${ptBR ? `<span class="resumo">${esc(l.resumo)}</span>` : ''}
              ${n ? `<span class="mini-barra"><span style="width:${(n / l.capitulos) * 100}%"></span></span>` : ''}
            </a>`;
          }).join('')}</div></div>`).join('')}
      </section>`;
    };

    app.innerHTML = `<div class="container">
      <section class="hero">
        <div>
          <h1>${t('home.titulo')}</h1>
          <p>${t('home.sub')}</p>
          <div class="acoes">
            <a class="botao primario" href="#/livro/${continuar.id}/${continuar.c}">${esc(feitos ? t('home.continuar') : t('home.comecar', { livro: nome(porId.genesis) }))}</a>
            <a class="botao" href="#/sobre">${t('home.comoFunciona')}</a>
          </div>
        </div>
        <div class="palco-mini">${ILUSTRA.render(CAPA_AT, { titulo: t('alt.capa') })}</div>
      </section>
      <div class="progresso-geral">
        <strong>${t('home.jornada')}</strong>
        <div class="barra" role="progressbar" aria-valuenow="${feitos}" aria-valuemin="0" aria-valuemax="${total}"><span style="width:${(feitos / total) * 100}%"></span></div>
        <span>${esc(t('home.progresso', { feitos: I18N.numero(feitos), total: I18N.numero(total), pct }))}</span>
      </div>
      <input class="busca" type="search" placeholder="${esc(t('home.busca'))}" aria-label="${esc(t('home.busca'))}">
      ${blocoTestamento('AT')}
      ${blocoTestamento('NT')}
    </div>`;

    app.querySelector('.busca').addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      app.querySelectorAll('.cartao-livro').forEach((c) => { c.style.display = !q || c.dataset.busca.includes(q) ? '' : 'none'; });
      app.querySelectorAll('.secao').forEach((s) => { s.style.display = [...s.querySelectorAll('.cartao-livro')].some((c) => c.style.display !== 'none') ? '' : 'none'; });
    });
  }

  function proximoNaoLido() {
    for (const l of livros) {
      if (!l.disponivel) continue;
      for (let c = 1; c <= l.capitulos; c++) if (!foiLido(l.id, c)) return { id: l.id, c };
    }
    return { id: 'genesis', c: 1 };
  }
  const primeiroNaoLido = (l) => { for (let c = 1; c <= l.capitulos; c++) if (!foiLido(l.id, c)) return c; return 1; };

  async function viewLivro(id) {
    const l = porId[id];
    if (!l) return viewNaoEncontrado();
    const { dados, idioma } = await carregarConteudo(id);
    const capa = dados?.capa || (l.testamento === 'AT' ? CAPA_AT : CAPA_NT);
    const caps = dados?.capitulos || {};
    const lang = idioma ? attrsIdioma(idioma) : '';
    const cartaoCap = (c) => {
      const cap = caps[c];
      return `<a class="cartao-cap ${foiLido(id, c) ? 'lido' : ''} ${cap ? '' : 'vazio'}" href="#/livro/${id}/${c}">
        <span class="num">${I18N.numero(c)}</span><span class="tit"${cap ? lang : ''}>${cap ? esc(cap.titulo) : t('cap.emPreparacao')}</span></a>`;
    };
    const lista = dados?.partes?.length
      ? dados.partes.map((p) => `<div class="partes"><h3${lang}>${esc(p.titulo)} <small style="color:var(--suave);font-weight:400">${esc(t('livro.faixa', { de: p.de, ate: p.ate }))}</small></h3>
          <div class="grade-caps">${Array.from({ length: p.ate - p.de + 1 }, (_, i) => cartaoCap(p.de + i)).join('')}</div></div>`).join('')
      : `<div class="grade-caps">${Array.from({ length: l.capitulos }, (_, i) => cartaoCap(i + 1)).join('')}</div>`;
    const idx = livros.indexOf(l);
    const introducao = dados?.introducao || (I18N.atual === 'pt-BR' || !idioma ? l.resumo : '');
    app.innerHTML = `<div class="container">
      ${migalhas({ href: '#/', txt: t('migalha.inicio') }, { txt: testamentoNome(l) }, { txt: t('secao.' + l.secao) })}
      ${avisoTraducao(idioma)}
      <section class="cabecalho-livro">
        <div>
          <h1>${esc(nome(l))}</h1>
          <div class="fichas">
            <span class="ficha">${esc(t('livro.ordem', { n: I18N.numero(l.ordem) }))}</span><span class="ficha">${esc(nCaps(l.capitulos))}</span>
            ${dados?.autor ? `<span class="ficha"${lang}>✍️ ${esc(dados.autor)}</span>` : ''}
            ${dados?.epoca ? `<span class="ficha"${lang}>🕰️ ${esc(dados.epoca)}</span>` : ''}
          </div>
          ${introducao ? `<p${dados?.introducao ? lang : attrsIdioma('pt-BR')}>${esc(introducao)}</p>` : ''}
          ${dados?.tema ? `<p><strong>${t('livro.tema')}</strong> <span${lang}>${esc(dados.tema)}</span></p>` : ''}
          ${!l.disponivel ? `<p class="ficha" style="display:inline-block">${t('livro.preparacao')}</p>` : ''}
          <p style="color:var(--suave)">${esc(t('livro.lidos', { n: I18N.numero(lidosDoLivro(id)), total: I18N.numero(l.capitulos) }))}</p>
          ${l.disponivel ? `<a class="botao primario" href="#/livro/${id}/${primeiroNaoLido(l)}">${t(lidosDoLivro(id) ? 'livro.continuar' : 'livro.comecar')}</a>` : ''}
        </div>
        <div class="palco-mini">${ILUSTRA.render(capa, { titulo: t('alt.livro', { livro: nome(l) }) })}</div>
      </section>
      ${lista}
      <div class="navegacao-cap">
        ${idx > 0 ? `<a class="botao" href="#/livro/${livros[idx - 1].id}">${esc(nome(livros[idx - 1]))}</a>` : '<span></span>'}
        ${idx < livros.length - 1 ? `<a class="botao" href="#/livro/${livros[idx + 1].id}">${esc(nome(livros[idx + 1]))}</a>` : ''}
      </div>
    </div>`;
  }

  let limparCapitulo = null;

  async function viewCapitulo(id, c, params = new URLSearchParams()) {
    const l = porId[id];
    if (!l || !(c >= 1 && c <= l.capitulos)) return viewNaoEncontrado();
    const { dados, idioma } = await carregarConteudo(id);
    const cap = dados?.capitulos?.[c];
    const vizinho = (delta) => {
      if (delta < 0 && c > 1) return { id, c: c - 1, nome: `${nome(l)} ${c - 1}` };
      if (delta > 0 && c < l.capitulos) return { id, c: c + 1, nome: `${nome(l)} ${c + 1}` };
      const p = livros[livros.indexOf(l) + delta];
      if (!p) return null;
      const pc = delta < 0 ? p.capitulos : 1;
      return { id: p.id, c: pc, nome: `${nome(p)} ${pc}` };
    };
    const anterior = vizinho(-1), proximo = vizinho(1);
    const nav = `<div class="navegacao-cap">
      ${anterior ? `<a class="botao" href="#/livro/${anterior.id}/${anterior.c}">${esc(anterior.nome)}</a>` : '<span></span>'}
      <a class="botao" href="#/livro/${id}">${esc(t('cap.listaCaps', { livro: nome(l) }))}</a>
      ${proximo ? `<a class="botao primario" href="#/livro/${proximo.id}/${proximo.c}">${esc(proximo.nome)}</a>` : ''}
    </div>`;
    const mig = migalhas({ href: '#/', txt: t('migalha.inicio') }, { href: `#/livro/${id}`, txt: nome(l) }, { txt: t('migalha.capitulo', { n: I18N.numero(c) }) });

    if (!cap) {
      app.innerHTML = `<div class="container">${mig}
        <div class="capitulo-topo"><h1>${esc(nome(l))} ${c}</h1></div>
        <div class="palco">${ILUSTRA.render(l.testamento === 'AT' ? CAPA_AT : CAPA_NT)}</div>
        <div class="vazio-msg"><h2>${t('cap.vazioTitulo')}</h2><p>${esc(t('cap.vazioTexto', { ref: `${nome(l)} ${c}` }))}</p></div>
        ${nav}</div>`;
      return;
    }

    const cenas = cap.cenas;
    const lang = attrsIdioma(idioma);
    const tituloCena = (cn) => cn.alt || cn.texto;
    app.innerHTML = `<div class="container">${mig}
      ${avisoTraducao(idioma)}
      <div class="capitulo-topo">
        <div><div class="ref">${esc(t('cap.ref', { livro: nome(l), n: I18N.numero(c) }))}</div><h1${lang}>${esc(cap.titulo)}</h1></div>
        <div class="acoes-cap">
          <a class="botao botao-leve" href="#/biblia/${id}/${c}">📖 ${esc(t('leitor.lerCap', { ref: `${nome(l)} ${c}` }))}</a>
          <label class="marcar"><input type="checkbox" id="lido" ${foiLido(id, c) ? 'checked' : ''}> ${t('cap.jaLi')}</label>
        </div>
      </div>
      <div class="palco" dir="ltr"${lang}>
        ${cenas.map((cn, i) => `<div class="quadro ${i === 0 ? 'ativo' : ''}" data-i="${i}" aria-hidden="${i !== 0}">${i === 0 ? ILUSTRA.render(cn.cena, { titulo: tituloCena(cn) }) : ''}</div>`).join('')}
        <span class="contador"></span>
      </div>
      <div class="narracao" aria-live="polite"${lang}></div>
      <div class="controles">
        <button class="botao" id="ant">${t('cap.anterior')}</button>
        <button class="botao primario" id="prox"></button>
        <div class="pontos" role="tablist">${cenas.map((_, i) => `<button role="tab" aria-label="${esc(t('cap.cena', { n: i + 1, total: cenas.length }))}" data-i="${i}"></button>`).join('')}</div>
        <button class="botao" id="contar" title="${esc(t('cap.contarDica'))}">${t('cap.contar')}</button>
      </div>
      <div class="blocos"${lang}>
        ${cap.licao ? `<div class="bloco"><h3${attrsUI()}>${t('cap.refletir')}</h3><p>${esc(cap.licao)}</p></div>` : ''}
        ${cap.pergunta ? `<div class="bloco"><h3${attrsUI()}>${t('cap.conversar')}</h3><p>${esc(cap.pergunta)}</p></div>` : ''}
        ${cap.personagens?.length ? `<div class="bloco"><h3${attrsUI()}>${t('cap.personagens')}</h3><div class="fichas">${cap.personagens.map((p) => `<span class="ficha">${esc(p)}</span>`).join('')}</div></div>` : ''}
        ${cap.versiculo ? `<div class="bloco bloco-versiculo"><h3${attrsUI()}>${t('cap.guardar')}</h3><div class="versiculo-guardar"><p class="carregando-biblia">${esc(t('biblia.carregando'))}</p></div></div>` : ''}
      </div>
      ${nav}
    </div>`;

    const guardar = app.querySelector('.versiculo-guardar');
    if (guardar) htmlVersiculos(l, cap.versiculo, { numeros: false }).then((h) => { if (guardar.isConnected) guardar.innerHTML = h; });

    const quadros = [...app.querySelectorAll('.quadro')];
    const narr = app.querySelector('.narracao');
    const pontos = [...app.querySelectorAll('.pontos button')];
    const btnAnt = app.querySelector('#ant'), btnProx = app.querySelector('#prox'), btnContar = app.querySelector('#contar');
    const contador = app.querySelector('.contador');
    const chk = app.querySelector('#lido');
    let atual = 0, contando = false;

    function mostrar(i) {
      atual = Math.max(0, Math.min(cenas.length - 1, i));
      quadros.forEach((q, k) => {
        const ativo = k === atual;
        // (re)cria o SVG ao entrar na cena, reiniciando as animações de entrada
        if (ativo && (!q.innerHTML || !q.classList.contains('ativo'))) q.innerHTML = ILUSTRA.render(cenas[k].cena, { titulo: tituloCena(cenas[k]) });
        q.classList.toggle('ativo', ativo); q.setAttribute('aria-hidden', String(!ativo));
      });
      pontos.forEach((p, k) => { p.classList.toggle('ativo', k === atual); p.setAttribute('aria-selected', String(k === atual)); });
      const cn = cenas[atual];
      narr.innerHTML = `<p>${esc(cn.texto)}</p>` + (cn.ref ? `<details class="texto-biblico"${attrsUI()}>
          <summary>📖 ${esc(t('cap.lerBiblia', { ref: rotuloRef(l, cn.ref) }))}</summary>
          <div class="versiculos"><p class="carregando-biblia">${esc(t('biblia.carregando'))}</p></div></details>
          <div class="veja-tambem"${attrsUI()} hidden><span class="rotulo-veja">${t('cap.vejaTambem')}</span><span class="chips"></span></div>` : '');
      const det = narr.querySelector('details');
      if (det) det.addEventListener('toggle', async () => {
        if (!det.open || det.dataset.ok) return;
        det.dataset.ok = '1';
        det.querySelector('.versiculos').innerHTML = await htmlVersiculos(l, cn.ref) +
          `<a class="abrir-leitor"${attrsUI()} href="${linkLeitor(cn.ref, id)}">${esc(t('leitor.abrir'))}</a>`;
      });
      if (cn.ref) {
        const veja = narr.querySelector('.veja-tambem'), cenaAtual = atual;
        REFERENCIAS.doTrecho(cn.ref, id, 6).then((auto) => {
          if (!veja.isConnected || cenaAtual !== atual) return;
          const refs = [...(cn.veja || []), ...auto.filter((r) => !(cn.veja || []).includes(r))].slice(0, 6);
          if (!refs.length) return;
          veja.querySelector('.chips').innerHTML = chipsRefs(refs, id);
          veja.hidden = false;
        });
      }
      contador.textContent = t('cap.cena', { n: I18N.numero(atual + 1), total: I18N.numero(cenas.length) });
      btnAnt.disabled = atual === 0;
      btnProx.textContent = atual === cenas.length - 1 ? t(proximo ? 'cap.proxCap' : 'cap.fim') : t('cap.proxima');
      if (atual === cenas.length - 1 && !foiLido(id, c)) { marcarLido(id, c); chk.checked = true; }
    }
    function avancar() {
      if (atual < cenas.length - 1) mostrar(atual + 1);
      else if (proximo) location.hash = `#/livro/${proximo.id}/${proximo.c}`;
    }
    function pararContar() { contando = false; Voz.parar(); btnContar.textContent = t('cap.contar'); }
    function narrarAtual() {
      if (!contando) return;
      Voz.falar(cenas[atual].texto, idioma, () => {
        if (!contando) return;
        if (atual < cenas.length - 1) { mostrar(atual + 1); setTimeout(narrarAtual, 600); } else pararContar();
      });
    }

    btnAnt.onclick = () => { pararContar(); mostrar(atual - 1); };
    btnProx.onclick = () => { pararContar(); avancar(); };
    pontos.forEach((p) => (p.onclick = () => { pararContar(); mostrar(+p.dataset.i); }));
    btnContar.onclick = () => {
      if (contando) return pararContar();
      contando = true; btnContar.textContent = t('cap.parar'); narrarAtual();
    };
    chk.onchange = () => marcarLido(id, c, chk.checked);
    const rtl = I18N.info().dir === 'rtl';
    const teclas = (e) => {
      if (e.target.matches('input, textarea, select')) return;
      const frente = rtl ? 'ArrowLeft' : 'ArrowRight', tras = rtl ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === frente) { pararContar(); avancar(); }
      if (e.key === tras) { pararContar(); mostrar(atual - 1); }
    };
    document.addEventListener('keydown', teclas);
    // gesto de deslizar no celular
    let x0 = null;
    const palco = app.querySelector('.palco');
    palco.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    palco.addEventListener('touchend', (e) => {
      if (x0 == null) return; let dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (rtl) dx = -dx;
      if (Math.abs(dx) > 50) { pararContar(); dx < 0 ? avancar() : mostrar(atual - 1); }
    });
    limparCapitulo = () => { document.removeEventListener('keydown', teclas); pararContar(); };
    const cenaInicial = parseInt(params.get('cena'), 10);
    mostrar(cenaInicial >= 1 ? cenaInicial - 1 : 0);
  }

  /* ================= LEITOR DA BÍBLIA ================= */

  /* mapa versículo -> cenas que o recontam, a partir do conteúdo ilustrado do livro */
  function indiceHistorias(id, dados) {
    const porVerso = {}; // 'c:v' -> [{cap, cena, titulo, inicio}]
    for (const [n, cap] of Object.entries(dados?.capitulos || {})) {
      cap.cenas.forEach((cn, i) => {
        if (!cn.ref) return;
        TB.expandir(cn.ref, id).filter((x) => x.livro === id).forEach((x, k) => {
          (porVerso[`${x.c}:${x.v}`] = porVerso[`${x.c}:${x.v}`] || []).push({ cap: +n, cena: i + 1, titulo: cap.titulo, inicio: k === 0 });
        });
      });
    }
    return porVerso;
  }

  function viewBiblia() {
    const sigla = siglaBiblia(), tr = TB.TRADUCOES[sigla];
    const bloco = (tst) => `<section class="testamento"><h2>${t(tst === 'AT' ? 'at.titulo' : 'nt.titulo')}</h2>
      ${Object.entries(SECOES).filter(([, s]) => s.testamento === tst).map(([sid, s]) => `<div class="secao" style="--cor:${s.cor}"><h3>${esc(t('secao.' + sid))}</h3>
        <div class="grade-biblia">${livros.filter((l) => l.secao === sid).map((l) =>
          `<a class="livro-biblia" href="#/biblia/${l.id}" style="--cor:${s.cor}">${esc(nome(l))}${l.disponivel ? ' <span title="' + esc(t('leitor.temHistoria')) + '">🎬</span>' : ''}</a>`).join('')}</div></div>`).join('')}
      </section>`;
    app.innerHTML = `<div class="container">
      ${migalhas({ href: '#/', txt: t('migalha.inicio') }, { txt: t('leitor.titulo') })}
      <h1>${t('leitor.titulo')}</h1>
      <p class="intro-leitor">${esc(t('leitor.sub', { versao: `${tr.nome} (${tr.sigla})` }))}</p>
      ${bloco('AT')}${bloco('NT')}
    </div>`;
  }

  async function viewBibliaLivro(id) {
    const l = porId[id];
    if (!l) return viewNaoEncontrado();
    const { dados } = await carregarConteudo(id);
    app.innerHTML = `<div class="container">
      ${migalhas({ href: '#/', txt: t('migalha.inicio') }, { href: '#/biblia', txt: t('leitor.titulo') }, { txt: nome(l) })}
      <h1>${esc(nome(l))}</h1>
      ${l.disponivel ? `<p><a class="botao" href="#/livro/${id}">🎬 ${esc(t('leitor.historiaLivro', { livro: nome(l) }))}</a></p>` : ''}
      <div class="grade-num">${Array.from({ length: l.capitulos }, (_, i) => i + 1).map((c) =>
        `<a href="#/biblia/${id}/${c}" class="${dados?.capitulos?.[c] ? 'com-historia' : ''}" title="${dados?.capitulos?.[c] ? esc(dados.capitulos[c].titulo) : ''}">${c}</a>`).join('')}</div>
    </div>`;
  }

  async function viewBibliaCapitulo(id, c, params) {
    const l = porId[id];
    if (!l || !(c >= 1 && c <= l.capitulos)) return viewNaoEncontrado();
    const sigla = siglaBiblia(), tr = TB.TRADUCOES[sigla];
    const [caps, refsLivro, { dados }] = await Promise.all([TB.carregarLivro(sigla, id), REFERENCIAS.carregar(id), carregarConteudo(id)]);
    if (!caps) { app.innerHTML = `<div class="container vazio-msg"><p>${esc(t('biblia.erro'))}</p></div>`; return; }
    const historias = indiceHistorias(id, dados);
    const destaque = new Set();
    const r = params.get('r');
    // aceita '22:9-12' e também a forma curta '9-12' (versículos do capítulo aberto)
    if (r) TB.expandir(/^\d+(-\d+)?$/.test(r) ? `${c}:${r}` : r, id).forEach((x) => { if (x.livro === id && x.c === c) destaque.add(x.v); });
    const vizinho = (d) => {
      if (c + d >= 1 && c + d <= l.capitulos) return { id, c: c + d, l };
      const p = livros[livros.indexOf(l) + d];
      return p ? { id: p.id, c: d < 0 ? p.capitulos : 1, l: p } : null;
    };
    const ant = vizinho(-1), prox = vizinho(1);
    const nav = `<div class="navegacao-cap">
      ${ant ? `<a class="botao" href="#/biblia/${ant.id}/${ant.c}">← ${esc(nome(ant.l))} ${ant.c}</a>` : '<span></span>'}
      ${prox ? `<a class="botao" href="#/biblia/${prox.id}/${prox.c}">${esc(nome(prox.l))} ${prox.c} →</a>` : ''}
    </div>`;
    const temHistoria = !!dados?.capitulos?.[c];
    const versos = caps[c - 1].map((texto, i) => {
      const v = i + 1, hs = historias[`${c}:${v}`] || [], refs = (refsLivro || {})[`${c}:${v}`] || [];
      const marcos = hs.filter((h) => h.inicio).map((h) =>
        `<a class="marco-historia"${attrsUI()} href="#/livro/${id}/${h.cap}?cena=${h.cena}">${esc(t('leitor.historiaCena', { titulo: h.titulo, n: h.cena }))}</a>`).join('');
      return `${marcos}<p class="verso${destaque.has(v) ? ' destaque' : ''}${hs.length ? ' com-historia' : ''}" id="v${v}">
          <a class="num-verso" href="#/biblia/${id}/${c}?r=${c}:${v}">${v}</a> ${TB.formatar(texto)}
          ${refs.length ? `<button class="btn-refs" data-v="${v}" aria-expanded="false" title="${esc(t('leitor.refs'))}"${attrsUI()}>🔗 ${refs.length}</button>` : ''}
        </p><div class="refs-verso" id="refs-${v}" hidden></div>`;
    }).join('');
    app.innerHTML = `<div class="container leitor">
      ${migalhas({ href: '#/', txt: t('migalha.inicio') }, { href: '#/biblia', txt: t('leitor.titulo') }, { href: `#/biblia/${id}`, txt: nome(l) }, { txt: t('migalha.capitulo', { n: I18N.numero(c) }) })}
      <div class="capitulo-topo">
        <h1>${esc(nome(l))} ${c} <small class="sigla">${tr.sigla}</small></h1>
        ${temHistoria ? `<a class="botao primario" href="#/livro/${id}/${c}">🎬 ${esc(t('leitor.historiaCap'))}</a>` : ''}
      </div>
      ${nav}
      <div class="texto-leitor"${attrsIdioma(tr.idioma)}>${versos}</div>
      ${nav}
      <p class="credito-biblia">${creditoHtml(sigla)}<br>${creditoRefsHtml()}</p>
    </div>`;

    app.querySelectorAll('.btn-refs').forEach((b) => b.addEventListener('click', async () => {
      const v = +b.dataset.v, caixa = app.querySelector('#refs-' + v);
      const abrir = caixa.hidden;
      caixa.hidden = !abrir; b.setAttribute('aria-expanded', String(abrir));
      if (!abrir || caixa.dataset.ok) return;
      caixa.dataset.ok = '1';
      caixa.innerHTML = `<p class="carregando-biblia">${esc(t('biblia.carregando'))}</p>`;
      const refs = refsLivro[`${c}:${v}`] || [];
      const textos = await Promise.all(refs.map((r) => TB.obter(r, id, sigla)));
      caixa.innerHTML = `<ul${attrsIdioma(tr.idioma)}>${refs.map((r, k) => {
        const txt = textos[k].map((x) => x.texto).join(' ');
        const curto = txt.length > 180 ? txt.slice(0, 177).replace(/\s+\S*$/, '') + '…' : txt;
        return `<li><a href="${linkLeitor(r, id)}">${esc(rotuloRefCompleta(r, id))}</a> ${TB.formatar(curto)}</li>`;
      }).join('')}</ul>`;
    }));
    const primeiro = app.querySelector('.verso.destaque');
    if (primeiro) primeiro.scrollIntoView({ block: 'center' });
  }

  function creditoRefsHtml() {
    const r = REFERENCIAS.CREDITO;
    return `${esc(t('rodape.refs'))} <a href="${r.url}" target="_blank" rel="noopener">${esc(r.nome)}</a>, ` +
      `<a href="${r.urlLicenca}" target="_blank" rel="noopener">${esc(r.licenca)}</a> (${esc(r.base)}).`;
  }

  function creditoHtml(sigla = TB.PADRAO) {
    const tr = TB.TRADUCOES[sigla];
    return `<a href="${tr.urlFonte}" target="_blank" rel="noopener">${esc(tr.nome)} (${tr.sigla})</a>, ${esc(tr.descricao)}. ${esc(tr.direitos)}. ` +
      `<a href="${tr.urlLicenca}" target="_blank" rel="noopener">${esc(tr.licenca)}</a>. ${esc(tr.versao)}. Texto reproduzido sem alterações.`;
  }

  function viewSobre() {
    // textos de 'sobre.*' são HTML confiável definido em js/i18n.js
    app.innerHTML = `<div class="container" style="max-width:780px">
      ${migalhas({ href: '#/', txt: t('migalha.inicio') }, { txt: t('migalha.sobre') })}
      <h1>${t('sobre.titulo')}</h1>
      <p>${t('sobre.p1')}</p>
      <h3>${t('sobre.h1')}</h3>
      <ul>${t('sobre.li').map((li) => `<li>${li}</li>`).join('')}</ul>
      <h3>${t('sobre.h2')}</h3>
      <p>${t('sobre.p2')}</p>
      <p>${t('sobre.p3')}</p>
      <h3>${t('sobre.h3')}</h3>
      <p>${esc(t('sobre.p4', { versao: `${TB.TRADUCOES[TB.PADRAO].nome} (${TB.TRADUCOES[TB.PADRAO].sigla})` }))}</p>
      <p class="credito-biblia"${attrsIdioma('pt-BR')}>${creditoHtml()}<br>${creditoRefsHtml()}</p>
      <p><a class="botao primario" href="#/livro/genesis/1">${esc(t('home.comecar', { livro: nome(porId.genesis) }))}</a></p>
    </div>`;
  }

  function viewNaoEncontrado() {
    app.innerHTML = `<div class="container vazio-msg"><h1>${t('nao.titulo')}</h1><p><a class="botao" href="#/">${t('nao.voltar')}</a></p></div>`;
  }

  /* ---------- roteador ---------- */
  async function rotear() {
    if (limparCapitulo) { limparCapitulo(); limparCapitulo = null; }
    const [caminho, consulta] = location.hash.replace(/^#\/?/, '').split('?');
    const partes = caminho.split('/').filter(Boolean);
    const params = new URLSearchParams(consulta || '');
    window.scrollTo({ top: 0 });
    if (!partes.length) viewInicio();
    else if (partes[0] === 'livro' && partes[1] && partes[2]) await viewCapitulo(partes[1], parseInt(partes[2], 10), params);
    else if (partes[0] === 'livro' && partes[1]) await viewLivro(partes[1]);
    else if (partes[0] === 'biblia' && partes[1] && partes[2]) await viewBibliaCapitulo(partes[1], parseInt(partes[2], 10), params);
    else if (partes[0] === 'biblia' && partes[1]) await viewBibliaLivro(partes[1]);
    else if (partes[0] === 'biblia') viewBiblia();
    else if (partes[0] === 'sobre') viewSobre();
    else viewNaoEncontrado();
    document.querySelectorAll('.topo nav a').forEach((a) => a.classList.toggle('ativo', a.getAttribute('href') === '#/' + (partes[0] === 'biblia' ? 'biblia' : partes[0] === 'sobre' ? 'sobre' : '')));
    const l = porId[partes[1]];
    const prefixo = partes[0] === 'biblia' ? t('leitor.titulo') + ': ' : '';
    document.title = l ? `${prefixo}${nome(l)}${partes[2] ? ' ' + partes[2] : ''} · In Lumen` : (partes[0] === 'biblia' ? `${t('leitor.titulo')} · In Lumen` : t('site.titulo'));
  }
  window.addEventListener('hashchange', rotear);
  atualizarRodape();
  rotear();
})();
