---
name: escrever-capitulos
description: Escreve a história ilustrada de capítulos ou de um livro bíblico inteiro no portal In Lumen, recontando em linguagem leiga, com cenas SVG animadas, fiel à Bíblia Livre (BLIVRE). Use quando pedirem para criar, escrever, continuar ou revisar o estudo ilustrado de um livro ou capítulo (ex.: "escreva o Êxodo", "faça Êxodo 1 a 10", "continue de onde parou").
---

# Escrever capítulos ilustrados

O conteúdo de cada livro fica em `conteudo/pt-BR/<id>.js`. O modelo de referência é `conteudo/pt-BR/genesis.js`: leia o cabeçalho dele e alguns capítulos antes de começar. O `<id>` do livro está em `js/livros.js`.

## 1. Ler a Bíblia antes de escrever (obrigatório)

A base de todo o projeto é a **Bíblia Livre (BLIVRE)**, em `biblia/blivre/<id>.js`. Leia o texto completo de cada capítulo antes de escrever:

```bash
node -e 'global.TEXTO_BIBLICO={registrar(s,id,c){global.T=c}}; require("./biblia/blivre/<id>.js");
const c=<capitulo>; T[c-1].forEach((v,i)=>console.log(c+":"+(i+1), v))'
```

- **Fatos, números, nomes e a ordem dos acontecimentos** seguem a BLIVRE. Não invente detalhes nem misture com tradição extra-bíblica.
- **Grafia dos nomes:** exatamente como na BLIVRE (ex.: Azenate, Mispá, Héber). O validador avisa se divergir.
- Os colchetes `[ ]` na BLIVRE são palavras acrescentadas pelos tradutores; não fazem parte das referências.

## 2. Estrutura de cada capítulo

```js
C[n] = {
  titulo: 'Título curto e atraente',
  personagens: ['Nome', 'Outro nome'],   // nomes próprios com a grafia da BLIVRE
  cenas: [
    { ref: '1:1-5', texto: 'Reconto…', cena: { fundo: '…', el: [ … ] } },
    // 2 a 5 cenas
  ],
  licao: 'Ideia central para a vida, 1 a 2 frases.',
  pergunta: 'Pergunta aberta para conversa em grupo ou família.',
  versiculo: '1:1',    // SÓ a referência; o site exibe o texto literal da BLIVRE
};
```

- **Cobertura total:** as `ref` das cenas, somadas, devem cobrir **todos os versículos** do capítulo, sem lacunas. Genealogias e listas podem ser resumidas numa cena, mas a `ref` cobre o trecho inteiro. Uma cena pode avançar para o capítulo seguinte (ex.: `'2:1-3'` no capítulo 1), e isso conta na cobertura.
- **`versiculo`:** escolha o versículo mais memorável do capítulo. Pode ser intervalo (`'48:15-16'`) ou de outro livro (`'lucas 17:32'`), mas prefira o próprio livro.
- Ao final do arquivo, registre com `partes` (agrupamento temático dos capítulos), `autor`, `epoca`, `tema`, `introducao` e `capa` (uma cena):
  `CONTEUDO.registrar('<id>', { …, capitulos: C }, 'pt-BR');`

## 3. Como escrever o reconto

- **Linguagem leiga:** frases curtas, vocabulário do dia a dia, para adultos, crianças e famílias. Cada cena tem de 2 a 4 frases.
- **É reconto, não tradução:** conte com as próprias palavras. Falas diretas curtas são bem-vindas.
- **Sobriedade:** violência, sexualidade e temas adultos são tratados com respeito, sem detalhes inadequados (ver Gn 19, 34 e 38 como exemplo).
- **Sem opinião doutrinária controversa:** `licao` e `pergunta` focam no que o texto mostra.

## 4. Ilustrações

Palco de 800×450; o chão fica em y≈360; os personagens têm os pés em `(x, y)`, normalmente y≈390-400. A referência completa de fundos, elementos, animações e atributos de `pessoa` está no `README.md` (seção "Ilustrações"); os elementos são implementados em `js/ilustracoes.js`.

- **Deus nunca é desenhado como pessoa.** A presença de Deus é o elemento `luz`. Anjos podem usar o elemento `anjo`.
- **Personagens recorrentes:** defina no topo do arquivo um objeto `T` com a aparência fixa de cada personagem (cor da roupa, pele, barba, véu) e use o helper `p('nome', x, y, {extras})`, como em Gênesis. Um personagem deve parecer o mesmo em todo o livro.
- Use `fala(texto, x, y)` para balões curtos (máx. 2 linhas, use `\n`) e `{ t: 'rotulo', texto, x: 20, y: 20 }` para títulos de cena ("Dia 1", "Mispá").
- Prefira os elementos existentes. Se faltar um elemento essencial (ex.: sarça ardente, tábuas da lei), adicione-o em `js/ilustracoes.js` seguindo o padrão das funções (SVG centrado na base, sem dependências), documente-o no `README.md` e avise o usuário.
- Varie fundos e enquadramentos entre as cenas e use animações com moderação (`surgir` na entrada, `andar` em viagens, `brilhar` na luz).

## 5. Publicar o livro e validar

1. Registre o idioma em `js/livros.js`: `DISPONIVEIS = { …, <id>: ['pt-BR'] }`.
2. Rode a validação e corrija **todos** os erros e avisos de cobertura e grafia:
   ```bash
   node scripts/validar.js
   ```
3. Confira no navegador (Playwright já está instalado): sirva com `python3 -m http.server`, abra `#/livro/<id>/<n>`, percorra as cenas, abra "Ler na Bíblia" e verifique se não há erros de console nem personagens sobrepostos ou fora do palco. Veja uma ou duas capturas de tela.
4. Para livros grandes, trabalhe em lotes (ex.: 10 capítulos), validando a cada lote. O livro aparece como disponível assim que estiver em `DISPONIVEIS`; capítulos ainda não escritos mostram "em preparação".
5. Publique com a skill `publicar`.

## Checklist por capítulo

- [ ] Li o capítulo inteiro na BLIVRE
- [ ] As cenas cobrem todos os versículos (validador sem aviso)
- [ ] Os nomes estão com a grafia da BLIVRE
- [ ] Números e fatos conferidos com o texto
- [ ] Deus aparece só como `luz`
- [ ] `versiculo` com a referência de um versículo marcante
- [ ] Conferido visualmente no navegador
