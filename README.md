# In Lumen: Estudos Bíblicos Ilustrados

Portal web que percorre a Bíblia de **Gênesis a Apocalipse**, capítulo por capítulo. Cada capítulo é recontado em linguagem simples, dividido em **cenas ilustradas e animadas** (SVG gerado por código), com narração por voz, perguntas para estudo e controle de progresso.

- **Sem build, sem dependências**: HTML, CSS e JavaScript puros. Funciona abrindo `index.html` ou em qualquer hospedagem estática (GitHub Pages incluído).
- **Idioma padrão: pt-BR**, com interface pronta para 11 idiomas e suporte a RTL.
- **Texto bíblico de referência: Bíblia Livre (BLIVRE)**, atualização da tradução de João Ferreira de Almeida (1819), versionada em `biblia/blivre/`.
- **Leitor da Bíblia integrado**, com ligação nos dois sentidos entre a Bíblia e as histórias ilustradas, e **referências cruzadas** (OpenBible.info).
- Histórico de mudanças: [`CHANGELOG.md`](CHANGELOG.md).

## Texto bíblico: Bíblia Livre (BLIVRE)

Todo o projeto usa como base a **Bíblia Livre**, uma atualização da tradução de João Ferreira de Almeida (1819, Textus Receptus):

- **Leitura:** em cada cena, o botão "📖 Ler … na Bíblia" mostra os versículos completos daquela cena.
- **"Para guardar":** o conteúdo guarda só a referência (ex.: `versiculo: '50:20'`), e o site exibe o texto literal da BLIVRE.
- **Grafia:** os nomes de personagens e lugares seguem a BLIVRE (ex.: Azenate, Mispá, Héber).
- **Validação (CI):** todas as referências precisam existir no texto; as cenas devem cobrir todos os versículos de cada capítulo publicado; nomes com grafia diferente da BLIVRE geram aviso.

> **Créditos (obrigatórios pela licença):** Escrituras da **Bíblia Livre (BLIVRE)**, Copyright © 2018 Diego Santos, Mario Sérgio e Marco Teles, <http://sites.google.com/site/biblialivre/>. Licença [Creative Commons Atribuição 4.0 Brasil](https://creativecommons.org/licenses/by/4.0/deed.pt_BR). O crédito aparece no rodapé de todas as páginas e na página "Sobre".

Procedência, versão, checksum e instruções de atualização: [`biblia/blivre/LEIAME.md`](biblia/blivre/LEIAME.md).

## Leitor da Bíblia e referências cruzadas

O item **Bíblia** do menu abre o texto completo da BLIVRE dentro do portal:

| Rota | Tela |
|---|---|
| `#/biblia` | os 66 livros (🎬 = tem história ilustrada) |
| `#/biblia/<livro>` | os capítulos (destacados quando têm história) |
| `#/biblia/<livro>/<cap>?r=9-12` | o texto do capítulo, com os versículos de `r` destacados (aceita `22:9-12` ou `9-12`) |
| `#/livro/<livro>/<cap>?cena=2` | a história ilustrada, já aberta numa cena |

**Ligação Bíblia ↔ histórias (de-para):**
- **Bíblia → história:** um marco "🎬 História: … · cena N" aparece no primeiro versículo de cada cena e leva direto a ela. O mapeamento sai dos campos `ref` das cenas, sem cadastro manual.
- **História → Bíblia:** o painel "Ler na Bíblia" tem o link "Abrir no leitor da Bíblia →", e o topo do capítulo tem o botão "📖 Ler … na Bíblia".

**Referências cruzadas:**
- **No leitor:** o botão 🔗 em cada versículo mostra até 8 referências relacionadas, com o texto da BLIVRE.
- **Nas histórias:** "🔗 Veja também" em cada cena reúne as referências mais relevantes dos versículos da cena, sem repetir trechos sobrepostos. Para fixar referências próprias numa cena, use o campo opcional `veja: ['romanos 4:3', 'galatas 3:6']`; elas aparecem primeiro e o CI valida.
- **Fonte:** [OpenBible.info Cross References](https://www.openbible.info/labs/cross-references/), licença **CC BY**, derivada principalmente do *Treasury of Scripture Knowledge* (domínio público). O crédito aparece no rodapé, no leitor e na página "Sobre". Procedência e importação: [`biblia/referencias/LEIAME.md`](biblia/referencias/LEIAME.md).

## Status do conteúdo

| Livro | Capítulos | Idiomas do conteúdo |
|---|---|---|
| Gênesis | 50/50 (154 cenas) | pt-BR |
| Demais 65 livros | catálogo pronto, conteúdo pendente | — |

## Rodando localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicação (GitHub Pages)

O workflow `.github/workflows/pages.yml` automatiza tudo:

| Evento | O que acontece |
|---|---|
| Pull request para `main` | Roda `scripts/validar.js`. O PR mostra ✅ ou ❌. |
| Merge na `main` | Valida de novo e, se passar, **publica automaticamente** no GitHub Pages. |
| Actions → *Validar e publicar* → *Run workflow* | Publica a `main` manualmente. |

Para validar localmente antes de abrir um PR:

```bash
node scripts/validar.js
```

O validador confere a sintaxe dos JS, o catálogo (66 livros e 1189 capítulos), os dicionários de i18n (chaves, variáveis e plurais), a integridade do texto bíblico (31.102 versículos), as 193.452 referências cruzadas e todo o conteúdo registrado: capítulos, cenas, ilustrações, referências bíblicas, cobertura dos versículos e grafia dos nomes.

## Skills do Claude Code

O repositório traz skills em `.claude/skills/` com os roteiros dos trabalhos recorrentes. O Claude Code as carrega automaticamente neste projeto:

| Skill | Para quê |
|---|---|
| `escrever-capitulos` | Criar a história ilustrada de capítulos ou livros, fiel à BLIVRE, com cobertura total dos versículos |
| `traduzir-conteudo` | Traduzir histórias, interface e nomes dos livros para outros idiomas |
| `publicar` | Validar → PR → CI → merge → deploy → conferir o site, incluindo as falhas conhecidas do deploy |

## Estrutura

```
index.html                 casca da página (cabeçalho, seletor de idioma, rodapé)
css/estilo.css             estilos, tema claro/escuro, animações, RTL
js/i18n.js                 idiomas, textos da interface, nomes dos livros por idioma
js/livros.js               catálogo dos 66 livros + quais idiomas têm conteúdo
js/versiculos.js           nº de versículos por capítulo (gerado a partir da BLIVRE)
js/biblia-texto.js         carrega o texto bíblico, interpreta referências ('1:1-5'), créditos
biblia/blivre/             Bíblia Livre: fonte original + um arquivo .js por livro
biblia/referencias/        referências cruzadas (OpenBible.info): fonte + um arquivo .js por livro
scripts/importar-biblia.js importa uma tradução no formato VPL (eBible.org)
scripts/importar-referencias.js importa as referências cruzadas (OpenBible.info)
scripts/validar.js         validação usada no CI
js/ilustracoes.js          motor de ilustrações (fundos + ~50 elementos SVG animados)
js/app.js                  rotas (#/, #/livro/<id>, #/livro/<id>/<cap>, #/sobre) e telas
conteudo/<idioma>/<id>.js  conteúdo de cada livro, por idioma (carregado sob demanda)
```

## Internacionalização (i18n)

São três camadas independentes, cada uma com fallback:

| Camada | Onde | Fallback |
|---|---|---|
| Interface (botões, menus, textos fixos) | `js/i18n.js` → `UI[idioma]` | idioma → `en` → `pt-BR` |
| Nomes dos livros | `js/i18n.js` → `NOMES[idioma]` | idioma → `en` → `pt-BR` |
| Histórias (capítulos, cenas, balões de fala) | `conteudo/<idioma>/<livro>.js` | idioma → idioma original do livro, com aviso na tela |

**Idiomas da interface:** pt-BR (padrão), en, es, fr, de, it, ru, zh-CN, ja, hi, ar (RTL).
**Nomes dos livros traduzidos:** pt-BR, en, es, fr, de, it, ru, zh-CN. Em ja, hi e ar, os nomes caem para o inglês até serem preenchidos.

O idioma é escolhido no seletor 🌐 do cabeçalho, fica salvo no navegador e também pode ser forçado por URL: `?lang=en`.

> ⚠️ As traduções da interface foram geradas e **precisam de revisão por falantes nativos**, principalmente em ja, hi e ar.

### Adicionar um novo idioma de interface

1. Em `js/i18n.js`, acrescente `{ codigo, nome, dir }` em `IDIOMAS` (`dir: 'rtl'` para escrita da direita para a esquerda).
2. Copie o bloco `UI['pt-BR']` para `UI['<codigo>']` e traduza. Chaves ausentes caem para o inglês.
   Plurais usam as categorias de `Intl.PluralRules` (`zero`, `one`, `two`, `few`, `many`, `other`).
3. Opcional: adicione os 66 nomes em `NOMES['<codigo>']`, separados por `|`, na ordem canônica.

### Traduzir o conteúdo de um livro

1. Copie `conteudo/pt-BR/genesis.js` para `conteudo/<codigo>/genesis.js`.
2. Traduza apenas os **textos**: `titulo`, `texto`, `licao`, `pergunta`, `versiculo`, `personagens`, os `texto` dos balões `fala(...)` e dos `rotulo`, além de `autor`, `epoca`, `tema`, `introducao` e `partes[].titulo`. Não altere posições, cores ou elementos.
3. Mude a última linha para `CONTEUDO.registrar('genesis', {...}, '<codigo>')`.
4. Em `js/livros.js`, registre o idioma: `genesis: ['pt-BR', '<codigo>']`.

A narração por voz usa automaticamente o idioma do texto exibido.

## Adicionar o estudo de um novo livro

1. Crie `conteudo/pt-BR/<id>.js` seguindo o formato de Gênesis (o `id` está em `js/livros.js`).
2. Registre o livro em `DISPONIVEIS` em `js/livros.js`: `<id>: ['pt-BR']`.

Formato de um capítulo:

```js
C[1] = {
  titulo: 'A criação do mundo',
  personagens: ['Deus', 'Adão', 'Eva'],
  cenas: [
    { ref: '1:1-5', texto: 'Reconto em linguagem simples…',
      veja: ['joao 1:1-3'],   // opcional: referências cruzadas fixas, além das automáticas
      cena: { fundo: 'trevas', el: [ { t: 'luz', x: 400, y: -40, anim: 'brilhar' }, { t: 'fala', texto: 'Haja luz!', x: 450, y: 150 } ] } },
  ],
  licao: 'Ideia central…',
  pergunta: 'Pergunta para conversar…',
  versiculo: '1:1',   // só a referência: o texto literal vem da Bíblia Livre
};
```

### Ilustrações

As cenas são compostas num palco de **800×450**, com o chão em y≈360. Os personagens têm os pés no ponto `(x, y)`.

- **Fundos:** `trevas, aurora, ceu, dia, jardim, noite, deserto, por-do-sol, tempestade, mar, egito, interior, prisao, montanha, fogo, agua`
- **Elementos:** `pessoa, crianca, anjo, luz, sol, lua, estrelas, nuvem, chuva, agua, rio, peixe, passaro, pomba, arvore, palmeira, flores, trigo, feixe, montanha, colina, serpente, ovelha, leao, camelo, vaca, arca, arco-iris, torre, tenda, altar, fogo, cidade, piramide, poco, escada, palacio, grades, coroa, tunica, saco, taca, pedras, espada-fogo, tocha, trono, cesto, videira, mesa, carroca, moedas, caverna, bebe, coracao, sonho, fala, rotulo`
- **Atributos comuns:** `x, y, s` (escala), `anim, atraso, espelho, opacidade`
- **Animações:** `flutuar, brilhar, balancar, surgir, cair, nadar, voar, pulsar, girar, andar, tremer, piscar, subir`
- **`pessoa`:** `cor, pele, cabelo, barba, longo, veu, velho, cajado, coroa, halo, listras, triste, bracos` (`baixo|cima|aberto|frente|orando|rosto`), `pose` (`ajoelhado|deitado`)

**Diretriz:** Deus não é desenhado em forma humana; sua presença é representada pelo elemento `luz`.

## Princípios editoriais

- Os textos são **recontos**, não traduções bíblicas. Cada cena traz a referência e o texto da Bíblia Livre para conferência.
- O reconto deve seguir o texto da BLIVRE: fatos, números, nomes e ordem dos acontecimentos.
- Linguagem acessível para leigos, crianças e famílias, sem perder a fidelidade à narrativa.
- Passagens difíceis (violência, temas adultos) são tratadas com sobriedade e sem detalhes inadequados.
