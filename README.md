# In Lumen: Estudos Bíblicos Ilustrados

Portal web que percorre a Bíblia de **Gênesis a Apocalipse**, capítulo por capítulo. Cada capítulo é recontado em linguagem simples, dividido em **cenas ilustradas e animadas** (SVG gerado por código), com narração por voz, perguntas para estudo e controle de progresso.

- **Sem build, sem dependências**: HTML, CSS e JavaScript puros. Funciona abrindo `index.html` ou em qualquer hospedagem estática (GitHub Pages incluído).
- **Idioma padrão: pt-BR**, com interface pronta para 11 idiomas e suporte a RTL.

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

## Estrutura

```
index.html                 casca da página (cabeçalho, seletor de idioma, rodapé)
css/estilo.css             estilos, tema claro/escuro, animações, RTL
js/i18n.js                 idiomas, textos da interface, nomes dos livros por idioma
js/livros.js               catálogo dos 66 livros + quais idiomas têm conteúdo
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
      cena: { fundo: 'trevas', el: [ { t: 'luz', x: 400, y: -40, anim: 'brilhar' }, { t: 'fala', texto: 'Haja luz!', x: 450, y: 150 } ] } },
  ],
  licao: 'Ideia central…',
  pergunta: 'Pergunta para conversar…',
  versiculo: 'Texto para guardar (paráfrase) e referência',
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

- Os textos são **recontos**, não traduções bíblicas. Cada cena traz a referência para leitura no texto completo.
- Linguagem acessível para leigos, crianças e famílias, sem perder a fidelidade à narrativa.
- Passagens difíceis (violência, temas adultos) são tratadas com sobriedade e sem detalhes inadequados.
