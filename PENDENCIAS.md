# Pendências (backlog)

Itens combinados para implementar depois. Ao concluir um item, marque-o com `[x]` e indique o PR.

## Bíblia integrada ao portal

- [ ] **1. Leitor da Bíblia no próprio portal, com "de-para" para as histórias**
  - Novo item no menu principal ("Bíblia") para ler a Bíblia Livre (BLIVRE) dentro do portal: livro → capítulo → versículos.
  - **Bíblia → história:** em cada capítulo ou trecho da Bíblia que já tenha história ilustrada, um link para a cena correspondente.
  - **História → Bíblia:** cada cena leva ao trecho correspondente no leitor completo, além do painel "Ler na Bíblia" atual.
  - Base disponível: `biblia/blivre/` (texto completo), `js/biblia-texto.js` (carga e referências) e os campos `ref` das cenas, que já mapeiam história → versículos.
  - Rota sugerida: `#/biblia/<livro>/<capitulo>` (com destaque opcional de versículos, ex.: `#/biblia/genesis/22?v=1-8`).

- [ ] **2. Referências cruzadas entre trechos bíblicos**
  - Um trecho muitas vezes se relaciona com outros capítulos e versículos (ex.: Gn 3:15 ↔ Gl 4:4; Gn 22 ↔ Hb 11:17-19; Gn 15:6 ↔ Rm 4:3).
  - **Nas histórias:** mostrar "Veja também" com as referências relacionadas de cada cena ou capítulo.
  - **Na Bíblia (leitor do item 1):** em cada versículo ou trecho, listar as referências cruzadas e as histórias do portal que o recontam.
  - A fonte de referências cruzadas deve ter licença livre (ex.: Treasury of Scripture Knowledge, de domínio público, ou dados abertos do OpenBible.info, CC BY), a confirmar antes de usar.
  - Validar no CI que todas as referências cruzadas existem no texto (`TEXTO_BIBLICO.verificar`).
