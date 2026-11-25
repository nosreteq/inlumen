# Histórico de mudanças

Todas as mudanças relevantes do portal **In Lumen** ficam registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o versionamento segue o [SemVer](https://semver.org/lang/pt-BR/):

- **minor** (0.**x**.0): funcionalidade ou conteúdo novo;
- **patch** (0.0.**x**): correção.

Cada pull request que muda o portal acrescenta uma nova versão no topo.

## [0.6.0] - 2026-11-25

### Adicionado
- **Êxodo completo:** 40 capítulos e 98 cenas ilustradas, cobrindo todos os 1.213 versículos, fiéis à Bíblia Livre: escravidão, nascimento de Moisés, sarça ardente, as dez pragas, a Páscoa, o mar Vermelho, maná, Sinai, Dez Mandamentos, bezerro de ouro e o tabernáculo.
- 15 novos elementos de ilustração (sarça ardente, cesto no rio, tijolos, rãs, moscas, gafanhotos, casa com sangue nas portas, mar aberto, colunas de nuvem e de fogo, maná, rocha com água, tábuas da Lei, tabernáculo, arca da aliança e candelabro), além do peitoral do sumo sacerdote e do rosto resplandecente.
- "Veja também" fixo (`veja`) nas cenas-chave de Êxodo e de Gênesis, ligando promessa ↔ cumprimento no Novo Testamento (ex.: Êx 12 → Jo 1:29; Gn 49 → Ap 5:5).
- `scripts/conferir-numeros.js`: compara os números das histórias, em algarismos ou por extenso, com o texto da BLIVRE.

### Corrigido
- **Gênesis, revisão contra a BLIVRE:**
  - Gn 10: quem construiu Nínive foi Assur, não Ninrode;
  - Gn 5: Enoque "desapareceu, porque Deus o levou" (a ideia de não ver a morte vem de Hebreus);
  - Gn 41: a idade de José (30 anos) foi para a cena do versículo 41:46.
- Validador: cenas com o campo `veja` deixavam de contar na cobertura dos versículos.
- Animação `cair-lento` (usada pelo maná) não existia no CSS.

## [0.5.0] - 2026-11-25

### Adicionado
- **Leitor da Bíblia no portal:** novo item **Bíblia** no menu, com a Bíblia Livre completa: livros (`#/biblia`), capítulos (`#/biblia/<livro>`) e texto (`#/biblia/<livro>/<cap>`), com destaque de versículos por link (`?r=9-12`).
- **De-para Bíblia ↔ histórias:**
  - no leitor, marcos "🎬 História: … · cena N" levam direto à cena que reconta aqueles versículos;
  - nas histórias, "Abrir no leitor da Bíblia →" e o botão "📖 Ler … na Bíblia" fazem o caminho inverso;
  - as histórias podem ser abertas numa cena específica (`?cena=N`).
- **Referências cruzadas** (OpenBible.info, CC BY, derivadas do *Treasury of Scripture Knowledge*), com 193.452 referências:
  - no leitor, o botão 🔗 em cada versículo mostra as referências relacionadas com o texto;
  - nas histórias, "🔗 Veja também" reúne as referências mais relevantes de cada cena, sem trechos repetidos;
  - campo opcional `veja` nas cenas para fixar referências próprias.
- Dados versionados em `biblia/referencias/`, com a fonte original, checksum e o importador `scripts/importar-referencias.js`.
- Este `CHANGELOG.md`.

### Alterado
- O validador do CI agora confere as 193.452 referências cruzadas e o campo `veja`.
- No celular, o menu mostra "Bíblia" no lugar de "Livros" e "Sobre" (a página inicial continua acessível pelo logotipo).
- As skills passaram a orientar o registro de cada mudança neste arquivo. A `escrever-capitulos` ganhou a etapa "Referências cruzadas": revisar o "Veja também" de cada cena e fixar `veja` em promessa ↔ cumprimento, citações AT ↔ NT e paralelos.

### Removido
- `PENDENCIAS.md`: os dois itens pendentes foram implementados nesta versão.

## [0.4.0] - 2026-11-25 ([#3](https://github.com/nosreteq/inlumen/pull/3), [#4](https://github.com/nosreteq/inlumen/pull/4))

### Adicionado
- Skills do Claude Code em `.claude/skills/`:
  - `escrever-capitulos`: recontar capítulos fiéis à BLIVRE;
  - `traduzir-conteudo`: traduzir histórias, interface e nomes dos livros;
  - `publicar`: validar → PR → CI → merge → deploy.

### Corrigido
- **Deploy no GitHub Pages:** a publicação falhava com "No artifacts named github-pages". O empacotamento e a publicação passaram a rodar em jobs separados, e as actions foram atualizadas (`configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`).

## [0.3.0] - 2026-11-25 ([#2](https://github.com/nosreteq/inlumen/pull/2))

### Adicionado
- **Bíblia Livre (BLIVRE)** como texto bíblico de referência de todo o projeto. É uma atualização da tradução de João Ferreira de Almeida (1819), licença CC BY 4.0, versionada completa em `biblia/blivre/` (66 livros, 31.102 versículos) com a fonte original e o checksum.
- Painel "📖 Ler … na Bíblia" em cada cena, com o texto dos versículos.
- Créditos da BLIVRE no rodapé, na página "Sobre" e no README.

### Alterado
- "Para guardar" passou a citar o **texto literal** da BLIVRE; antes era uma paráfrase.
- Grafias de Gênesis alinhadas à BLIVRE: Azenate, Mispá, Héber.
- As cenas de Gênesis passaram a cobrir todos os versículos (inclusão de 5:6-20 e 22:20-24).
- O validador passou a conferir o texto bíblico, as referências, a cobertura dos versículos e a grafia dos nomes.

### Corrigido
- Em idiomas da direita para a esquerda (árabe), o texto em português ficava com a pontuação fora do lugar.

## [0.2.0] - 2026-11-25 ([#1](https://github.com/nosreteq/inlumen/pull/1))

### Adicionado
- Publicação automática no GitHub Pages a cada merge na `main`.
- Validação automática (`scripts/validar.js`) em todo pull request: sintaxe, catálogo, i18n, conteúdo e ilustrações.

## [0.1.0] - 2026-11-25

### Adicionado
- Portal de estudos bíblicos ilustrados, em site estático sem build.
- Catálogo dos 66 livros, de Gênesis a Apocalipse.
- **Gênesis completo:** 50 capítulos e 154 cenas ilustradas e animadas (SVG), recontados em linguagem leiga, com "Para refletir", "Para conversar", personagens e versículo para guardar.
- Narração em voz alta, progresso de leitura, tema claro/escuro e layout para celular.
- Internacionalização: interface em 11 idiomas (pt-BR padrão, en, es, fr, de, it, ru, zh-CN, ja, hi, ar), suporte a escrita da direita para a esquerda e aviso quando a história ainda não foi traduzida.

[0.5.0]: https://github.com/nosreteq/inlumen/compare/26f9a20...main
[0.4.0]: https://github.com/nosreteq/inlumen/pull/4
[0.3.0]: https://github.com/nosreteq/inlumen/pull/2
[0.2.0]: https://github.com/nosreteq/inlumen/pull/1
[0.1.0]: https://github.com/nosreteq/inlumen/commit/40f2a5e
