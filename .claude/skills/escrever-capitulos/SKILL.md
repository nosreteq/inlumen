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
- **`veja` (opcional, por cena):** referências cruzadas fixas. Veja a etapa 4.
- O leitor da Bíblia liga cada cena aos versículos automaticamente pelo `ref`: um `ref` correto já cria o de-para Bíblia ↔ história.
- **`versiculo`:** escolha o versículo mais memorável do capítulo. Pode ser intervalo (`'48:15-16'`) ou de outro livro (`'lucas 17:32'`), mas prefira o próprio livro.
- Ao final do arquivo, registre com `partes` (agrupamento temático dos capítulos), `autor`, `epoca`, `tema`, `introducao` e `capa` (uma cena):
  `CONTEUDO.registrar('<id>', { …, capitulos: C }, 'pt-BR');`

## 3. Como escrever o reconto

- **Linguagem leiga:** frases curtas, vocabulário do dia a dia, para adultos, crianças e famílias. Cada cena tem de 2 a 4 frases.
- **É reconto, não tradução:** conte com as próprias palavras. Falas diretas curtas são bem-vindas.
- **Sobriedade:** violência, sexualidade e temas adultos são tratados com respeito, sem detalhes inadequados (ver Gn 19, 34 e 38 como exemplo).
- **Sem opinião doutrinária controversa:** `licao` e `pergunta` focam no que o texto mostra.

## 4. Referências cruzadas ("Veja também")

Cada cena mostra "🔗 Veja também" com até 6 referências. Elas são calculadas **automaticamente** a partir do `ref` da cena e das referências cruzadas do OpenBible.info em `biblia/referencias/`. O leitor da Bíblia também liga cada versículo à cena que o reconta. Por isso, um `ref` preciso é o que garante boas referências e um de-para correto.

**Revise as referências automáticas de cada cena** depois de escrever o capítulo:

```bash
node -e 'global.window=global; require("./js/livros.js"); require("./js/versiculos.js"); require("./js/biblia-texto.js");
for (const f of require("fs").readdirSync("biblia/referencias").filter((f) => f.endsWith(".js"))) require("./biblia/referencias/" + f);
global.CONTEUDO={registrar(id,d){global.D=d}}; require("./conteudo/pt-BR/<id>.js");
(async () => { for (const [n, cap] of Object.entries(D.capitulos)) for (const [i, cn] of cap.cenas.entries())
  console.log(`${n}.${i + 1} (${cn.ref}):`, [...(cn.veja || []), ...(await REFERENCIAS.doTrecho(cn.ref, "<id>", 6))].join(" | ")); })()'
```

**Quando fixar referências com `veja: […]`** (elas aparecem antes das automáticas):

- **Promessa ↔ cumprimento** essencial que não apareceu na lista: profecia messiânica e sua citação no NT, tipologia explícita no NT (ex.: Gn 22 → `'hebreus 11:17-19'`, `'joao 1:29'`).
- **No Novo Testamento, a citação do Antigo:** quando o texto cita ou alude a uma passagem do AT, fixe a origem (ex.: Mt 4:4 → `'deuteronomio 8:3'`).
- **Paralelos de uma mesma história:** os Evangelhos sinóticos entre si (Mt/Mc/Lc), Samuel/Reis ↔ Crônicas.
- Fixe **poucas**, no máximo 3 por cena, e só as que um leitor leigo acharia esclarecedoras.

**Regras:**

- **Formato:** `'<id do livro> <cap>:<versículo>'` ou um intervalo (`'romanos 4:3-6'`), com os ids de `js/livros.js` (ex.: `1joao`, `jo` = Jó, `joao` = João).
- **Leia o versículo na BLIVRE antes de fixar:** a referência precisa de fato tratar do mesmo tema. O CI confere se ela existe, mas não se é pertinente.
- **Não repita** o que já aparece automaticamente, nem trechos do próprio capítulo que outras cenas já recontam.
- **Se uma referência automática parecer fora de contexto,** não há como removê-la pelo conteúdo. Avise o usuário em vez de editar `biblia/referencias/`, que é gerado pelo importador.

## 5. Ilustrações

Palco de 800×450; o chão fica em y≈360; os personagens têm os pés em `(x, y)`, normalmente y≈390-400. A referência completa de fundos, elementos, animações e atributos de `pessoa` está no `README.md` (seção "Ilustrações"); os elementos são implementados em `js/ilustracoes.js`.

- **Deus nunca é desenhado como pessoa.** A presença de Deus é o elemento `luz`. Anjos podem usar o elemento `anjo`.
- **Personagens recorrentes:** defina no topo do arquivo um objeto `T` com a aparência fixa de cada personagem (cor da roupa, pele, barba, véu) e use o helper `p('nome', x, y, {extras})`, como em Gênesis. Um personagem deve parecer o mesmo em todo o livro.
- Use `fala(texto, x, y)` para balões curtos (máx. 2 linhas, use `\n`) e `{ t: 'rotulo', texto, x: 20, y: 20 }` para títulos de cena ("Dia 1", "Mispá").
- Os elementos e atributos disponíveis estão no `README.md`, incluindo os de Êxodo: sarça, mar aberto, maná, tábuas, tabernáculo, arca, candelabro, `peitoral` e `brilho`.
- Prefira os elementos existentes. Se faltar um elemento essencial (ex.: sarça ardente, tábuas da lei), adicione-o em `js/ilustracoes.js` seguindo o padrão das funções (SVG centrado na base, sem dependências), documente-o no `README.md` e avise o usuário.
- Varie fundos e enquadramentos entre as cenas e use animações com moderação (`surgir` na entrada, `andar` em viagens, `brilhar` na luz).

## 6. Publicar o livro e validar

1. Registre o idioma em `js/livros.js`: `DISPONIVEIS = { …, <id>: ['pt-BR'] }`.
2. Rode a validação e corrija **todos** os erros e avisos de cobertura e grafia. Depois confira os números (idades, quantidades, durações) contra o texto e revise cada item apontado:
   ```bash
   node scripts/validar.js
   node scripts/conferir-numeros.js <id>
   ```
   Releia também, versículo a versículo, as afirmações que não são números (quem fez o quê, onde, em que ordem). Na revisão de Gênesis, por exemplo, apareceu "Ninrode fundou Nínive", quando a BLIVRE diz que foi Assur (Gn 10:11).
3. Confira no navegador (Playwright já está instalado): sirva com `python3 -m http.server`, abra `#/livro/<id>/<n>`, percorra as cenas, abra "Ler na Bíblia" e verifique se não há erros de console nem personagens sobrepostos ou fora do palco. Veja uma ou duas capturas de tela.
4. Para livros grandes, trabalhe em lotes (ex.: 10 capítulos), validando a cada lote. O livro aparece como disponível assim que estiver em `DISPONIVEIS`; capítulos ainda não escritos mostram "em preparação".
5. Registre a mudança no `CHANGELOG.md` e publique com a skill `publicar`.

## Checklist por capítulo

- [ ] Li o capítulo inteiro na BLIVRE
- [ ] As cenas cobrem todos os versículos (validador sem aviso)
- [ ] Os nomes estão com a grafia da BLIVRE
- [ ] Números conferidos (`conferir-numeros.js`) e fatos relidos no texto
- [ ] Deus aparece só como `luz`
- [ ] `versiculo` com a referência de um versículo marcante
- [ ] "Veja também" revisado em cada cena; `veja` fixado onde há promessa ↔ cumprimento, citação AT ↔ NT ou paralelo
- [ ] Conferido visualmente no navegador
