/* Gênesis: estudo ilustrado, capítulo por capítulo.
 * Textos: recontos livres em linguagem simples (não são tradução bíblica).
 * Texto bíblico de referência: Bíblia Livre (BLIVRE), via biblia/blivre/. Nomes e grafias seguem a BLIVRE.
 * Formato de cada capítulo: { titulo, personagens[], cenas[{ texto, ref, cena:{fundo, el[]} }], licao, pergunta,
 *   versiculo: referência ('1:1', '48:15-16') cujo texto literal é exibido a partir da tradução bíblica }
 */
(function () {
  /* ---------- personagens recorrentes (aparência consistente) ---------- */
  const PELE = { a: '#f1c9a0', b: '#d9a67a', c: '#b97d53', d: '#8d5a3a' };
  const T = {
    adao:    { cor: '#7d9a4a', pele: PELE.c, cabelo: '#2a1a10', barba: '#2a1a10' },
    eva:     { cor: '#a0b85a', pele: PELE.b, cabelo: '#4a2a14', longo: true },
    caim:    { cor: '#9a5a2a', pele: PELE.c, barba: '#2a1a10' },
    abel:    { cor: '#6a8ab0', pele: PELE.b, cajado: true },
    noe:     { cor: '#5a7a9a', pele: PELE.b, velho: true, barba: true },
    abraao:  { cor: '#8a4a2a', pele: PELE.c, barba: true, cajado: true },
    sara:    { cor: '#a05a7a', pele: PELE.b, veu: '#d9a0b8' },
    lo:      { cor: '#6a6a9a', pele: PELE.b, barba: true },
    agar:    { cor: '#b8703a', pele: PELE.d, veu: '#e0b06a' },
    ismael:  { cor: '#c8904a', pele: PELE.d, s: .7 },
    isaque:  { cor: '#4a8a7a', pele: PELE.b, barba: true },
    rebeca:  { cor: '#3a7aa0', pele: PELE.b, veu: '#e8c25a' },
    esau:    { cor: '#b8502a', pele: PELE.c, cabelo: '#a83a14', barba: '#a83a14' },
    jaco:    { cor: '#5a6aa8', pele: PELE.b, barba: true, cajado: true },
    raquel:  { cor: '#8a3a6a', pele: PELE.b, veu: '#e88aa0' },
    lia:     { cor: '#4a7a6a', pele: PELE.b, veu: '#9ac0b0' },
    labao:   { cor: '#7a3a3a', pele: PELE.c, velho: true, barba: true },
    jose:    { cor: '#e8d8b0', pele: PELE.b, listras: true },
    joseEg:  { cor: '#f6f2e6', pele: PELE.b, coroa: false },
    farao:   { cor: '#f6f2e6', pele: PELE.c, coroa: true },
    juda:    { cor: '#a8542a', pele: PELE.c, barba: true },
    benjamim:{ cor: '#6aa0c0', pele: PELE.b },
    irmao1:  { cor: '#7a6a4a', pele: PELE.c, barba: true },
    irmao2:  { cor: '#4a6a5a', pele: PELE.b, barba: true },
    irmao3:  { cor: '#8a4a5a', pele: PELE.c, barba: true },
    irmao4:  { cor: '#5a5a7a', pele: PELE.b, barba: true },
    servo:   { cor: '#8a7a5a', pele: PELE.c, barba: true, cajado: true },
  };
  // p('abraao', x, y, {extras}) -> elemento pessoa com a aparência do personagem
  const p = (quem, x, y, extra = {}) => ({ t: 'pessoa', x, y, ...T[quem], ...extra });
  const fala = (texto, x, y, extra = {}) => ({ t: 'fala', texto, x, y, ...extra });
  const luz = (x = 400, y = -30, extra = {}) => ({ t: 'luz', x, y, anim: 'brilhar', ...extra });
  const irmaos = (x0, y, extra = {}) => ['irmao1', 'irmao2', 'irmao3', 'irmao4', 'juda'].map((q, i) => p(q, x0 + i * 52, y + (i % 2) * 6, { s: .85, ...extra }));

  const C = {};

  C[1] = {
    titulo: 'A criação do mundo',
    personagens: ['Deus', 'Adão e Eva (o primeiro homem e a primeira mulher)'],
    cenas: [
      { ref: '1:1-5', texto: 'No começo de tudo, Deus criou os céus e a terra. Tudo estava escuro, vazio e coberto de água, e o Espírito de Deus pairava sobre as águas. Então Deus falou: “Haja luz!”, e a luz apareceu. Deus separou a luz da escuridão e chamou a luz de dia e a escuridão de noite. Foi o primeiro dia.',
        cena: { fundo: 'trevas', el: [luz(400, -40), fala('Haja luz!', 450, 150), { t: 'rotulo', texto: 'Dia 1', x: 20, y: 20 }] } },
      { ref: '1:6-13', texto: 'No segundo dia, Deus separou as águas de cima das águas de baixo e fez o céu. No terceiro dia, juntou as águas num só lugar, e apareceu a terra seca. Depois mandou a terra produzir plantas: capim, flores e árvores cheias de frutos.',
        cena: { fundo: 'dia', el: [{ t: 'nuvem', x: 170, y: 90, anim: 'flutuar' }, { t: 'nuvem', x: 600, y: 70, s: .8, anim: 'flutuar', atraso: 1 },
          { t: 'agua', x: 0, y: 395 }, { t: 'arvore', x: 220, y: 370, fruto: '#e0453a', anim: 'surgir' }, { t: 'arvore', x: 560, y: 365, s: 1.2, anim: 'surgir', atraso: .3 },
          { t: 'palmeira', x: 680, y: 370, anim: 'surgir', atraso: .6 }, { t: 'flores', x: 300, y: 370, w: 220, anim: 'surgir', atraso: .8 }, { t: 'rotulo', texto: 'Dias 2 e 3', x: 20, y: 20 }] } },
      { ref: '1:14-23', texto: 'No quarto dia, Deus colocou luzes no céu: o sol para brilhar de dia, a lua e as estrelas para a noite. Elas marcam os dias, as estações e os anos. No quinto dia, Deus encheu o mar de peixes e o céu de aves, e os abençoou para que se multiplicassem.',
        cena: { fundo: 'mar', el: [{ t: 'sol', x: 140, y: 100, anim: 'pulsar' }, { t: 'lua', x: 660, y: 80 }, { t: 'estrelas', x: 520, y: 20, w: 260, h: 140, n: 18 },
          { t: 'passaro', x: 330, y: 120, anim: 'voar' }, { t: 'passaro', x: 400, y: 160, s: .8, anim: 'voar', atraso: 1 }, { t: 'passaro', x: 460, y: 110, s: .7, anim: 'voar', atraso: 2 },
          { t: 'peixe', x: 200, y: 330, anim: 'nadar' }, { t: 'peixe', x: 450, y: 380, cor: '#5ac0d8', espelho: true, anim: 'nadar', atraso: 1 }, { t: 'peixe', x: 640, y: 320, cor: '#f2d038', anim: 'nadar', atraso: 2 }, { t: 'rotulo', texto: 'Dias 4 e 5', x: 20, y: 20 }] } },
      { ref: '1:24-31', texto: 'No sexto dia, Deus fez os animais da terra, grandes e pequenos. Por último, criou o ser humano, homem e mulher, à sua imagem e semelhança. Deus os abençoou e lhes deu a missão de cuidar de toda a criação. Deus olhou tudo o que tinha feito e viu que era muito bom.',
        cena: { fundo: 'jardim', el: [luz(400, -40, { opacidade: .7 }), { t: 'arvore', x: 90, y: 360, s: 1.1 }, { t: 'leao', x: 200, y: 395, anim: 'surgir' }, { t: 'vaca', x: 650, y: 392, espelho: true, anim: 'surgir', atraso: .3 },
          { t: 'ovelha', x: 560, y: 400, anim: 'surgir', atraso: .5 }, p('adao', 365, 395, { bracos: 'aberto', anim: 'surgir', atraso: .8 }), p('eva', 435, 395, { bracos: 'aberto', anim: 'surgir', atraso: 1 }),
          { t: 'rotulo', texto: 'Dia 6', x: 20, y: 20 }] } },
      { ref: '2:1-3', texto: 'Com tudo pronto, no sétimo dia Deus descansou de todo o trabalho que tinha feito. Ele abençoou esse dia e o separou como especial. A criação inteira mostrava a bondade, o poder e o cuidado do Criador.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'sol', x: 400, y: 330, s: 1.3, opacidade: .9 }, { t: 'estrelas', x: 0, y: 0, n: 20, h: 150 }, { t: 'arvore', x: 150, y: 370, cor: '#2a4a3a' }, { t: 'palmeira', x: 650, y: 372 },
          { t: 'ovelha', x: 300, y: 400, cor: '#e8d8d0' }, { t: 'rotulo', texto: 'Dia 7: descanso', x: 20, y: 20 }] } },
    ],
    licao: 'O mundo não surgiu por acaso: foi criado por um Deus bom, que faz tudo com ordem e propósito. Todo ser humano tem valor porque foi feito à imagem de Deus.',
    pergunta: 'Qual parte da criação mais te faz admirar a Deus? Por que é importante saber que fomos feitos à imagem dele?',
    versiculo: '1:1',
  };

  C[2] = {
    titulo: 'O Jardim do Éden',
    personagens: ['Deus', 'Adão', 'Eva'],
    cenas: [
      { ref: '2:4-7', texto: 'A Bíblia conta com mais detalhes como o ser humano foi criado. Deus formou o homem do pó da terra, como um artista moldando o barro. Depois soprou em seu nariz o fôlego de vida, e o homem passou a viver. Seu nome era Adão.',
        cena: { fundo: 'aurora', el: [luz(400, 60, { r: 380 }), p('adao', 400, 392, { anim: 'surgir', bracos: 'baixo' }), { t: 'colina', x: 400, y: 410, w: 420, h: 40, cor: '#6a5a4a' }] } },
      { ref: '2:8-17', texto: 'Deus plantou um jardim lindo no Éden, cheio de árvores com frutos deliciosos, e um rio que o regava. No meio do jardim estavam a árvore da vida e a árvore do conhecimento do bem e do mal. Deus colocou Adão ali para cuidar do jardim e deu uma única regra: não comer da árvore do conhecimento do bem e do mal.',
        cena: { fundo: 'jardim', el: [{ t: 'rio', x: 400, y: 400 }, { t: 'arvore', x: 120, y: 355, fruto: '#f0a030' }, { t: 'arvore', x: 400, y: 350, s: 1.4, fruto: '#d22a3a', anim: 'pulsar' },
          { t: 'arvore', x: 680, y: 355, fruto: '#a040c0' }, { t: 'flores', x: 160, y: 370, w: 480 }, p('adao', 260, 390), fala('Cuide do jardim.\nSó não coma desta árvore.', 430, 110)] } },
      { ref: '2:18-20', texto: 'Deus disse: “Não é bom que o homem esteja sozinho.” Então trouxe os animais até Adão, e ele deu nome a cada um. Mas, entre todos eles, não havia ninguém que fosse como ele, alguém para ser sua companhia.',
        cena: { fundo: 'jardim', el: [{ t: 'arvore', x: 90, y: 355 }, p('adao', 230, 392, { bracos: 'frente' }), { t: 'leao', x: 400, y: 398, espelho: true }, { t: 'camelo', x: 560, y: 396, espelho: true },
          { t: 'ovelha', x: 690, y: 402, espelho: true }, { t: 'passaro', x: 470, y: 160, anim: 'voar' }, fala('Leão! Camelo! Ovelha!', 250, 260)] } },
      { ref: '2:21-25', texto: 'Então Deus fez Adão dormir profundamente, tirou uma de suas costelas e dela formou a mulher. Quando Adão a viu, ficou feliz: “Esta, sim, é osso dos meus ossos e carne da minha carne!” Assim começou a família: o homem e a mulher se unem e se tornam uma só carne.',
        cena: { fundo: 'jardim', el: [luz(400, -40, { opacidade: .6 }), { t: 'arvore', x: 680, y: 355, fruto: '#f0a030' }, p('adao', 340, 395, { bracos: 'aberto' }), p('eva', 460, 395, { bracos: 'aberto', anim: 'surgir' }),
          { t: 'coracao', x: 400, y: 230, anim: 'pulsar' }, { t: 'flores', x: 260, y: 372, w: 300 }] } },
    ],
    licao: 'Deus criou o ser humano para viver em relacionamento: com Ele, com a criação e uns com os outros. O casamento e a família fazem parte do plano original de Deus.',
    pergunta: 'Por que você acha que Deus deu uma regra a Adão no jardim? O que isso mostra sobre liberdade e confiança?',
    versiculo: '2:18',
  };

  C[3] = {
    titulo: 'A queda: o pecado entra no mundo',
    personagens: ['Adão', 'Eva', 'A serpente'],
    cenas: [
      { ref: '3:1-6', texto: 'A serpente, o mais astuto dos animais, perguntou a Eva: “Foi isso mesmo que Deus disse?” E mentiu: “Vocês não vão morrer! Vão ficar como Deus.” Eva olhou o fruto, achou bonito e desejável, pegou, comeu e deu também a Adão, que comeu.',
        cena: { fundo: 'jardim', el: [{ t: 'arvore', x: 420, y: 355, s: 1.4, fruto: '#d22a3a' }, { t: 'serpente', x: 470, y: 280, anim: 'balancar' }, p('eva', 330, 395, { bracos: 'frente' }), p('adao', 230, 395),
          fala('Vocês não vão morrer…', 520, 220)] } },
      { ref: '3:7-13', texto: 'Na mesma hora, os olhos deles se abriram e sentiram vergonha. Costuraram folhas para se cobrir e se esconderam de Deus entre as árvores. Deus chamou: “Onde você está?” Adão culpou Eva, e Eva culpou a serpente.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'arvore', x: 300, y: 365, s: 1.3, cor: '#2f6a3a' }, { t: 'arvore', x: 520, y: 365, s: 1.2, cor: '#2f6a3a' }, p('adao', 340, 395, { bracos: 'rosto', triste: true }), p('eva', 460, 395, { bracos: 'rosto', triste: true }),
          luz(700, -40, { opacidade: .6 }), fala('Onde você está?', 560, 120)] } },
      { ref: '3:14-19', veja: ['galatas 4:4'], texto: 'O pecado trouxe consequências: dor, trabalho difícil, conflito e, por fim, a morte. Mas, no meio do julgamento, veio uma promessa: um descendente da mulher esmagaria a cabeça da serpente. É a primeira notícia da vitória de Deus sobre o mal.',
        cena: { fundo: 'tempestade', el: [{ t: 'nuvem', x: 200, y: 80, cor: '#5a6070' }, { t: 'nuvem', x: 600, y: 90, cor: '#5a6070' }, luz(400, -40, { opacidade: .5 }), { t: 'serpente', x: 600, y: 400 },
          p('adao', 320, 395, { triste: true }), p('eva', 400, 395, { triste: true }), fala('Um descendente da mulher\nvai vencer a serpente.', 120, 170)] } },
      { ref: '3:20-24', texto: 'Deus, cuidadoso, fez roupas de pele para cobri-los. Depois, Adão e Eva tiveram que sair do jardim. Querubins e uma espada flamejante guardavam o caminho da árvore da vida. A amizade com Deus estava ferida, mas Deus não os abandonou.',
        cena: { fundo: 'deserto', el: [{ t: 'arvore', x: 680, y: 360, s: 1.2 }, { t: 'anjo', x: 600, y: 390 }, { t: 'espada-fogo', x: 540, y: 300 }, p('adao', 260, 395, { cor: '#9a7a5a', triste: true, anim: 'andar', espelho: true }),
          p('eva', 330, 395, { cor: '#b08a6a', triste: true, anim: 'andar', espelho: true })] } },
    ],
    licao: 'O pecado é desconfiar de Deus e escolher o próprio caminho. Ele traz separação e dor, mas Deus já prometeu ali um Salvador que venceria o mal.',
    pergunta: 'Adão culpou Eva e Eva culpou a serpente. Por que é tão difícil assumir os próprios erros?',
    versiculo: '3:15',
  };

  C[4] = {
    titulo: 'Caim e Abel',
    personagens: ['Caim', 'Abel', 'Adão', 'Eva', 'Sete'],
    cenas: [
      { ref: '4:1-5', texto: 'Adão e Eva tiveram dois filhos: Caim, que plantava, e Abel, que cuidava de ovelhas. Os dois levaram ofertas a Deus. Abel ofereceu o melhor do seu rebanho, de coração, e Deus se agradou. Mas com Caim e sua oferta Deus não se agradou, e Caim ficou furioso.',
        cena: { fundo: 'dia', el: [{ t: 'altar', x: 250, y: 380 }, { t: 'altar', x: 560, y: 380, fogo: false }, p('abel', 330, 395, { bracos: 'cima' }), { t: 'ovelha', x: 180, y: 400 },
          p('caim', 640, 395, { triste: true, espelho: true }), { t: 'trigo', x: 560, y: 326, n: 5, s: .6 }, luz(250, -40, { r: 420 })] } },
      { ref: '4:6-8', texto: 'Deus avisou Caim: “O pecado está à porta, querendo dominar você, mas você deve dominá-lo.” Caim não ouviu. Chamou o irmão para o campo e, lá, atacou e matou Abel.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'arvore', x: 650, y: 368, cor: '#3a4a2a' }, p('caim', 330, 395, { bracos: 'frente' }), p('abel', 430, 395, { espelho: true, cajado: false }), fala('O pecado está à porta…\ndomine-o!', 80, 140)] } },
      { ref: '4:9-16', texto: 'Deus perguntou: “Onde está seu irmão?” Caim respondeu: “Não sei. Sou eu o responsável pelo meu irmão?” Deus o castigou: Caim viveria errante pela terra. Mesmo assim, Deus colocou nele um sinal de proteção para que ninguém o matasse.',
        cena: { fundo: 'deserto', el: [luz(650, -30, { opacidade: .6 }), p('caim', 300, 395, { triste: true, anim: 'andar' }), fala('Onde está\nseu irmão?', 520, 140), fala('Sou eu o responsável\npelo meu irmão?', 120, 230)] } },
      { ref: '4:17-26', texto: 'A família de Caim construiu cidades e inventou instrumentos musicais e ferramentas de metal, mas a violência também crescia. Adão e Eva tiveram outro filho, Sete. Naquele tempo, as pessoas começaram a invocar o nome do Senhor.',
        cena: { fundo: 'dia', el: [{ t: 'cidade', x: 600, y: 365, w: 260 }, p('adao', 230, 395, { velho: true, cabelo: '#ddd', barba: '#ddd' }), p('eva', 300, 395), p('crianca', 360, 395, { cor: '#6aa04a', s: .65 }), luz(300, -40, { opacidade: .5 })] } },
    ],
    licao: 'A raiva não controlada leva a grandes males. Deus nos alerta antes de cairmos e nos chama a cuidar uns dos outros: somos, sim, responsáveis pelos nossos irmãos.',
    pergunta: 'O que você costuma fazer quando sente raiva ou inveja? Como dominar esses sentimentos antes que eles nos dominem?',
    versiculo: '4:7',
  };

  C[5] = {
    titulo: 'De Adão a Noé',
    personagens: ['Adão', 'Sete', 'Enoque', 'Matusalém', 'Lameque', 'Noé'],
    cenas: [
      { ref: '5:1-20', texto: 'Este capítulo é uma árvore genealógica: a lista das gerações de Adão até Noé. Ele lembra que o ser humano foi feito à imagem de Deus e que essa imagem passa de pais para filhos. Adão viveu 930 anos e morreu, como Deus tinha dito.',
        cena: { fundo: 'dia', el: [p('adao', 160, 395, { velho: true, cabelo: '#ddd', barba: '#ddd', cajado: true }), p('caim', 260, 392, { cor: '#6a8a5a', s: .95 }), p('abraao', 360, 392, { cor: '#8a6a9a', cajado: false, s: .9 }),
          p('isaque', 450, 392, { s: .85 }), p('jaco', 535, 392, { s: .8, cajado: false }), p('noe', 630, 392, { s: .9, velho: false, cabelo: '#3a2a1e', barba: '#3a2a1e' }), { t: 'rotulo', texto: '10 gerações', x: 20, y: 20 }] } },
      { ref: '5:21-24', texto: 'Um nome se destaca: Enoque. A Bíblia diz que ele “andava com Deus”, ou seja, vivia em amizade com Ele. Um dia Enoque desapareceu, porque Deus o levou. Séculos depois, a carta aos Hebreus explica que ele foi levado sem ver a morte.',
        cena: { fundo: 'ceu', el: [luz(400, -30), { t: 'nuvem', x: 220, y: 300 }, { t: 'nuvem', x: 580, y: 320 }, p('noe', 400, 300, { cor: '#c8a05a', velho: false, cabelo: '#6a4a2a', barba: '#6a4a2a', bracos: 'cima', anim: 'subir' })] } },
      { ref: '5:25-32', texto: 'Matusalém, filho de Enoque, é a pessoa que mais viveu na Bíblia: 969 anos. Seu neto foi Noé. O pai de Noé, Lameque, deu esse nome esperando que o filho trouxesse alívio ao trabalho pesado da terra. Noé teve três filhos: Sem, Cam e Jafé.',
        cena: { fundo: 'dia', el: [p('noe', 260, 395, { cor: '#9a6a4a', s: 1.05, cajado: true }), p('noe', 360, 395, { velho: false, cabelo: '#3a2a1e', barba: '#3a2a1e' }), p('irmao1', 460, 395, { s: .8 }), p('irmao2', 520, 395, { s: .8 }), p('irmao3', 580, 395, { s: .8 }), fala('Sem, Cam e Jafé', 440, 270)] } },
    ],
    licao: 'Gerações vêm e vão, mas Deus continua cumprindo seu plano através das famílias. Como Enoque, podemos “andar com Deus” todos os dias.',
    pergunta: 'O que significa, na prática, “andar com Deus” no dia a dia?',
    versiculo: '5:24',
  };

  C[6] = {
    titulo: 'Noé e a ordem de construir a arca',
    personagens: ['Deus', 'Noé', 'A família de Noé'],
    cenas: [
      { ref: '6:1-7', texto: 'A humanidade cresceu, mas a maldade cresceu ainda mais. As pessoas só pensavam em fazer o mal, e a terra se encheu de violência. Deus ficou profundamente triste por ter criado o ser humano e decidiu trazer um juízo sobre a terra.',
        cena: { fundo: 'tempestade', el: [{ t: 'cidade', x: 400, y: 370, w: 600, cor: '#4a4040' }, { t: 'fogo', x: 250, y: 300, s: .8 }, { t: 'fogo', x: 560, y: 280, s: .7 }, { t: 'nuvem', x: 200, y: 70, cor: '#4a5060' }, { t: 'nuvem', x: 600, y: 60, cor: '#4a5060' }] } },
      { ref: '6:8-13', texto: 'Mas Noé encontrou graça aos olhos de Deus. Ele era um homem justo, que andava com Deus. Então Deus contou a Noé o que ia acontecer: viria um grande dilúvio.',
        cena: { fundo: 'dia', el: [luz(400, -40), p('noe', 400, 395, { bracos: 'orando' }), { t: 'tenda', x: 620, y: 380 }, fala('Vou enviar um dilúvio.\nMas com você farei uma aliança.', 450, 120)] } },
      { ref: '6:14-22', texto: 'Deus deu as instruções: uma arca enorme de madeira, coberta de piche por dentro e por fora, com três andares, uma janela e uma porta. Nela entrariam Noé, sua família e casais de todos os animais, além de comida para todos. Noé fez tudo exatamente como Deus mandou.',
        cena: { fundo: 'dia', el: [{ t: 'arca', x: 430, y: 330, s: 1.1, anim: 'surgir' }, p('noe', 160, 395, { bracos: 'frente' }), p('irmao1', 690, 395, { s: .85 }), p('irmao2', 740, 395, { s: .85, espelho: true }), { t: 'pedras', x: 250, y: 400, s: .6 }] } },
    ],
    licao: 'Mesmo num mundo cheio de maldade, é possível viver de forma justa. Noé obedeceu a Deus quando ninguém mais obedecia, e quando a ordem parecia estranha.',
    pergunta: 'Noé obedeceu mesmo sem ver chuva. Em que área da sua vida você precisa confiar em Deus antes de ver o resultado?',
    versiculo: '6:8',
  };

  C[7] = {
    titulo: 'O dilúvio',
    personagens: ['Noé', 'A família de Noé', 'Os animais'],
    cenas: [
      { ref: '7:1-10', texto: 'Quando a arca ficou pronta, Deus disse a Noé: “Entre na arca com toda a sua família.” Os animais vieram, aos pares, macho e fêmea. Noé tinha 600 anos. Depois de sete dias, a chuva começou.',
        cena: { fundo: 'dia', el: [{ t: 'arca', x: 500, y: 330 }, { t: 'leao', x: 220, y: 398, anim: 'andar' }, { t: 'ovelha', x: 120, y: 402, anim: 'andar' }, { t: 'camelo', x: 330, y: 398, anim: 'andar' }, p('noe', 700, 395, { espelho: true, bracos: 'aberto' }), { t: 'pomba', x: 300, y: 200, anim: 'voar' }] } },
      { ref: '7:11-16', texto: 'As fontes das profundezas se romperam e as comportas do céu se abriram. Choveu sem parar por quarenta dias e quarenta noites. E o próprio Deus fechou a porta da arca.',
        cena: { fundo: 'tempestade', el: [{ t: 'nuvem', x: 150, y: 60, cor: '#3a404a', s: 1.4 }, { t: 'nuvem', x: 450, y: 50, cor: '#3a404a', s: 1.6 }, { t: 'nuvem', x: 700, y: 70, cor: '#3a404a', s: 1.3 },
          { t: 'chuva', x: 0, y: 60, n: 120 }, { t: 'arca', x: 400, y: 330, anim: 'flutuar' }, { t: 'agua', x: 0, y: 360, cor: '#3a5a7a', cor2: '#2a4a6a' }] } },
      { ref: '7:17-24', texto: 'As águas subiram tanto que cobriram até as montanhas mais altas. Tudo o que respirava fora da arca morreu. Só ficaram vivos Noé e os que estavam com ele. A arca flutuou sobre as águas por 150 dias.',
        cena: { fundo: 'agua', el: [{ t: 'nuvem', x: 220, y: 80, cor: '#8a94a0' }, { t: 'arca', x: 400, y: 260, anim: 'flutuar' }, { t: 'agua', x: 0, y: 290, cor: '#3d6688', cor2: '#33597a' }, { t: 'passaro', x: 640, y: 130, anim: 'voar' }] } },
    ],
    licao: 'Deus leva o mal a sério e julga o pecado, mas sempre oferece um caminho de salvação. A arca era o lugar seguro preparado por Ele.',
    pergunta: 'Por que você acha que o próprio Deus fechou a porta da arca? O que isso mostra sobre o cuidado dele?',
    versiculo: '7:16',
  };

  C[8] = {
    titulo: 'As águas baixam',
    personagens: ['Noé', 'O corvo', 'A pomba'],
    cenas: [
      { ref: '8:1-5', texto: 'Deus não se esqueceu de Noé nem dos animais. Fez soprar um vento sobre a terra, e as águas começaram a baixar. A arca parou sobre os montes de Ararate, e aos poucos os picos das montanhas foram aparecendo.',
        cena: { fundo: 'agua', el: [{ t: 'montanha', x: 400, y: 300, w: 360, h: 160, cor: '#6a6f7e' }, { t: 'arca', x: 400, y: 190, s: .7 }, { t: 'agua', x: 0, y: 300, cor: '#4a7698', cor2: '#3d6688' }, { t: 'nuvem', x: 650, y: 90, anim: 'voar' }] } },
      { ref: '8:6-12', texto: 'Depois de quarenta dias, Noé abriu a janela e soltou um corvo, que ficou voando de um lado para outro. Depois soltou uma pomba. Na segunda vez, ela voltou com uma folha nova de oliveira no bico! Na terceira, não voltou mais: a terra estava secando.',
        cena: { fundo: 'ceu', el: [{ t: 'montanha', x: 300, y: 450, w: 500, h: 260, cor: '#7a7f8e' }, { t: 'arca', x: 300, y: 250, s: .8 }, { t: 'pomba', x: 600, y: 160, ramo: true, s: 1.4, anim: 'voar' }, { t: 'arvore', x: 700, y: 450, s: .8, cor: '#6aa84a' }] } },
      { ref: '8:13-22', texto: 'Quando a terra secou, Deus mandou todos saírem da arca. A primeira coisa que Noé fez foi construir um altar e adorar a Deus. Deus prometeu: enquanto a terra existir, haverá plantio e colheita, frio e calor, verão e inverno, dia e noite.',
        cena: { fundo: 'dia', el: [{ t: 'arca', x: 640, y: 300, s: .7 }, { t: 'altar', x: 330, y: 385 }, p('noe', 420, 395, { bracos: 'cima' }), p('irmao1', 200, 395, { s: .85 }), { t: 'ovelha', x: 540, y: 405 }, luz(330, -40)] } },
    ],
    licao: 'Deus se lembra dos seus, mesmo nos longos períodos de espera. Noé respondeu à salvação com gratidão e adoração.',
    pergunta: 'A primeira atitude de Noé fora da arca foi agradecer. Como você costuma reagir quando Deus te livra de algo difícil?',
    versiculo: '8:22',
  };

  C[9] = {
    titulo: 'O arco-íris: a aliança de Deus',
    personagens: ['Deus', 'Noé', 'Sem', 'Cam', 'Jafé'],
    cenas: [
      { ref: '9:1-7', texto: 'Deus abençoou Noé e seus filhos: “Sejam fecundos, multipliquem-se e encham a terra.” Deus também lembrou que a vida humana é sagrada, porque o ser humano foi feito à imagem de Deus.',
        cena: { fundo: 'dia', el: [luz(400, -40), p('noe', 300, 395), p('irmao1', 380, 395, { s: .9 }), p('irmao2', 450, 395, { s: .9 }), p('irmao3', 520, 395, { s: .9 }), { t: 'flores', x: 150, y: 375, w: 500 }] } },
      { ref: '9:8-17', texto: 'Então Deus fez uma aliança, uma promessa solene, com Noé e com todos os seres vivos: nunca mais um dilúvio destruiria toda a terra. E deu um sinal para lembrar a promessa: o arco-íris nas nuvens.',
        cena: { fundo: 'dia', el: [{ t: 'arco-iris', x: 400, y: 360, anim: 'surgir' }, { t: 'nuvem', x: 120, y: 260, s: .8 }, { t: 'nuvem', x: 680, y: 260, s: .8 }, p('noe', 360, 395, { bracos: 'cima' }), { t: 'ovelha', x: 460, y: 402 }, { t: 'pomba', x: 520, y: 200, anim: 'voar' }] } },
      { ref: '9:18-29', texto: 'Noé plantou uma vinha, bebeu vinho, ficou embriagado e se descobriu dentro da tenda. Seu filho Cam viu e foi espalhar para os irmãos, mas Sem e Jafé cobriram o pai com respeito, sem olhar. Até os heróis da fé têm falhas. Noé viveu 950 anos.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'videira', x: 120, y: 380 }, { t: 'videira', x: 180, y: 385, s: .8 }, { t: 'tenda', x: 430, y: 385, s: 1.2 }, p('irmao1', 580, 395, { espelho: true, bracos: 'rosto' }), p('irmao3', 650, 395, { espelho: true, bracos: 'rosto' })] } },
    ],
    licao: 'Deus é fiel às suas promessas. Toda vez que vemos um arco-íris, lembramos que Ele cumpre o que diz, mesmo quando nós falhamos.',
    pergunta: 'Sem e Jafé protegeram a honra do pai mesmo diante do erro dele. Como podemos agir com respeito quando alguém que amamos erra?',
    versiculo: '9:13',
  };

  C[10] = {
    titulo: 'As nações se espalham',
    personagens: ['Sem', 'Cam', 'Jafé', 'Ninrode'],
    cenas: [
      { ref: '10:1-5', texto: 'Este capítulo é chamado de “Tábua das Nações”. Ele mostra como os descendentes dos três filhos de Noé formaram os povos do mundo antigo. Os descendentes de Jafé se espalharam pelas regiões costeiras e ilhas, cada um com sua língua e seu território.',
        cena: { fundo: 'mar', el: [p('irmao3', 200, 300, { s: .8 }), p('irmao1', 400, 300, { s: .8 }), p('irmao2', 600, 300, { s: .8 }), fala('Jafé', 160, 160), fala('Sem', 370, 160), fala('Cam', 570, 160), { t: 'peixe', x: 300, y: 380, anim: 'nadar' }] } },
      { ref: '10:6-20', texto: 'Dos descendentes de Cam vieram povos como os egípcios e os cananeus. Entre eles estava Ninrode, um guerreiro e caçador valente, cujo reino começou em Babel, na terra de Sinear. Daquela região saiu Assur, que construiu Nínive.',
        cena: { fundo: 'deserto', el: [{ t: 'cidade', x: 560, y: 365, w: 340 }, { t: 'piramide', x: 200, y: 360, s: .7 }, p('caim', 370, 395, { cor: '#8a3a2a', bracos: 'cima' }), { t: 'leao', x: 260, y: 400, s: .7 }, fala('Ninrode', 320, 250)] } },
      { ref: '10:21-32', texto: 'Dos descendentes de Sem veio Héber, de quem vem o nome “hebreu”. É dessa linhagem que nascerá Abraão. A Bíblia mostra que todos os povos têm uma origem comum e que Deus se importa com todas as nações.',
        cena: { fundo: 'dia', el: [{ t: 'tenda', x: 200, y: 380 }, { t: 'tenda', x: 360, y: 384, cor: '#a8604a', s: .9 }, { t: 'tenda', x: 520, y: 380, cor: '#8a6a4a' }, p('abraao', 660, 395, { cajado: true, s: .9 }), { t: 'ovelha', x: 600, y: 405, s: .8 }] } },
    ],
    licao: 'Toda a humanidade é uma grande família. Não há povo superior a outro: todos descendem dos mesmos pais e são amados por Deus.',
    pergunta: 'Como saber que todos temos uma origem comum muda a forma como tratamos pessoas de outros povos e culturas?',
    versiculo: '10:32',
  };

  C[11] = {
    titulo: 'A Torre de Babel',
    personagens: ['Os construtores de Babel', 'Terá', 'Abrão', 'Sarai', 'Ló'],
    cenas: [
      { ref: '11:1-4', texto: 'Naquele tempo, todos falavam a mesma língua. As pessoas se reuniram numa planície e disseram: “Vamos construir uma cidade com uma torre que chegue até o céu, para ficarmos famosos e não nos espalharmos.” Elas queriam fama, independência de Deus e desobedecer à ordem de encher a terra.',
        cena: { fundo: 'deserto', el: [{ t: 'torre', x: 420, y: 370, andares: 5, anim: 'surgir' }, p('irmao1', 150, 395, { bracos: 'cima' }), p('irmao2', 230, 395, { bracos: 'frente' }), p('irmao4', 650, 395, { espelho: true, bracos: 'cima' }),
          fala('Vamos ficar famosos!', 90, 250)] } },
      { ref: '11:5-9', texto: 'Deus desceu para ver a cidade e a torre. Então confundiu a língua deles, e ninguém mais entendia ninguém. A obra parou e as pessoas se espalharam pela terra. Por isso a cidade se chamou Babel, que lembra “confusão”.',
        cena: { fundo: 'deserto', el: [luz(400, -40, { opacidade: .7 }), { t: 'torre', x: 420, y: 370, andares: 4 }, p('irmao1', 160, 395, { anim: 'andar', espelho: true }), p('irmao2', 290, 395, { bracos: 'aberto' }), p('irmao4', 640, 395, { anim: 'andar' }),
          fala('Blá blá?', 80, 260), fala('Rátatá!', 250, 250), fala('Glub glub?', 560, 250)] } },
      { ref: '11:10-32', texto: 'A Bíblia segue a família de Sem até chegar a Terá. Terá teve três filhos, entre eles Abrão. Abrão se casou com Sarai, mas ela não podia ter filhos. Terá saiu de Ur dos caldeus com Abrão, Sarai e o neto Ló, rumo a Canaã, mas pararam em Harã.',
        cena: { fundo: 'deserto', el: [{ t: 'cidade', x: 130, y: 365, w: 220 }, { t: 'camelo', x: 330, y: 400 }, p('labao', 420, 395, { anim: 'andar', cajado: true }), p('abraao', 490, 395, { anim: 'andar' }), p('sara', 555, 395, { anim: 'andar' }), p('lo', 620, 395, { anim: 'andar' })] } },
    ],
    licao: 'O orgulho humano tenta construir sem Deus e ficar famoso pelos próprios meios. Deus resiste ao orgulho, mas já estava preparando uma família por meio da qual abençoaria todos os povos.',
    pergunta: 'Que “torres” as pessoas constroem hoje para se sentirem grandes? O que acontece quando deixamos Deus de fora dos nossos planos?',
    versiculo: '11:9',
  };

  C[12] = {
    titulo: 'O chamado de Abrão',
    personagens: ['Deus', 'Abrão', 'Sarai', 'Ló', 'O faraó'],
    cenas: [
      { ref: '12:1-3', texto: 'Deus disse a Abrão: “Saia da sua terra, deixe seus parentes e vá para a terra que eu vou lhe mostrar. Farei de você uma grande nação e o abençoarei. Por meio de você, todas as famílias da terra serão abençoadas.” Começa aqui a grande história da salvação.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 60, h: 260 }, luz(400, -30, { opacidade: .6 }), p('abraao', 400, 395, { bracos: 'cima' }), { t: 'tenda', x: 620, y: 382, cor: '#6a4a3a' }, fala('Saia da sua terra.\nEu vou abençoar você!', 440, 140)] } },
      { ref: '12:4-9', texto: 'Abrão obedeceu. Aos 75 anos, partiu com Sarai, seu sobrinho Ló, os servos e todos os seus bens. Chegando a Canaã, Deus prometeu: “Darei esta terra à sua descendência.” Abrão construiu um altar e adorou ao Senhor.',
        cena: { fundo: 'dia', el: [{ t: 'camelo', x: 120, y: 400, anim: 'andar' }, p('lo', 220, 395, { anim: 'andar' }), p('sara', 290, 395, { anim: 'andar' }), p('abraao', 360, 395, { anim: 'andar' }), { t: 'altar', x: 560, y: 385 }, { t: 'arvore', x: 680, y: 365 }, { t: 'ovelha', x: 470, y: 405 }] } },
      { ref: '12:10-20', texto: 'Veio uma fome e Abrão foi para o Egito. Com medo, pediu que Sarai dissesse ser apenas sua irmã, pois ela era muito bonita. O faraó a levou para o palácio, mas Deus mandou pragas sobre a casa do faraó. O faraó descobriu a verdade, repreendeu Abrão e o mandou embora.',
        cena: { fundo: 'egito', el: [{ t: 'piramide', x: 650, y: 360, h: 170 }, { t: 'palacio', x: 330, y: 360, s: .55 }, p('farao', 260, 380, { bracos: 'frente' }), p('sara', 330, 380), p('abraao', 480, 392, { espelho: true, triste: true }), fala('Por que você mentiu?', 120, 240)] } },
    ],
    licao: 'Fé é obedecer sem ver o caminho inteiro. Abrão tinha medo e errou, mas Deus continuou fiel à promessa e protegeu sua família.',
    pergunta: 'O que você precisaria “deixar para trás” para seguir a Deus com mais confiança?',
    versiculo: '12:3',
  };

  C[13] = {
    titulo: 'Abrão e Ló se separam',
    personagens: ['Abrão', 'Ló'],
    cenas: [
      { ref: '13:1-7', texto: 'Abrão voltou do Egito muito rico em gado, prata e ouro. Ló também tinha muitos rebanhos. A terra ficou pequena para os dois, e os pastores de Abrão e os de Ló começaram a brigar.',
        cena: { fundo: 'dia', el: [{ t: 'ovelha', x: 120, y: 400 }, { t: 'ovelha', x: 180, y: 410, s: .9 }, { t: 'vaca', x: 650, y: 398, espelho: true }, { t: 'ovelha', x: 720, y: 410, espelho: true },
          p('irmao1', 330, 395, { bracos: 'aberto' }), p('irmao2', 460, 395, { bracos: 'aberto', espelho: true }), fala('Esse pasto é nosso!', 120, 260), fala('Não, é nosso!', 470, 260)] } },
      { ref: '13:8-13', texto: 'Abrão, pacificador, disse: “Não haja briga entre nós, somos parentes. Escolha você primeiro para onde ir.” Ló olhou e escolheu a planície do Jordão, verde e bem regada, perto de Sodoma, uma cidade de gente muito perversa.',
        cena: { fundo: 'montanha', el: [{ t: 'cidade', x: 640, y: 380, w: 200, cor: '#8a6a5a' }, { t: 'rio', x: 600, y: 410, s: .6 }, p('abraao', 260, 400), p('lo', 360, 400, { bracos: 'frente' }), fala('Escolha você primeiro.', 120, 260)] } },
      { ref: '13:14-18', texto: 'Depois que Ló partiu, Deus disse a Abrão: “Olhe para o norte, o sul, o leste e o oeste: toda esta terra darei a você e aos seus descendentes, que serão tantos quanto o pó da terra.” Abrão foi morar em Hebrom e ali construiu outro altar.',
        cena: { fundo: 'dia', el: [luz(400, -40), p('abraao', 360, 392, { bracos: 'aberto' }), { t: 'altar', x: 560, y: 385 }, { t: 'arvore', x: 160, y: 365, s: 1.2 }, { t: 'tenda', x: 680, y: 380 }] } },
    ],
    licao: 'Abrão preferiu a paz à vantagem e confiou que Deus cuidaria dele. Ló escolheu pelo que os olhos viam, e isso o levou para perto do perigo.',
    pergunta: 'Você costuma escolher pelo que parece melhor na hora ou pelo que agrada a Deus?',
    versiculo: '13:8',
  };

  C[14] = {
    titulo: 'Abrão resgata Ló e encontra Melquisedeque',
    personagens: ['Abrão', 'Ló', 'Melquisedeque', 'O rei de Sodoma'],
    cenas: [
      { ref: '14:1-12', texto: 'Quatro reis poderosos fizeram guerra contra cinco reis da região, incluindo o rei de Sodoma. Os invasores venceram, saquearam as cidades e levaram prisioneiros. Entre eles estava Ló, sobrinho de Abrão.',
        cena: { fundo: 'fogo', el: [{ t: 'cidade', x: 400, y: 370, w: 500, cor: '#3a2a24' }, { t: 'fogo', x: 300, y: 310 }, { t: 'fogo', x: 520, y: 300, s: .8 }, p('lo', 400, 400, { triste: true }), p('irmao4', 320, 400, { cor: '#3a3a3a', cajado: true }), p('irmao1', 480, 400, { cor: '#3a3a3a', cajado: true, espelho: true })] } },
      { ref: '14:13-16', texto: 'Quando Abrão soube, reuniu 318 homens treinados da sua casa, perseguiu os reis de noite, venceu e trouxe de volta Ló, as pessoas e todos os bens.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 40, h: 200 }, { t: 'lua', x: 650, y: 80 }, p('abraao', 220, 395, { bracos: 'cima', anim: 'andar' }), p('irmao1', 300, 395, { anim: 'andar', cajado: true }), p('irmao2', 370, 395, { anim: 'andar', cajado: true }), p('irmao3', 440, 395, { anim: 'andar', cajado: true }), { t: 'rotulo', texto: '318 homens', x: 20, y: 20 }] } },
      { ref: '14:17-24', veja: ['hebreus 7:1-3'], texto: 'Na volta, Melquisedeque, rei de Salém e sacerdote do Deus Altíssimo, trouxe pão e vinho e abençoou Abrão. Abrão lhe deu o dízimo de tudo. Ao rei de Sodoma, porém, Abrão não quis aceitar nem um fio de linha: não queria que ninguém dissesse que outro o enriqueceu além de Deus.',
        cena: { fundo: 'dia', el: [{ t: 'cidade', x: 650, y: 365, w: 200 }, p('labao', 470, 395, { cor: '#f0e8d8', coroa: true, bracos: 'frente', espelho: true }), p('abraao', 340, 395, { bracos: 'orando' }), { t: 'cesto', x: 420, y: 400 }, { t: 'taca', x: 470, y: 400 }, fala('Bendito seja Abrão\npelo Deus Altíssimo!', 470, 200)] } },
    ],
    licao: 'Abrão foi corajoso para ajudar quem estava em perigo, mesmo que Ló tivesse feito escolhas ruins. E reconheceu que toda vitória e riqueza vêm de Deus.',
    pergunta: 'Abrão recusou o presente do rei de Sodoma. Há ofertas que parecem boas mas comprometem nossa confiança em Deus?',
    versiculo: '14:20',
  };

  C[15] = {
    titulo: 'Conte as estrelas: a aliança com Abrão',
    personagens: ['Deus', 'Abrão'],
    cenas: [
      { ref: '15:1-3', texto: 'Deus falou com Abrão numa visão: “Não tenha medo, Abrão. Eu sou o seu escudo, e a sua recompensa será muito grande.” Mas Abrão desabafou: “De que adianta? Não tenho filhos, e um servo será o meu herdeiro.”',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 30, h: 200 }, luz(400, -30, { opacidade: .6 }), p('abraao', 400, 395, { triste: true }), { t: 'tenda', x: 600, y: 382, cor: '#6a4a3a' }, fala('Não tenha medo.\nEu sou o seu escudo.', 440, 150)] } },
      { ref: '15:4-6', texto: 'Deus o levou para fora da tenda e disse: “Olhe para o céu e conte as estrelas, se puder. Assim será a sua descendência.” Abrão creu no Senhor, e Deus considerou isso como justiça.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 160, h: 330, semente: 21 }, p('abraao', 400, 395, { bracos: 'cima' }), fala('Conte as estrelas…\nassim será a sua descendência!', 120, 150)] } },
      { ref: '15:7-21', texto: 'Para confirmar a promessa, Deus fez uma aliança do jeito antigo: animais foram partidos ao meio. Ao anoitecer, um fogo fumegante e uma tocha passaram entre as partes. Era Deus se comprometendo sozinho a cumprir a promessa. Ele também revelou que o povo seria escravo numa terra estrangeira por 400 anos, mas depois sairia livre.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 40, h: 160 }, { t: 'tocha', x: 400, y: 380, s: 1.4, anim: 'flutuar' }, { t: 'pedras', x: 260, y: 400, s: .6 }, { t: 'pedras', x: 540, y: 400, s: .6 }, p('abraao', 140, 395, { pose: 'ajoelhado', bracos: 'orando' })] } },
    ],
    licao: 'Ser justo diante de Deus não depende de merecimento, mas de confiar nele. Abrão creu numa promessa impossível e foi aceito por Deus por causa da sua fé.',
    pergunta: 'Qual promessa de Deus parece difícil de acreditar para você hoje?',
    versiculo: '15:6',
  };

  C[16] = {
    titulo: 'Agar e Ismael: o Deus que me vê',
    personagens: ['Sarai', 'Abrão', 'Agar', 'O Anjo do Senhor', 'Ismael'],
    cenas: [
      { ref: '16:1-6', texto: 'Os anos passavam e Sarai continuava sem filhos. Impaciente, ela ofereceu a Abrão sua serva egípcia, Agar, para ter um filho por meio dela, um costume da época. Agar engravidou e passou a desprezar Sarai. Sarai a maltratou tanto que Agar fugiu.',
        cena: { fundo: 'dia', el: [{ t: 'tenda', x: 200, y: 380, s: 1.1 }, p('sara', 330, 395, { bracos: 'frente' }), p('abraao', 420, 395), p('agar', 580, 395, { espelho: true, anim: 'andar' })] } },
      { ref: '16:7-12', texto: 'No deserto, perto de uma fonte, o Anjo do Senhor encontrou Agar: “De onde você vem e para onde vai?” Ele a mandou voltar e prometeu: “Você terá um filho e o chamará Ismael, que quer dizer ‘Deus ouve’, porque o Senhor ouviu o seu sofrimento.”',
        cena: { fundo: 'deserto', el: [{ t: 'poco', x: 560, y: 395 }, { t: 'palmeira', x: 680, y: 380 }, { t: 'anjo', x: 420, y: 390 }, p('agar', 260, 395, { bracos: 'rosto' }), fala('O Senhor ouviu\no seu sofrimento.', 450, 160)] } },
      { ref: '16:13-16', texto: 'Agar chamou o Senhor de “o Deus que me vê”. Ela, uma estrangeira e serva esquecida, tinha sido vista e cuidada por Deus. Voltou e deu à luz Ismael. Abrão tinha 86 anos.',
        cena: { fundo: 'dia', el: [luz(400, -40, { opacidade: .7 }), p('agar', 380, 395, { bracos: 'cima' }), { t: 'bebe', x: 470, y: 400 }, fala('Tu és o Deus que me vê!', 160, 180)] } },
    ],
    licao: 'Tentar “ajudar Deus” do nosso jeito costuma trazer conflitos. Mas Deus vê e cuida até de quem se sente invisível e rejeitado.',
    pergunta: 'Você já se sentiu invisível? Como é saber que Deus é “o Deus que me vê”?',
    versiculo: '16:13',
  };

  C[17] = {
    titulo: 'Abraão e Sara: novos nomes, nova promessa',
    personagens: ['Deus', 'Abraão', 'Sara', 'Ismael'],
    cenas: [
      { ref: '17:1-8', texto: 'Quando Abrão tinha 99 anos, Deus apareceu e disse: “Eu sou o Deus Todo-Poderoso. Ande na minha presença.” Deus mudou o nome dele de Abrão (“pai exaltado”) para Abraão (“pai de muitas nações”).',
        cena: { fundo: 'dia', el: [luz(400, -40), p('abraao', 400, 395, { velho: true, pose: 'ajoelhado', bracos: 'orando' }), fala('Seu nome agora será Abraão:\npai de muitas nações!', 430, 140)] } },
      { ref: '17:9-14', texto: 'Como sinal da aliança, todos os homens da família de Abraão deveriam ser circuncidados. Seria uma marca no próprio corpo, lembrando que eles pertenciam a Deus.',
        cena: { fundo: 'dia', el: [p('abraao', 260, 395, { velho: true }), p('ismael', 330, 395, { s: .8 }), p('irmao1', 420, 395), p('irmao2', 490, 395), p('irmao3', 560, 395), { t: 'tenda', x: 700, y: 380 }, { t: 'rotulo', texto: 'Sinal da aliança', x: 20, y: 20 }] } },
      { ref: '17:15-27', texto: 'Deus também mudou o nome de Sarai para Sara (“princesa”) e prometeu: “Ela terá um filho seu.” Abraão caiu com o rosto em terra e riu: “Um homem de cem anos e uma mulher de noventa vão ter um filho?” Deus confirmou: “O nome dele será Isaque”, que quer dizer “ele ri”.',
        cena: { fundo: 'dia', el: [luz(560, -40, { opacidade: .7 }), p('abraao', 340, 395, { velho: true, bracos: 'rosto' }), p('sara', 420, 395), fala('Haha! Com cem anos?', 150, 230), fala('Vocês terão um filho:\nIsaque.', 500, 150)] } },
    ],
    licao: 'Deus muda nomes porque muda histórias. Para Ele nada é impossível, nem mesmo uma promessa que parece engraçada de tão improvável.',
    pergunta: 'Se Deus te desse um nome novo que descrevesse o que Ele quer fazer na sua vida, qual seria?',
    versiculo: '17:1',
  };

  C[18] = {
    titulo: 'Três visitantes e a oração por Sodoma',
    personagens: ['Abraão', 'Sara', 'Três visitantes (o Senhor e dois anjos)'],
    cenas: [
      { ref: '18:1-8', texto: 'No calor do dia, Abraão estava sentado na porta da tenda, perto dos carvalhos de Manre, quando viu três homens. Correu ao encontro deles, se curvou e os convidou para descansar. Preparou pão, carne e coalhada: uma verdadeira festa de hospitalidade.',
        cena: { fundo: 'deserto', el: [{ t: 'sol', x: 680, y: 80 }, { t: 'arvore', x: 120, y: 360, s: 1.3 }, { t: 'tenda', x: 250, y: 380 }, { t: 'mesa', x: 520, y: 395 },
          { t: 'anjo', x: 450, y: 380, s: .85 }, { t: 'anjo', x: 530, y: 375, s: .85 }, { t: 'anjo', x: 610, y: 380, s: .85 }, p('abraao', 350, 395, { velho: true, bracos: 'frente' })] } },
      { ref: '18:9-15', texto: 'Um dos visitantes disse: “Daqui a um ano, Sara terá um filho.” Sara, escutando escondida na entrada da tenda, riu por dentro: “Velha como estou?” O Senhor perguntou: “Por que Sara riu? Existe alguma coisa difícil demais para o Senhor?”',
        cena: { fundo: 'deserto', el: [{ t: 'tenda', x: 220, y: 385, s: 1.3 }, p('sara', 230, 395, { s: .9, bracos: 'rosto' }), { t: 'anjo', x: 520, y: 385 }, p('abraao', 400, 395, { velho: true }),
          fala('Hihi… eu, velha assim?', 40, 220), fala('Existe algo difícil\ndemais para o Senhor?', 540, 150)] } },
      { ref: '18:16-33', texto: 'Deus revelou que ia julgar Sodoma e Gomorra, cidades muito perversas. Abraão intercedeu: “E se houver cinquenta justos lá?” Deus pouparia. E se fossem quarenta? Trinta? Vinte? Dez? Deus respondeu: “Por amor de dez, não a destruirei.”',
        cena: { fundo: 'por-do-sol', el: [{ t: 'cidade', x: 640, y: 380, w: 240, cor: '#3a2430' }, luz(400, -40, { opacidade: .6 }), p('abraao', 320, 395, { velho: true, bracos: 'orando' }), fala('E se houver\napenas dez justos?', 120, 200), fala('Não destruirei\npor amor dos dez.', 420, 140)] } },
    ],
    licao: 'Deus valoriza a hospitalidade e ouve com paciência quem intercede pelos outros. Nada é difícil demais para Ele.',
    pergunta: 'Por quem você poderia “interceder” como Abraão fez por Sodoma?',
    versiculo: '18:14',
  };

  C[19] = {
    titulo: 'A destruição de Sodoma e Gomorra',
    personagens: ['Ló', 'A esposa de Ló', 'As filhas de Ló', 'Dois anjos'],
    cenas: [
      { ref: '19:1-14', texto: 'Dois anjos chegaram a Sodoma. Ló insistiu que dormissem em sua casa. Mas os homens da cidade cercaram a casa com intenções violentas. Os anjos cegaram os agressores e avisaram Ló: “Tire sua família daqui, pois esta cidade será destruída.” Os genros de Ló acharam que era brincadeira.',
        cena: { fundo: 'noite', el: [{ t: 'cidade', x: 400, y: 370, w: 700, cor: '#2a2a3a', janela: '#c89a4a' }, { t: 'anjo', x: 330, y: 390, s: .9 }, { t: 'anjo', x: 470, y: 390, s: .9 }, p('lo', 400, 392, { bracos: 'aberto' }), fala('Saiam daqui depressa!', 480, 220)] } },
      { ref: '19:15-22', texto: 'Ao amanhecer, como Ló hesitava, os anjos o pegaram pela mão, junto com a esposa e as duas filhas, e os levaram para fora da cidade. Deus teve misericórdia. “Fujam para salvar a vida! Não olhem para trás!”',
        cena: { fundo: 'aurora', el: [{ t: 'cidade', x: 640, y: 380, w: 250, cor: '#3a3050' }, { t: 'anjo', x: 480, y: 395, s: .9, espelho: true }, p('lo', 360, 395, { espelho: true, anim: 'andar' }), p('sara', 290, 395, { veu: '#a0a0c0', cor: '#6a5a8a', espelho: true, anim: 'andar' }),
          p('eva', 220, 395, { s: .8, espelho: true, anim: 'andar' }), p('eva', 160, 395, { s: .75, cor: '#c08a5a', espelho: true, anim: 'andar' }), fala('Não olhem para trás!', 500, 230)] } },
      { ref: '19:23-29', texto: 'Então o Senhor fez chover fogo e enxofre sobre Sodoma e Gomorra. As cidades foram destruídas. A esposa de Ló olhou para trás e virou uma estátua de sal. Deus se lembrou de Abraão e livrou Ló do meio da destruição.',
        cena: { fundo: 'fogo', el: [{ t: 'cidade', x: 560, y: 380, w: 400, cor: '#1a1010' }, { t: 'fogo', x: 450, y: 320, s: 1.2 }, { t: 'fogo', x: 600, y: 300, s: 1.4 }, { t: 'fogo', x: 720, y: 330 },
          { t: 'chuva', x: 300, y: 0, w: 500, n: 60, cor: '#ffb040' }, p('sara', 260, 395, { cor: '#e8e4dc', veu: '#f4f0ea', pele: '#e8e4dc' }), p('lo', 110, 395, { espelho: true, anim: 'andar' })] } },
      { ref: '19:30-38', texto: 'Ló e as filhas foram morar numa caverna. Ali, com medo de ficarem sem descendentes, as filhas tomaram uma decisão errada e embriagaram o pai. Dessa história nasceram os moabitas e os amonitas, povos que aparecerão muito na Bíblia.',
        cena: { fundo: 'montanha', el: [{ t: 'caverna', x: 400, y: 390, s: 1.3 }, { t: 'fogo', x: 400, y: 390, s: .5 }, p('lo', 300, 395, { triste: true })] } },
    ],
    licao: 'Deus é paciente, mas julga o mal. Ele também é misericordioso: puxou Ló pela mão. A esposa de Ló nos lembra de não ficar presos ao passado do qual Deus nos tirou.',
    pergunta: 'Há algo do “passado” que Deus te tirou e que às vezes você ainda deseja olhar para trás?',
    versiculo: '19:26',
  };

  C[20] = {
    titulo: 'Abraão e Abimeleque',
    personagens: ['Abraão', 'Sara', 'Abimeleque, rei de Gerar'],
    cenas: [
      { ref: '20:1-7', texto: 'Abraão foi morar em Gerar e repetiu o mesmo erro do Egito: disse que Sara era sua irmã. O rei Abimeleque a levou para o palácio. Mas Deus falou com o rei num sonho: “Ela é casada! Devolva-a ao marido.”',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 30, h: 160 }, { t: 'palacio', x: 400, y: 370, s: .6 }, p('farao', 330, 380, { cor: '#8a3a4a', pose: 'deitado' }), luz(400, -40, { opacidade: .5 }), fala('Ela é casada!\nDevolva-a ao marido.', 440, 150)] } },
      { ref: '20:8-18', texto: 'Na manhã seguinte, Abimeleque chamou Abraão: “Por que você fez isso conosco?” Abraão admitiu que teve medo. O rei devolveu Sara, deu presentes e permitiu que morassem em sua terra. Abraão orou, e Deus curou a família do rei.',
        cena: { fundo: 'dia', el: [{ t: 'palacio', x: 650, y: 380, s: .5 }, p('farao', 520, 395, { cor: '#8a3a4a', espelho: true, bracos: 'aberto' }), p('abraao', 340, 395, { velho: true, triste: true }), p('sara', 260, 395), { t: 'ovelha', x: 430, y: 405 }, { t: 'moedas', x: 470, y: 405 }, fala('Por que fez isso?', 470, 230)] } },
    ],
    licao: 'Até homens de fé repetem erros por medo. Ainda assim, Deus protege suas promessas e trabalha apesar de nossas falhas.',
    pergunta: 'Qual medo costuma te levar a “meias verdades”? Como a confiança em Deus pode mudar isso?',
    versiculo: '20:17',
  };

  C[21] = {
    titulo: 'Nasce Isaque, o filho da promessa',
    personagens: ['Abraão', 'Sara', 'Isaque', 'Agar', 'Ismael'],
    cenas: [
      { ref: '21:1-7', texto: 'Deus cumpriu exatamente o que tinha prometido: Sara ficou grávida e deu à luz um filho, quando Abraão tinha cem anos. Eles o chamaram de Isaque. Sara disse, feliz: “Deus me fez rir, e todos que souberem vão rir comigo!”',
        cena: { fundo: 'dia', el: [luz(400, -40), { t: 'tenda', x: 160, y: 380 }, p('abraao', 340, 395, { velho: true, bracos: 'cima' }), p('sara', 430, 395, { bracos: 'frente' }), { t: 'bebe', x: 470, y: 330 }, fala('Deus me fez rir!', 480, 180), { t: 'coracao', x: 400, y: 200, anim: 'pulsar' }] } },
      { ref: '21:8-21', texto: 'Ismael zombou de Isaque, e Sara pediu que Agar e o filho fossem embora. No deserto, a água acabou e Agar se afastou chorando para não ver o filho morrer. Deus ouviu o menino, abriu os olhos de Agar e ela viu um poço. Deus prometeu que Ismael também seria uma grande nação.',
        cena: { fundo: 'deserto', el: [{ t: 'sol', x: 680, y: 80 }, { t: 'poco', x: 540, y: 395, anim: 'surgir' }, p('agar', 330, 395, { bracos: 'rosto', triste: true }), p('ismael', 230, 395, { pose: 'deitado', s: .8 }), luz(540, -40, { opacidade: .6 })] } },
      { ref: '21:22-34', texto: 'Abimeleque reconheceu: “Deus está com você em tudo o que faz.” Os dois fizeram um acordo de paz num poço que Abraão tinha cavado. O lugar recebeu o nome de Berseba, “poço do juramento”. Ali Abraão plantou uma árvore e invocou o Senhor, o Deus Eterno.',
        cena: { fundo: 'dia', el: [{ t: 'poco', x: 400, y: 395 }, p('abraao', 300, 395, { velho: true, bracos: 'frente' }), p('farao', 500, 395, { cor: '#8a3a4a', espelho: true, bracos: 'frente' }), { t: 'arvore', x: 650, y: 368, s: .8, anim: 'surgir' }, { t: 'ovelha', x: 170, y: 402 }] } },
    ],
    licao: 'As promessas de Deus podem demorar, mas não falham. E Deus cuida também de quem parece estar “fora” da história principal, como Agar e Ismael.',
    pergunta: 'Qual promessa ou oração atendida já te fez “rir de alegria” como Sara?',
    versiculo: '21:1',
  };

  C[22] = {
    titulo: 'O teste de Abraão no monte Moriá',
    personagens: ['Deus', 'Abraão', 'Isaque', 'O Anjo do Senhor'],
    cenas: [
      { ref: '22:1-8', texto: 'Deus colocou Abraão à prova: “Pegue seu filho, seu único filho, Isaque, a quem você ama, e ofereça-o em sacrifício num monte que vou indicar.” Abraão partiu de madrugada. Isaque carregava a lenha e perguntou: “Pai, onde está o cordeiro?” Abraão respondeu: “Deus mesmo providenciará o cordeiro, meu filho.”',
        cena: { fundo: 'montanha', el: [p('abraao', 330, 400, { velho: true, anim: 'andar' }), p('isaque', 410, 400, { barba: false, s: .85, anim: 'andar' }), { t: 'feixe', x: 430, y: 330, s: .5 }, fala('Pai, onde está o cordeiro?', 440, 240), fala('Deus proverá, meu filho.', 90, 230)] } },
      { ref: '22:9-12', texto: 'No alto do monte, Abraão construiu o altar e arrumou a lenha. Quando levantou a mão, o Anjo do Senhor gritou do céu: “Abraão! Abraão! Não faça nada ao menino! Agora sei que você teme a Deus, pois não me negou seu único filho.”',
        cena: { fundo: 'montanha', el: [luz(400, -40), { t: 'altar', x: 400, y: 395, fogo: false }, p('isaque', 400, 340, { barba: false, s: .7, bracos: 'orando' }), p('abraao', 290, 400, { velho: true, bracos: 'cima' }), fala('Abraão! Pare!', 470, 150)] } },
      { ref: '22:13-24', veja: ['joao 1:29'], texto: 'Abraão olhou e viu um carneiro preso pelos chifres num arbusto. Ele o ofereceu no lugar do filho e chamou o lugar de “O Senhor Proverá”. Deus renovou a promessa: por meio da descendência de Abraão, todas as nações seriam abençoadas. Depois, Abraão recebeu notícias da família do seu irmão Naor, onde havia nascido Rebeca, que logo entraria nesta história.',
        cena: { fundo: 'montanha', el: [{ t: 'altar', x: 330, y: 395 }, { t: 'arvore', x: 560, y: 390, s: .6, cor: '#5a7a3a' }, { t: 'ovelha', x: 540, y: 400, chifres: true, anim: 'surgir' }, p('abraao', 200, 400, { velho: true, bracos: 'cima' }), p('isaque', 420, 400, { barba: false, s: .85, bracos: 'aberto' }), { t: 'rotulo', texto: 'O Senhor Proverá', x: 20, y: 20 }] } },
    ],
    licao: 'Abraão confiou que Deus era bom mesmo diante do pedido mais difícil. Deus proveu um substituto. Séculos depois, Jesus seria chamado de “Cordeiro de Deus”, oferecido em nosso lugar.',
    pergunta: 'O que você ama tanto que seria difícil entregar a Deus? Você confia que Ele proverá?',
    versiculo: '22:8',
  };

  C[23] = {
    titulo: 'A morte de Sara',
    personagens: ['Abraão', 'Sara', 'Efrom, o hitita'],
    cenas: [
      { ref: '23:1-2', texto: 'Sara viveu 127 anos e morreu em Hebrom, na terra de Canaã. Abraão chorou e lamentou profundamente a morte da esposa com quem tinha caminhado a vida inteira.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'tenda', x: 560, y: 385, s: 1.1, cor: '#6a3a3a' }, p('abraao', 360, 395, { velho: true, bracos: 'rosto', triste: true })] } },
      { ref: '23:3-20', texto: 'Abraão era estrangeiro na terra e não tinha onde sepultá-la. Ele negociou com os hititas e comprou, pagando o preço completo, o campo de Efrom com a caverna de Macpela. Foi o primeiro pedaço da Terra Prometida que realmente pertenceu à família de Abraão.',
        cena: { fundo: 'dia', el: [{ t: 'caverna', x: 620, y: 385 }, p('abraao', 300, 395, { velho: true, bracos: 'frente' }), p('labao', 420, 395, { cor: '#5a6a3a', espelho: true }), { t: 'moedas', x: 360, y: 405 }, { t: 'rotulo', texto: '400 siclos de prata', x: 20, y: 20 }] } },
    ],
    licao: 'A fé não elimina a dor do luto. Abraão chorou, mas também agiu com esperança, comprando um pedaço da terra que Deus tinha prometido.',
    pergunta: 'Como a esperança nas promessas de Deus nos ajuda a enfrentar a perda de quem amamos?',
    versiculo: '23:2',
  };

  C[24] = {
    titulo: 'Uma esposa para Isaque',
    personagens: ['Abraão', 'O servo de Abraão', 'Rebeca', 'Labão', 'Isaque'],
    cenas: [
      { ref: '24:1-14', texto: 'Abraão, já idoso, enviou seu servo de confiança à terra de seus parentes para buscar uma esposa para Isaque. Chegando a um poço ao entardecer, o servo orou: “Senhor, que a moça que me oferecer água e também der de beber aos meus camelos seja a escolhida.”',
        cena: { fundo: 'por-do-sol', el: [{ t: 'poco', x: 500, y: 395 }, { t: 'camelo', x: 170, y: 400 }, { t: 'camelo', x: 260, y: 405, s: .9 }, p('servo', 370, 395, { pose: 'ajoelhado', bracos: 'orando' }), fala('Senhor, mostra-me\nquem é a escolhida.', 400, 200)] } },
      { ref: '24:15-27', texto: 'Antes mesmo de terminar a oração, chegou Rebeca com o cântaro no ombro. Ela deu água ao servo e disse: “Vou buscar água para os seus camelos também!” Dez camelos com sede: era muito trabalho! O servo agradeceu a Deus, que o guiou.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'poco', x: 420, y: 395 }, p('rebeca', 520, 395, { bracos: 'frente', espelho: true }), { t: 'camelo', x: 200, y: 400 }, { t: 'camelo', x: 300, y: 405, s: .9 }, p('servo', 640, 395, { espelho: true, bracos: 'cima' }), fala('Darei água aos\nseus camelos também!', 450, 210)] } },
      { ref: '24:28-61', texto: 'Na casa de Rebeca, o servo contou tudo ao irmão dela, Labão, e à família. Todos reconheceram: “Isso vem do Senhor.” Perguntaram a Rebeca se queria ir, e ela respondeu com coragem: “Eu irei.”',
        cena: { fundo: 'interior', el: [p('servo', 250, 395, { bracos: 'aberto' }), p('labao', 400, 395, { velho: false, cabelo: '#3a2a1e', barba: '#3a2a1e', espelho: true }), p('rebeca', 520, 395, { espelho: true }), { t: 'mesa', x: 400, y: 440, s: .8 }, fala('Eu irei.', 560, 240)] } },
      { ref: '24:62-67', texto: 'Ao entardecer, Isaque meditava no campo quando viu os camelos chegando. Rebeca cobriu o rosto com o véu. Isaque a levou para a tenda de Sara, sua mãe, casou-se com ela e a amou. Assim ele foi consolado da morte da mãe.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'tenda', x: 650, y: 385 }, p('isaque', 360, 395, { bracos: 'aberto' }), p('rebeca', 440, 395, { espelho: true }), { t: 'camelo', x: 150, y: 405 }, { t: 'coracao', x: 400, y: 230, anim: 'pulsar' }] } },
    ],
    licao: 'Deus guia quem ora e espera nele. A disposição de Rebeca em servir e sua coragem em dizer “eu irei” fizeram dela parte da história da promessa.',
    pergunta: 'Em que decisão importante você tem pedido direção a Deus? Como você reconhece a resposta dele?',
    versiculo: '24:27',
  };

  C[25] = {
    titulo: 'Esaú e Jacó: os gêmeos',
    personagens: ['Abraão', 'Isaque', 'Rebeca', 'Esaú', 'Jacó'],
    cenas: [
      { ref: '25:1-18', texto: 'Abraão viveu 175 anos e morreu “em boa velhice”. Isaque e Ismael, juntos, o sepultaram na caverna de Macpela, ao lado de Sara. Os descendentes de Ismael formaram doze tribos, como Deus tinha prometido.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'caverna', x: 560, y: 390 }, p('isaque', 320, 395, { triste: true }), p('ismael', 400, 395, { s: 1, barba: true, triste: true }), { t: 'estrelas', x: 0, y: 0, n: 20, h: 140 }] } },
      { ref: '25:19-26', texto: 'Rebeca também não conseguia ter filhos. Isaque orou e Deus respondeu: ela ficou grávida de gêmeos que se empurravam dentro dela! Deus disse: “Duas nações estão no seu ventre, e o mais velho servirá ao mais novo.” Primeiro nasceu Esaú, ruivo e peludo; depois Jacó, segurando o calcanhar do irmão.',
        cena: { fundo: 'interior', el: [p('rebeca', 400, 395, { bracos: 'frente' }), { t: 'bebe', x: 330, y: 330, anim: 'flutuar' }, { t: 'bebe', x: 470, y: 330, anim: 'flutuar', atraso: .5 }, p('isaque', 250, 395, { bracos: 'cima' }), fala('Esaú e Jacó!', 480, 220)] } },
      { ref: '25:27-34', texto: 'Esaú cresceu caçador, homem do campo; Jacó era tranquilo e ficava nas tendas. Um dia, Esaú chegou exausto e faminto e pediu do ensopado vermelho que Jacó cozinhava. Jacó disse: “Venda-me antes o seu direito de filho mais velho.” Esaú respondeu: “Estou morrendo de fome, de que me serve isso?” E trocou a bênção da família por um prato de comida.',
        cena: { fundo: 'dia', el: [{ t: 'tenda', x: 640, y: 382 }, { t: 'fogo', x: 470, y: 395, s: .6 }, p('jaco', 540, 395, { espelho: true, bracos: 'frente', cajado: false }), p('esau', 360, 395, { bracos: 'frente' }), fala('Me dá esse ensopado!', 120, 240), fala('Só se me der\nseu direito de primogênito.', 500, 170)] } },
    ],
    licao: 'Esaú desprezou algo precioso por uma vontade passageira. Às vezes trocamos o que é eterno pelo que é imediato.',
    pergunta: 'O que é valioso na sua vida que você corre o risco de trocar por algo passageiro?',
    versiculo: '25:34',
  };

  C[26] = {
    titulo: 'Isaque e os poços',
    personagens: ['Isaque', 'Rebeca', 'Abimeleque'],
    cenas: [
      { ref: '26:1-11', texto: 'Houve fome e Isaque foi para Gerar. Deus lhe disse: “Não desça ao Egito; fique nesta terra e eu estarei com você.” Mas Isaque repetiu o erro do pai: disse que Rebeca era sua irmã. O rei Abimeleque descobriu a verdade e ordenou que ninguém fizesse mal ao casal.',
        cena: { fundo: 'dia', el: [luz(400, -40, { opacidade: .6 }), p('isaque', 330, 395), p('rebeca', 400, 395), p('farao', 580, 395, { cor: '#8a3a4a', espelho: true, bracos: 'aberto' }), fala('Ela é sua esposa!', 540, 230)] } },
      { ref: '26:12-22', texto: 'Isaque plantou e, no mesmo ano, colheu cem vezes mais: Deus o abençoou. Os vizinhos ficaram com inveja e entupiram os poços. Ele cavava um, brigavam; cavava outro, brigavam de novo. Isaque não revidou e seguia cavando, até que abriu um poço sem briga e o chamou de Reobote: “agora o Senhor nos deu espaço”.',
        cena: { fundo: 'deserto', el: [{ t: 'poco', x: 200, y: 395, opacidade: .5 }, { t: 'poco', x: 400, y: 395, opacidade: .7 }, { t: 'poco', x: 600, y: 395, anim: 'surgir' }, p('isaque', 680, 395, { bracos: 'cima', espelho: true }), { t: 'trigo', x: 120, y: 400, n: 9 }, { t: 'rotulo', texto: 'Reobote: espaço!', x: 20, y: 20 }] } },
      { ref: '26:23-35', texto: 'Em Berseba, Deus apareceu a Isaque de noite: “Não tenha medo, eu estou com você.” Isaque construiu um altar. Até Abimeleque veio pedir um acordo de paz, reconhecendo que Deus estava com Isaque.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 50, h: 220 }, { t: 'altar', x: 420, y: 390 }, p('isaque', 320, 395, { bracos: 'cima' }), fala('Não tenha medo,\neu estou com você.', 460, 160)] } },
    ],
    licao: 'Isaque escolheu a mansidão em vez da briga, e Deus abriu espaço para ele. Quem confia em Deus não precisa lutar por cada poço.',
    pergunta: 'Diante de uma injustiça, quando é sábio “cavar outro poço” em vez de brigar?',
    versiculo: '26:22',
  };

  C[27] = {
    titulo: 'Jacó engana o pai e recebe a bênção',
    personagens: ['Isaque', 'Rebeca', 'Jacó', 'Esaú'],
    cenas: [
      { ref: '27:1-17', texto: 'Isaque, velho e quase cego, pediu que Esaú caçasse e preparasse sua comida favorita para depois abençoá-lo. Rebeca ouviu e armou um plano: preparou a comida, vestiu Jacó com as roupas de Esaú e cobriu seus braços com pele de cabrito, para parecer peludo como o irmão.',
        cena: { fundo: 'interior', el: [p('rebeca', 330, 395, { bracos: 'frente' }), p('jaco', 430, 395, { cor: '#b8502a', espelho: true, cajado: false }), { t: 'ovelha', x: 600, y: 405, cor: '#6a5a4a' }, fala('Faça o que eu digo, filho.', 120, 240)] } },
      { ref: '27:18-29', texto: 'Jacó levou a comida ao pai e mentiu: “Sou Esaú, seu primogênito.” Isaque desconfiou: “A voz é de Jacó, mas as mãos são de Esaú.” Mesmo assim comeu e deu a bênção a Jacó: fartura, domínio e a promessa de ser bênção.',
        cena: { fundo: 'interior', el: [p('isaque', 300, 395, { velho: true, pose: 'ajoelhado', bracos: 'frente' }), p('jaco', 400, 395, { cor: '#b8502a', espelho: true, pose: 'ajoelhado', cajado: false }), { t: 'mesa', x: 400, y: 440, s: .6 },
          fala('A voz é de Jacó,\nmas as mãos são de Esaú…', 120, 180)] } },
      { ref: '27:30-46', texto: 'Logo depois, Esaú chegou com a caça. Quando descobriu o engano, chorou alto: “Abençoe a mim também, meu pai!” Furioso, jurou matar Jacó. Rebeca então mandou Jacó fugir para a casa de Labão, seu irmão, em Harã.',
        cena: { fundo: 'dia', el: [p('esau', 300, 395, { bracos: 'cima' }), p('jaco', 620, 395, { anim: 'andar' }), { t: 'tenda', x: 140, y: 382 }, fala('Abençoe a mim também!', 90, 240)] } },
    ],
    licao: 'Enganar para conseguir o que queremos sempre deixa feridas: aqui, uma família dividida. Ainda assim, Deus seguiria trabalhando com Jacó para transformá-lo.',
    pergunta: 'Você já tentou conseguir algo bom do jeito errado? Quais foram as consequências?',
    versiculo: '27:22',
  };

  C[28] = {
    titulo: 'A escada de Jacó',
    personagens: ['Jacó', 'Isaque', 'Esaú', 'Anjos'],
    cenas: [
      { ref: '28:1-9', texto: 'Isaque abençoou Jacó outra vez antes da viagem e o orientou a se casar com alguém da família de Labão. Jacó partiu sozinho, fugindo, sem saber o que o esperava.',
        cena: { fundo: 'deserto', el: [p('isaque', 250, 395, { velho: true, bracos: 'aberto' }), p('jaco', 450, 395, { anim: 'andar' }), { t: 'tenda', x: 120, y: 382 }] } },
      { ref: '28:10-15', veja: ['joao 1:51'], texto: 'Ao anoitecer, Jacó usou uma pedra como travesseiro e dormiu ao relento. Sonhou com uma escada que ia da terra até o céu, com anjos subindo e descendo. No alto estava o Senhor, que disse: “Eu sou o Deus de Abraão e de Isaque. Darei esta terra a você. Estou com você e o protegerei aonde quer que vá.”',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 70, h: 300 }, luz(470, -40), { t: 'escada', x: 470, y: 390 }, { t: 'anjo', x: 430, y: 250, s: .5, anim: 'subir' }, { t: 'anjo', x: 510, y: 170, s: .45, anim: 'subir', atraso: 2 },
          p('jaco', 240, 395, { pose: 'deitado', cajado: false }), { t: 'pedras', x: 190, y: 400, s: .35 }, fala('Estou com você!', 560, 120)] } },
      { ref: '28:16-22', texto: 'Jacó acordou assustado: “O Senhor está neste lugar, e eu não sabia!” Ergueu a pedra como um marco, derramou azeite sobre ela e chamou o lugar de Betel, “casa de Deus”. E prometeu seguir ao Senhor e devolver o dízimo de tudo o que recebesse.',
        cena: { fundo: 'aurora', el: [{ t: 'pedras', x: 430, y: 390, s: .6 }, p('jaco', 330, 395, { bracos: 'cima' }), { t: 'rotulo', texto: 'Betel: casa de Deus', x: 20, y: 20 }, fala('O Senhor está aqui\ne eu não sabia!', 460, 200)] } },
    ],
    licao: 'Deus encontra Jacó não quando ele merecia, mas quando estava sozinho e fugindo. Não há lugar longe demais para Deus.',
    pergunta: 'Em que momento difícil você percebeu, depois, que Deus estava presente?',
    versiculo: '28:15',
  };

  C[29] = {
    titulo: 'Jacó, Raquel e Lia',
    personagens: ['Jacó', 'Raquel', 'Lia', 'Labão'],
    cenas: [
      { ref: '29:1-14', texto: 'Jacó chegou a Harã e encontrou pastores junto a um poço. Logo apareceu Raquel, filha de Labão, com as ovelhas do pai. Jacó removeu sozinho a pedra pesada do poço, deu água ao rebanho, beijou Raquel e chorou de emoção: tinha encontrado a família.',
        cena: { fundo: 'dia', el: [{ t: 'poco', x: 400, y: 395 }, p('jaco', 300, 395, { bracos: 'aberto' }), p('raquel', 500, 395, { espelho: true, cajado: true }), { t: 'ovelha', x: 600, y: 405 }, { t: 'ovelha', x: 680, y: 410, s: .9 }, { t: 'coracao', x: 400, y: 260, anim: 'pulsar' }] } },
      { ref: '29:15-30', texto: 'Jacó se apaixonou por Raquel e trabalhou sete anos para poder se casar com ela, e os anos pareceram poucos dias de tanto amor. Mas na noite do casamento, Labão o enganou e lhe deu Lia, a irmã mais velha. O enganador foi enganado! Jacó trabalhou mais sete anos por Raquel.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 30, h: 160 }, { t: 'tenda', x: 620, y: 384 }, p('jaco', 300, 395, { bracos: 'aberto' }), p('lia', 400, 395, { veu: '#f2eee6' }), p('labao', 180, 395), fala('Por que me enganou?!', 330, 240), { t: 'rotulo', texto: '7 + 7 anos', x: 20, y: 20 }] } },
      { ref: '29:31-35', texto: 'Lia se sentia menos amada, mas Deus a viu e lhe deu filhos: Rúben, Simeão, Levi e Judá. Com o nascimento de Judá, ela disse: “Desta vez louvarei ao Senhor.” Da família de Judá viriam o rei Davi e, mais tarde, Jesus.',
        cena: { fundo: 'dia', el: [luz(400, -40, { opacidade: .6 }), p('lia', 380, 395, { bracos: 'cima' }), p('crianca', 270, 395, { cor: '#8a6a4a', s: .6 }), p('crianca', 320, 395, { cor: '#4a6a8a', s: .55 }), p('crianca', 450, 395, { cor: '#6a8a4a', s: .5 }), { t: 'bebe', x: 520, y: 400 }, fala('Agora louvarei ao Senhor!', 420, 220)] } },
    ],
    licao: 'Jacó experimentou o próprio veneno quando foi enganado. E Deus mostrou seu cuidado por Lia, a menos amada: Ele vê quem se sente rejeitado.',
    pergunta: 'Lia passou da busca por aprovação para o louvor. O que muda quando deixamos de buscar a aprovação dos outros?',
    versiculo: '29:35',
  };

  C[30] = {
    titulo: 'A família de Jacó cresce',
    personagens: ['Jacó', 'Raquel', 'Lia', 'José', 'Labão'],
    cenas: [
      { ref: '30:1-21', texto: 'Raquel sofria por não ter filhos e tinha ciúmes da irmã. As duas competiam e até entregaram suas servas a Jacó para terem mais filhos. Assim nasceram Dã, Naftali, Gade, Aser, Issacar, Zebulom e uma filha, Diná.',
        cena: { fundo: 'dia', el: [{ t: 'tenda', x: 160, y: 382 }, { t: 'tenda', x: 640, y: 382, cor: '#6a8a6a' }, p('raquel', 300, 395, { triste: true }), p('lia', 500, 395, { espelho: true }), p('crianca', 560, 395, { cor: '#8a6a4a', s: .55 }), p('crianca', 600, 395, { cor: '#4a6a8a', s: .5 })] } },
      { ref: '30:22-24', texto: 'Então Deus se lembrou de Raquel, ouviu sua oração e ela ficou grávida. Nasceu José! Raquel disse: “Deus tirou a minha vergonha.”',
        cena: { fundo: 'dia', el: [luz(400, -40), p('raquel', 380, 395, { bracos: 'frente' }), { t: 'bebe', x: 420, y: 335 }, p('jaco', 480, 395, { espelho: true, bracos: 'cima' }), { t: 'coracao', x: 400, y: 230, anim: 'pulsar' }, fala('José!', 520, 230)] } },
      { ref: '30:25-43', texto: 'Jacó quis voltar para casa, mas Labão pediu que ficasse, pois via que Deus o abençoava por causa de Jacó. Combinaram que os animais malhados e listrados seriam o salário de Jacó. Labão tentou trapacear, mas Deus fez o rebanho de Jacó crescer muito.',
        cena: { fundo: 'dia', el: [{ t: 'ovelha', x: 180, y: 400, cor: '#e8d8c0' }, { t: 'ovelha', x: 250, y: 405, cor: '#d0b090' }, { t: 'ovelha', x: 320, y: 400 }, { t: 'ovelha', x: 390, y: 410, cor: '#b89a7a' }, { t: 'ovelha', x: 460, y: 402, cor: '#e8d8c0' },
          p('jaco', 560, 395, { espelho: true }), p('labao', 660, 395, { espelho: true, triste: true })] } },
    ],
    licao: 'Comparação e competição trazem tristeza, mesmo dentro de casa. Deus ouve as orações e abençoa, apesar das famílias complicadas.',
    pergunta: 'Onde a comparação com outras pessoas tem roubado sua alegria?',
    versiculo: '30:22',
  };

  C[31] = {
    titulo: 'Jacó foge de Labão',
    personagens: ['Jacó', 'Raquel', 'Lia', 'Labão'],
    cenas: [
      { ref: '31:1-21', texto: 'Os filhos de Labão começaram a reclamar, e Labão já não tratava Jacó como antes. Deus disse: “Volte para a terra de seus pais, e eu estarei com você.” Jacó reuniu a família e os rebanhos e partiu sem avisar. Raquel levou escondidos os ídolos do pai.',
        cena: { fundo: 'aurora', el: [{ t: 'camelo', x: 200, y: 400, anim: 'andar' }, { t: 'camelo', x: 320, y: 405, anim: 'andar', s: .9 }, p('raquel', 420, 395, { anim: 'andar' }), p('lia', 490, 395, { anim: 'andar' }), p('jaco', 570, 395, { anim: 'andar' }), { t: 'ovelha', x: 670, y: 405, anim: 'andar' }] } },
      { ref: '31:22-42', texto: 'Labão perseguiu Jacó por sete dias. Mas Deus o avisou num sonho para não fazer mal a Jacó. Quando o alcançou, Labão procurou os ídolos e não achou, porque Raquel estava sentada sobre eles. Jacó desabafou: “Trabalhei vinte anos para você, e você mudou meu salário dez vezes!”',
        cena: { fundo: 'montanha', el: [p('labao', 520, 400, { espelho: true, bracos: 'aberto' }), p('jaco', 320, 400, { bracos: 'aberto' }), { t: 'camelo', x: 160, y: 405 }, p('raquel', 170, 340, { s: .7 }), fala('20 anos de trabalho!', 120, 220)] } },
      { ref: '31:43-55', texto: 'No fim, os dois fizeram um acordo de paz e empilharam pedras como testemunha. Chamaram o lugar de Mispá, dizendo: “Que o Senhor vigie entre mim e você quando estivermos longe um do outro.” Labão beijou as filhas e netos e voltou para casa.',
        cena: { fundo: 'montanha', el: [{ t: 'pedras', x: 400, y: 400, anim: 'surgir' }, p('jaco', 290, 400, { bracos: 'frente' }), p('labao', 510, 400, { espelho: true, bracos: 'frente' }), { t: 'rotulo', texto: 'Mispá', x: 20, y: 20 }] } },
    ],
    licao: 'Deus protegeu Jacó mesmo de quem queria prejudicá-lo. Conflitos antigos podem terminar em acordos de paz quando Deus é colocado como testemunha.',
    pergunta: 'Há algum conflito na sua vida que precisa de um “acordo de paz” com Deus como testemunha?',
    versiculo: '31:49',
  };

  C[32] = {
    titulo: 'Jacó luta com Deus',
    personagens: ['Jacó', 'Anjos', 'Um homem misterioso (Deus)'],
    cenas: [
      { ref: '32:1-12', texto: 'A caminho de casa, Jacó soube que Esaú vinha ao seu encontro com 400 homens. Ficou apavorado. Dividiu o acampamento em dois grupos e orou com sinceridade: “Não sou digno de toda a bondade que me tens mostrado. Livra-me do meu irmão!”',
        cena: { fundo: 'por-do-sol', el: [p('jaco', 400, 395, { pose: 'ajoelhado', bracos: 'orando', triste: true }), { t: 'tenda', x: 160, y: 385 }, { t: 'tenda', x: 640, y: 385, cor: '#6a5a8a' }, fala('Não sou digno…\nlivra-me, Senhor!', 440, 200)] } },
      { ref: '32:13-23', texto: 'Jacó enviou à frente muitos presentes para Esaú: cabras, ovelhas, camelos, vacas e jumentos, em grupos separados, esperando acalmar o irmão. De noite, fez a família atravessar o rio Jaboque e ficou sozinho.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 40, h: 180 }, { t: 'rio', x: 400, y: 410 }, { t: 'camelo', x: 560, y: 395, anim: 'andar' }, { t: 'ovelha', x: 660, y: 400, anim: 'andar' }, p('jaco', 260, 395)] } },
      { ref: '32:24-32', texto: 'Então um homem lutou com Jacó até o amanhecer. Ele tocou a coxa de Jacó e a deslocou, mas Jacó não soltava: “Não te deixarei ir se não me abençoares.” O homem mudou seu nome: “Você não se chamará mais Jacó, mas Israel, pois lutou com Deus e com os homens e venceu.” Jacó chamou o lugar de Peniel: “vi Deus face a face”. Saiu dali mancando.',
        cena: { fundo: 'aurora', el: [luz(400, -40, { opacidade: .6 }), p('jaco', 360, 395, { bracos: 'frente' }), { t: 'anjo', x: 450, y: 395, bracos: 'frente' }, fala('Seu nome agora é Israel!', 480, 160), { t: 'rotulo', texto: 'Peniel', x: 20, y: 20 }] } },
    ],
    licao: 'Jacó, o esperto que sempre lutou para vencer, agora agarra Deus e pede bênção. Às vezes Deus nos “quebra” para nos transformar.',
    pergunta: 'Por que você acha que Jacó saiu mancando? Que “marca” de um encontro com Deus você carrega?',
    versiculo: '32:26',
  };

  C[33] = {
    titulo: 'O reencontro com Esaú',
    personagens: ['Jacó', 'Esaú', 'A família de Jacó'],
    cenas: [
      { ref: '33:1-4', texto: 'Jacó viu Esaú chegando com os 400 homens. Foi à frente da família e se curvou sete vezes até o chão. Mas Esaú correu ao seu encontro, o abraçou, beijou, e os dois choraram juntos. Vinte anos de raiva viraram perdão.',
        cena: { fundo: 'dia', el: [p('jaco', 370, 395, { bracos: 'aberto' }), p('esau', 440, 395, { espelho: true, bracos: 'aberto' }), { t: 'coracao', x: 405, y: 240, anim: 'pulsar' }, p('irmao4', 620, 395, { espelho: true, cajado: true }), p('irmao1', 690, 395, { espelho: true, cajado: true }), p('raquel', 180, 395), p('lia', 110, 395)] } },
      { ref: '33:5-11', texto: 'Esaú perguntou sobre as mulheres e crianças, e Jacó apresentou a família. No início Esaú não quis aceitar os presentes: “Eu tenho muito, meu irmão.” Jacó insistiu: “Ver o seu rosto é como ver o rosto de Deus, pois você me recebeu tão bem.”',
        cena: { fundo: 'dia', el: [p('esau', 520, 395, { espelho: true, bracos: 'frente' }), p('jaco', 360, 395, { bracos: 'frente' }), p('crianca', 260, 395, { cor: '#8a6a4a', s: .6 }), p('jose', 300, 395, { s: .5, listras: false, cor: '#c8a050' }), { t: 'ovelha', x: 440, y: 405 }, fala('Eu tenho muito,\nmeu irmão.', 540, 220)] } },
      { ref: '33:12-20', texto: 'Os irmãos seguiram caminhos separados, mas em paz. Jacó foi até Siquém, em Canaã, comprou um terreno e construiu um altar chamado “El-Elohe-Israel”, que quer dizer “Deus, o Deus de Israel”.',
        cena: { fundo: 'dia', el: [{ t: 'altar', x: 400, y: 390 }, p('jaco', 300, 395, { bracos: 'cima' }), { t: 'tenda', x: 600, y: 382 }, luz(400, -40, { opacidade: .7 })] } },
    ],
    licao: 'O perdão é possível, mesmo depois de muitos anos e de grandes feridas. Deus preparou o coração dos dois irmãos para a reconciliação.',
    pergunta: 'Existe alguém com quem você precisa se reconciliar? Qual seria o primeiro passo?',
    versiculo: '33:4',
  };

  C[34] = {
    titulo: 'A tragédia de Diná',
    personagens: ['Diná', 'Siquém', 'Hamor', 'Simeão e Levi', 'Jacó'],
    cenas: [
      { ref: '34:1-12', texto: 'Diná, filha de Jacó, saiu para visitar as moças da região. Siquém, filho do príncipe da cidade, a tomou à força e a desonrou. Depois disse que a amava e pediu para se casar com ela. Os irmãos de Diná ficaram indignados com a violência.',
        cena: { fundo: 'dia', el: [{ t: 'cidade', x: 560, y: 370, w: 320 }, p('eva', 300, 395, { cor: '#b85a7a', triste: true, s: .9 }), p('irmao1', 140, 395, { triste: true }), p('irmao2', 200, 395, { triste: true })] } },
      { ref: '34:13-31', texto: 'Os irmãos fingiram aceitar um acordo, desde que os homens da cidade fossem circuncidados. Mas Simeão e Levi atacaram a cidade enquanto os homens se recuperavam e mataram todos eles. Jacó os repreendeu: a vingança trouxe vergonha e perigo para toda a família.',
        cena: { fundo: 'fogo', el: [{ t: 'cidade', x: 500, y: 375, w: 420, cor: '#2a1a14' }, { t: 'fogo', x: 450, y: 320 }, { t: 'fogo', x: 600, y: 310 }, p('jaco', 220, 395, { velho: true, bracos: 'aberto' }), fala('Vocês trouxeram\ndesgraça sobre mim!', 60, 200)] } },
    ],
    licao: 'A Bíblia não esconde as tragédias humanas. A violência contra Diná foi grave, e a vingança desmedida também. A justiça de verdade não se faz com engano e massacre.',
    pergunta: 'Por que a vingança costuma gerar ainda mais dor? Como buscar justiça sem cometer novos males?',
    versiculo: '34:30',
  };

  C[35] = {
    titulo: 'De volta a Betel',
    personagens: ['Jacó (Israel)', 'Raquel', 'Benjamim', 'Isaque', 'Esaú'],
    cenas: [
      { ref: '35:1-8', texto: 'Deus mandou Jacó voltar a Betel, onde tinha sonhado com a escada. Antes de ir, Jacó pediu à família: “Livrem-se dos ídolos, purifiquem-se e troquem de roupa.” Eles enterraram os ídolos debaixo de uma árvore e foram adorar ao Deus que respondeu a Jacó na hora da angústia.',
        cena: { fundo: 'dia', el: [{ t: 'arvore', x: 200, y: 365, s: 1.3 }, { t: 'pedras', x: 200, y: 400, s: .4 }, p('jaco', 360, 395, { bracos: 'aberto' }), p('raquel', 450, 395), p('lia', 520, 395), p('irmao1', 590, 395, { s: .85 }), fala('Joguem fora os ídolos!', 380, 230)] } },
      { ref: '35:9-15', texto: 'Em Betel, Deus apareceu de novo, confirmou o nome Israel e repetiu a promessa feita a Abraão e Isaque: “Uma nação e muitas nações virão de você, e reis sairão de você.”',
        cena: { fundo: 'dia', el: [luz(400, -40), { t: 'pedras', x: 470, y: 395, s: .6 }, p('jaco', 360, 395, { pose: 'ajoelhado', bracos: 'orando' }), fala('Seu nome é Israel.\nReis virão de você!', 430, 140)] } },
      { ref: '35:16-29', texto: 'No caminho para Belém, Raquel deu à luz seu segundo filho, mas morreu no parto. Ela o chamou de Benoni, “filho da minha dor”, mas Jacó o chamou de Benjamim, “filho da minha mão direita”. Depois, Isaque morreu bem idoso, e Esaú e Jacó o sepultaram juntos.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'pedras', x: 560, y: 400 }, p('jaco', 380, 395, { triste: true }), { t: 'bebe', x: 420, y: 335 }, { t: 'rotulo', texto: 'Benjamim', x: 20, y: 20 }] } },
    ],
    licao: 'Voltar a Deus envolve abandonar o que ocupa o lugar dele. Na mesma estrada, há promessa renovada e luto: a vida com Deus inclui alegrias e dores.',
    pergunta: 'Que “ídolos” (coisas que ocupam o lugar de Deus) você precisa enterrar hoje?',
    versiculo: '35:3',
  };

  C[36] = {
    titulo: 'Os descendentes de Esaú',
    personagens: ['Esaú (Edom)', 'Os chefes de Edom'],
    cenas: [
      { ref: '36:1-8', texto: 'Esaú também ficou muito rico. Como a terra não comportava os rebanhos dele e de Jacó, Esaú se mudou para as montanhas de Seir. Ele passou a ser chamado de Edom, “vermelho”, lembrando o ensopado e seus cabelos ruivos.',
        cena: { fundo: 'montanha', el: [p('esau', 300, 400, { anim: 'andar', velho: false }), { t: 'camelo', x: 430, y: 405, anim: 'andar' }, { t: 'ovelha', x: 530, y: 410, anim: 'andar' }, { t: 'rotulo', texto: 'Edom', x: 20, y: 20 }] } },
      { ref: '36:9-43', texto: 'O capítulo lista os filhos, netos, chefes e reis de Edom. O povo edomita viveria ao lado de Israel, às vezes como vizinho, muitas vezes como inimigo. Deus também cumpriu a palavra dada sobre Esaú: ele se tornou uma nação.',
        cena: { fundo: 'montanha', el: [{ t: 'cidade', x: 560, y: 375, w: 300, cor: '#b06a4a' }, p('esau', 200, 400, { coroa: true, velho: true }), p('irmao1', 280, 400, { s: .85 }), p('irmao3', 340, 400, { s: .85 })] } },
    ],
    licao: 'Deus cumpre todas as suas palavras, até as que parecem secundárias. A história de Esaú continua, e nenhuma família é esquecida por Ele.',
    pergunta: 'Por que você acha que a Bíblia registra também a família de Esaú?',
    versiculo: '36:8',
  };

  C[37] = {
    titulo: 'José, o sonhador',
    personagens: ['José', 'Jacó', 'Os irmãos de José', 'Rúben', 'Judá'],
    cenas: [
      { ref: '37:1-4', texto: 'José tinha dezessete anos e era o filho preferido de Jacó. O pai lhe deu uma túnica colorida e especial. Os irmãos perceberam o favoritismo, ficaram com ciúmes e nem conseguiam falar com ele de forma amigável.',
        cena: { fundo: 'dia', el: [p('jaco', 260, 395, { velho: true, bracos: 'frente' }), p('jose', 360, 395, { bracos: 'aberto' }), ...irmaos(480, 395, { espelho: true, triste: true })] } },
      { ref: '37:5-11', texto: 'José teve dois sonhos e contou à família. No primeiro, os feixes de trigo dos irmãos se curvavam diante do feixe dele. No segundo, o sol, a lua e onze estrelas se curvavam para ele. Os irmãos o odiaram ainda mais, mas Jacó guardou aquilo no coração.',
        cena: { fundo: 'noite', el: [{ t: 'sol', x: 560, y: 110, s: .7 }, { t: 'lua', x: 680, y: 90 }, { t: 'estrelas', x: 430, y: 140, w: 330, h: 80, n: 11, semente: 37 },
          { t: 'feixe', x: 330, y: 390 }, { t: 'feixe', x: 230, y: 395, curvado: true }, { t: 'feixe', x: 430, y: 395, curvado: true, espelho: true }, { t: 'feixe', x: 170, y: 400, curvado: true },
          p('jose', 100, 395, { pose: 'deitado' }), { t: 'sonho', x: 140, y: 340 }] } },
      { ref: '37:12-28', texto: 'Jacó mandou José ver os irmãos no campo. Quando o viram de longe, disseram: “Lá vem o sonhador! Vamos matá-lo.” Rúben os convenceu a apenas jogá-lo num poço seco. Tiraram sua túnica e o jogaram lá. Depois, por ideia de Judá, o venderam por vinte moedas de prata a mercadores que iam para o Egito.',
        cena: { fundo: 'deserto', el: [{ t: 'poco', x: 280, y: 400 }, p('jose', 280, 370, { s: .7, listras: false, bracos: 'cima', triste: true }), { t: 'camelo', x: 620, y: 400 }, { t: 'camelo', x: 720, y: 405, s: .9 },
          p('juda', 420, 395, { bracos: 'frente' }), p('irmao4', 500, 395, { espelho: true }), { t: 'moedas', x: 460, y: 405 }, fala('Vamos vendê-lo!', 320, 240)] } },
      { ref: '37:29-36', texto: 'Os irmãos mancharam a túnica com sangue de um cabrito e a levaram ao pai. Jacó pensou que um animal tinha devorado José e chorou sem consolo: “Vou descer à sepultura chorando por meu filho.” Enquanto isso, no Egito, José foi vendido a Potifar, oficial do faraó.',
        cena: { fundo: 'por-do-sol', el: [p('jaco', 400, 395, { velho: true, bracos: 'rosto', triste: true }), { t: 'tunica', x: 280, y: 400, s: .8 }, p('irmao1', 180, 395, { triste: true }), p('irmao2', 560, 395, { espelho: true, triste: true })] } },
    ],
    licao: 'Favoritismo, inveja e ódio destruíram a família de Jacó. Mas, mesmo quando tudo parece perdido, Deus está escrevendo uma história maior que ainda não conseguimos ver.',
    pergunta: 'O ciúme levou os irmãos a fazer algo terrível. Como lidar com a inveja antes que ela cresça?',
    versiculo: '37:19',
  };

  C[38] = {
    titulo: 'Judá e Tamar',
    personagens: ['Judá', 'Tamar', 'Perez e Zerá'],
    cenas: [
      { ref: '38:1-11', texto: 'Judá se afastou dos irmãos e formou família em Canaã. Seu filho mais velho se casou com Tamar, mas morreu, e depois o segundo filho também. Pela lei da época, Tamar deveria se casar com o filho mais novo, mas Judá, com medo, a mandou de volta para a casa do pai e não cumpriu a promessa.',
        cena: { fundo: 'dia', el: [p('juda', 320, 395, { bracos: 'aberto' }), p('sara', 440, 395, { veu: '#6a5a8a', cor: '#4a3a6a', triste: true, espelho: true }), { t: 'tenda', x: 620, y: 382 }] } },
      { ref: '38:12-26', texto: 'Tempos depois, Tamar se disfarçou com um véu e, sem ser reconhecida, ficou grávida de Judá, que lhe deixou como garantia seu selo, cordão e cajado. Quando Judá soube que ela estava grávida, quis puni-la. Mas Tamar mostrou os objetos. Judá reconheceu: “Ela é mais justa do que eu.”',
        cena: { fundo: 'dia', el: [p('juda', 330, 395, { bracos: 'rosto', triste: true }), p('sara', 460, 395, { veu: '#6a5a8a', cor: '#4a3a6a', espelho: true, bracos: 'frente', cajado: true }), fala('Ela é mais justa\ndo que eu.', 120, 220)] } },
      { ref: '38:27-30', veja: ['mateus 1:3'], texto: 'Tamar teve gêmeos: Perez e Zerá. Perez se tornaria antepassado do rei Davi e, muitos séculos depois, de Jesus. Tamar aparece na genealogia de Jesus em Mateus 1. Deus age até em histórias complicadas.',
        cena: { fundo: 'dia', el: [luz(400, -40, { opacidade: .6 }), p('sara', 400, 395, { veu: '#6a5a8a', cor: '#4a3a6a' }), { t: 'bebe', x: 360, y: 335 }, { t: 'bebe', x: 440, y: 335 }, { t: 'rotulo', texto: 'Perez e Zerá', x: 20, y: 20 }] } },
    ],
    licao: 'A Bíblia mostra gente real, com erros reais. Judá começa a mudar quando admite sua culpa. E Deus inclui pessoas inesperadas na linhagem do Messias.',
    pergunta: 'Por que é tão importante reconhecer “ele/ela é mais justo do que eu” quando erramos?',
    versiculo: '38:26',
  };

  C[39] = {
    titulo: 'José na casa de Potifar',
    personagens: ['José', 'Potifar', 'A esposa de Potifar'],
    cenas: [
      { ref: '39:1-6', texto: 'No Egito, José foi comprado por Potifar, capitão da guarda do faraó. O Senhor estava com José, e tudo o que ele fazia prosperava. Potifar viu isso e colocou José como administrador de toda a sua casa.',
        cena: { fundo: 'egito', el: [{ t: 'palacio', x: 560, y: 360, s: .6 }, p('farao', 470, 380, { coroa: false, cor: '#c8a040', espelho: true, bracos: 'frente' }), p('joseEg', 330, 390, { bracos: 'frente' }), { t: 'saco', x: 230, y: 395 }, { t: 'moedas', x: 180, y: 395 }, luz(330, -40, { opacidade: .5 })] } },
      { ref: '39:7-18', texto: 'José era bonito, e a esposa de Potifar insistia, dia após dia, para que ele se deitasse com ela. José recusava: “Como eu faria algo tão errado e pecaria contra Deus?” Um dia ela o agarrou pela roupa, e José fugiu, deixando a roupa nas mãos dela. Ela mentiu e o acusou falsamente.',
        cena: { fundo: 'interior', el: [p('sara', 300, 395, { veu: '#d8b040', cor: '#a0302a', bracos: 'frente' }), p('joseEg', 500, 395, { cor: '#d8c8a0', anim: 'andar' }), fala('Não posso pecar\ncontra Deus!', 520, 230)] } },
      { ref: '39:19-23', texto: 'Potifar ficou furioso e mandou José para a prisão do rei. Mas mesmo ali o Senhor estava com ele, mostrando-lhe bondade. O carcereiro confiou tudo a José, porque Deus fazia prosperar o que ele fazia.',
        cena: { fundo: 'prisao', el: [{ t: 'grades', x: 400, y: 220 }, luz(400, 200, { r: 260, nucleo: 50, opacidade: .5 }), p('joseEg', 360, 400, { cor: '#c8b890' }), p('irmao4', 500, 400, { cor: '#5a5a5a', espelho: true, bracos: 'frente' })] } },
    ],
    licao: 'A presença de Deus não depende do lugar: estava com José na casa de Potifar e na prisão. Ser fiel às vezes custa caro, mas Deus honra quem foge do pecado.',
    pergunta: 'José fugiu da tentação. Que tentações hoje pedem que a gente simplesmente “saia correndo”?',
    versiculo: '39:2',
  };

  C[40] = {
    titulo: 'Os sonhos do copeiro e do padeiro',
    personagens: ['José', 'O copeiro do faraó', 'O padeiro do faraó'],
    cenas: [
      { ref: '40:1-8', texto: 'Dois oficiais do faraó foram presos junto com José: o chefe dos copeiros e o chefe dos padeiros. Certa noite, os dois tiveram sonhos estranhos e acordaram preocupados. José perguntou: “Por que estão tristes? As interpretações pertencem a Deus. Contem-me.”',
        cena: { fundo: 'prisao', el: [{ t: 'grades', x: 400, y: 200 }, p('irmao2', 260, 400, { cor: '#6a8aa0', triste: true }), p('irmao3', 540, 400, { cor: '#c8a070', triste: true, espelho: true }), p('joseEg', 400, 400, { cor: '#c8b890', bracos: 'aberto' }), fala('A interpretação\npertence a Deus.', 420, 120)] } },
      { ref: '40:9-15', texto: 'O copeiro sonhou com uma videira de três ramos que brotou, deu uvas, e ele espremeu as uvas no copo do faraó. José explicou: “Em três dias, você voltará ao seu cargo.” E pediu: “Quando estiver bem, lembre-se de mim.”',
        cena: { fundo: 'prisao', el: [{ t: 'videira', x: 220, y: 400 }, { t: 'taca', x: 300, y: 400 }, p('irmao2', 380, 400, { cor: '#6a8aa0', bracos: 'cima' }), p('joseEg', 540, 400, { cor: '#c8b890', espelho: true }), { t: 'rotulo', texto: '3 dias: liberdade', x: 20, y: 20 }] } },
      { ref: '40:16-23', texto: 'O padeiro sonhou com três cestos de pão na cabeça, e as aves comiam dos cestos. A notícia era triste: em três dias ele seria executado. Tudo aconteceu como José disse. Mas o copeiro, livre, se esqueceu de José.',
        cena: { fundo: 'prisao', el: [p('irmao3', 300, 400, { cor: '#c8a070', triste: true }), { t: 'cesto', x: 300, y: 300 }, { t: 'passaro', x: 300, y: 250, anim: 'voar' }, { t: 'passaro', x: 360, y: 230, s: .8, anim: 'voar', atraso: 1 }, p('joseEg', 520, 400, { cor: '#c8b890', espelho: true, triste: true }), fala('Ele se esqueceu de mim…', 480, 240)] } },
    ],
    licao: 'José continuou servindo e ajudando os outros mesmo injustiçado. Pessoas podem nos esquecer, mas Deus nunca esquece.',
    pergunta: 'Como continuar fazendo o bem quando ninguém parece reconhecer?',
    versiculo: '40:8',
  };

  C[41] = {
    titulo: 'José interpreta os sonhos do faraó',
    personagens: ['Faraó', 'José', 'O copeiro', 'Azenate', 'Manassés e Efraim'],
    cenas: [
      { ref: '41:1-8', texto: 'Dois anos depois, o faraó teve dois sonhos. No primeiro, sete vacas gordas saíam do rio Nilo e depois sete vacas magras e feias as devoravam. No segundo, sete espigas cheias eram engolidas por sete espigas secas. Nenhum sábio do Egito soube explicar.',
        cena: { fundo: 'egito', el: [{ t: 'vaca', x: 150, y: 380 }, { t: 'vaca', x: 250, y: 385, s: .9 }, { t: 'vaca', x: 470, y: 380, magra: true, espelho: true }, { t: 'vaca', x: 570, y: 385, magra: true, espelho: true, s: .9 },
          { t: 'trigo', x: 690, y: 370, n: 4 }, { t: 'trigo', x: 740, y: 372, n: 3, seco: true }, p('farao', 380, 250, { pose: 'deitado', s: .7 }), { t: 'sonho', x: 400, y: 200 }] } },
      { ref: '41:9-32', texto: 'O copeiro finalmente se lembrou de José! Tiraram José da prisão, ele se barbeou, trocou de roupa e foi levado ao faraó. José disse: “Não sou eu quem interpreta, é Deus.” Os sonhos significavam sete anos de muita fartura, seguidos de sete anos de fome terrível.',
        cena: { fundo: 'interior', el: [{ t: 'trono', x: 560, y: 395 }, p('farao', 560, 370, { espelho: true }), p('joseEg', 340, 395, { bracos: 'aberto' }), fala('Não sou eu, é Deus\nquem dará a resposta.', 100, 200), { t: 'rotulo', texto: '7 anos de fartura + 7 de fome', x: 20, y: 20 }] } },
      { ref: '41:33-45', texto: 'José aconselhou guardar parte das colheitas nos anos bons. O faraó disse: “Quem seria melhor que este homem, em quem está o Espírito de Deus?” E colocou José como governador de todo o Egito, abaixo apenas dele. Deu-lhe seu anel, roupas finas, um colar de ouro e uma carruagem.',
        cena: { fundo: 'egito', el: [{ t: 'piramide', x: 650, y: 360 }, { t: 'carroca', x: 360, y: 395 }, p('joseEg', 350, 345, { coroa: true, bracos: 'aberto' }), ...irmaos(80, 395, { cor: '#f0e6d0', pele: PELE.c, bracos: 'cima', s: .8, barba: false }).slice(0, 3)] } },
      { ref: '41:46-57', texto: 'José tinha trinta anos quando passou a servir ao faraó. Nos sete anos de fartura, José encheu os armazéns com tanto trigo que parou de contar. Ele se casou e teve dois filhos: Manassés (“Deus me fez esquecer o sofrimento”) e Efraim (“Deus me fez prosperar”). Depois veio a fome, e o mundo inteiro vinha ao Egito comprar comida de José.',
        cena: { fundo: 'egito', el: [{ t: 'saco', x: 160, y: 400 }, { t: 'saco', x: 210, y: 400 }, { t: 'saco', x: 185, y: 360 }, { t: 'saco', x: 600, y: 400 }, { t: 'saco', x: 650, y: 400 }, { t: 'trigo', x: 400, y: 390, n: 11 },
          p('joseEg', 470, 395, { coroa: true }), p('crianca', 530, 395, { cor: '#f0e6d0', s: .55 }), p('crianca', 565, 395, { cor: '#f0e6d0', s: .5 })] } },
    ],
    licao: 'Do poço à prisão e da prisão ao palácio: no tempo certo, Deus exaltou José. Os anos difíceis o prepararam para salvar muitas vidas.',
    pergunta: 'Que “anos de espera” na sua vida podem estar sendo preparação para algo maior?',
    versiculo: '41:52',
  };

  C[42] = {
    titulo: 'Os irmãos de José vão ao Egito',
    personagens: ['José', 'Jacó', 'Os dez irmãos', 'Simeão', 'Rúben'],
    cenas: [
      { ref: '42:1-9', texto: 'A fome chegou também a Canaã. Jacó mandou dez filhos ao Egito comprar trigo, mas segurou Benjamim em casa. Diante do governador, os irmãos se curvaram até o chão, sem saber que era José. José os reconheceu e lembrou dos seus sonhos.',
        cena: { fundo: 'interior', el: [{ t: 'trono', x: 600, y: 395 }, p('joseEg', 600, 370, { coroa: true, espelho: true }), ...irmaos(150, 400, { pose: 'ajoelhado', bracos: 'orando' }), { t: 'sonho', x: 560, y: 220 }, { t: 'feixe', x: 600, y: 210, s: .5 }] } },
      { ref: '42:10-24', texto: 'Para testá-los, José falou duramente: “Vocês são espiões!” Eles explicaram que eram doze irmãos, um tinha “desaparecido” e o mais novo estava com o pai. Os irmãos disseram entre si: “Estamos sendo castigados pelo que fizemos ao nosso irmão.” José se afastou e chorou. Ficou com Simeão como refém até trazerem Benjamim.',
        cena: { fundo: 'interior', el: [p('joseEg', 620, 395, { coroa: true, espelho: true, bracos: 'aberto' }), ...irmaos(140, 395, { triste: true }), fala('Vocês são espiões!', 540, 220), fala('É culpa nossa pelo\nque fizemos a José…', 100, 200)] } },
      { ref: '42:25-38', texto: 'José mandou encher os sacos de trigo e, às escondidas, devolver o dinheiro de cada um. No caminho, encontraram o dinheiro e ficaram com medo. Em casa, contaram tudo a Jacó, que se recusou a deixar Benjamim ir: “José já não existe, Simeão também não, e agora querem levar Benjamim?”',
        cena: { fundo: 'deserto', el: [{ t: 'saco', x: 300, y: 400, moedas: true }, { t: 'saco', x: 360, y: 400, moedas: true }, p('jaco', 520, 395, { velho: true, bracos: 'rosto', triste: true }), p('benjamim', 600, 395, { s: .85 }), p('irmao1', 220, 395, { bracos: 'aberto' })] } },
    ],
    licao: 'A consciência dos irmãos despertou depois de mais de vinte anos. Deus estava usando aquele teste para trabalhar no coração deles.',
    pergunta: 'Por que você acha que José não se revelou logo de cara?',
    versiculo: '42:21',
  };

  C[43] = {
    titulo: 'A segunda viagem: com Benjamim',
    personagens: ['Jacó', 'Judá', 'Benjamim', 'José', 'Simeão'],
    cenas: [
      { ref: '43:1-14', texto: 'A comida acabou de novo. Judá se ofereceu como garantia: “Eu me responsabilizo por Benjamim. Se não o trouxer de volta, a culpa será minha para sempre.” Jacó enfim aceitou, mandou presentes e o dobro do dinheiro, e orou: “Que o Deus Todo-Poderoso lhes conceda misericórdia.”',
        cena: { fundo: 'dia', el: [p('jaco', 300, 395, { velho: true, bracos: 'cima' }), p('juda', 420, 395, { bracos: 'frente' }), p('benjamim', 500, 395), { t: 'saco', x: 600, y: 400, moedas: true }, fala('Eu me responsabilizo\npor ele.', 440, 230)] } },
      { ref: '43:15-30', texto: 'No Egito, foram levados à casa de José e ficaram com medo de serem presos. Mas o administrador os tranquilizou e trouxe Simeão de volta. Quando José viu Benjamim, seu irmão de mãe, ficou tão emocionado que saiu correndo para chorar no seu quarto.',
        cena: { fundo: 'interior', el: [p('joseEg', 640, 395, { coroa: true, espelho: true, bracos: 'rosto' }), p('benjamim', 480, 395), p('juda', 380, 395), p('irmao2', 300, 395), p('irmao3', 220, 395)] } },
      { ref: '43:31-34', texto: 'José lavou o rosto, voltou e mandou servir um banquete. Os irmãos foram colocados à mesa em ordem de idade, do mais velho ao mais novo, e ficaram espantados. A porção de Benjamim era cinco vezes maior que a dos outros. Comeram e se alegraram juntos.',
        cena: { fundo: 'interior', el: [{ t: 'mesa', x: 400, y: 410, s: 1.6 }, p('irmao1', 160, 395, { s: .85 }), p('irmao2', 230, 395, { s: .85 }), p('juda', 300, 395, { s: .85 }), p('benjamim', 500, 395, { s: .85, bracos: 'cima' }), p('joseEg', 660, 395, { coroa: true, espelho: true })] } },
    ],
    licao: 'Judá, que antes vendeu um irmão, agora se oferece para proteger outro. Deus transforma o coração das pessoas com o tempo.',
    pergunta: 'Você percebe mudanças no seu caráter ao longo dos anos? Quais?',
    versiculo: '43:14',
  };

  C[44] = {
    titulo: 'A taça de prata',
    personagens: ['José', 'Benjamim', 'Judá', 'Os irmãos'],
    cenas: [
      { ref: '44:1-13', texto: 'José fez um último teste. Mandou colocar sua taça de prata no saco de Benjamim. Quando os irmãos partiram, o administrador os alcançou e revistou os sacos. A taça estava com Benjamim! Desesperados, rasgaram as roupas e voltaram todos para a cidade.',
        cena: { fundo: 'deserto', el: [{ t: 'saco', x: 400, y: 400 }, { t: 'taca', x: 400, y: 350, s: 1.4, anim: 'pulsar' }, p('benjamim', 480, 395, { bracos: 'aberto', triste: true }), ...irmaos(140, 395, { bracos: 'rosto', s: .8 }).slice(0, 4)] } },
      { ref: '44:14-34', texto: 'Diante de José, Judá fez um discurso emocionante. Contou o amor do pai por Benjamim e disse que Jacó morreria de tristeza se o perdesse. Então se ofereceu: “Deixe-me ficar como seu escravo no lugar do menino. Como posso voltar para o meu pai sem ele?”',
        cena: { fundo: 'interior', el: [p('joseEg', 620, 395, { coroa: true, espelho: true }), p('juda', 420, 395, { pose: 'ajoelhado', bracos: 'aberto' }), p('benjamim', 300, 395, { triste: true }), fala('Fico eu no lugar\ndo menino!', 160, 200)] } },
    ],
    licao: 'O irmão que vendeu José agora se oferece como substituto de Benjamim. Essa atitude aponta para Jesus, descendente de Judá, que se ofereceu em nosso lugar.',
    pergunta: 'O que significa amar alguém a ponto de tomar o lugar dele?',
    versiculo: '44:33',
  };

  C[45] = {
    titulo: 'José se revela aos irmãos',
    personagens: ['José', 'Os irmãos', 'Benjamim', 'Faraó', 'Jacó'],
    cenas: [
      { ref: '45:1-8', texto: 'José não aguentou mais. Mandou todos os egípcios saírem e chorou tão alto que se ouviu no palácio. “Eu sou José! Meu pai ainda vive?” Os irmãos ficaram mudos de medo. José disse: “Não fiquem tristes por terem me vendido. Foi Deus quem me enviou adiante de vocês para salvar vidas.”',
        cena: { fundo: 'interior', el: [luz(400, -40, { opacidade: .5 }), p('joseEg', 400, 395, { bracos: 'aberto' }), ...irmaos(560, 395, { espelho: true, bracos: 'rosto', s: .8 }).slice(0, 4), p('benjamim', 290, 395), fala('Eu sou José!', 200, 220)] } },
      { ref: '45:9-15', texto: 'José abraçou Benjamim e os dois choraram. Depois beijou e abraçou cada um dos irmãos. Só então eles conseguiram conversar com ele. O perdão abriu caminho para a família se reunir de novo.',
        cena: { fundo: 'interior', el: [p('joseEg', 380, 395, { bracos: 'aberto' }), p('benjamim', 450, 395, { espelho: true, bracos: 'aberto' }), { t: 'coracao', x: 415, y: 240, anim: 'pulsar' }, p('juda', 560, 395, { espelho: true }), p('irmao1', 620, 395, { espelho: true }), p('irmao2', 250, 395)] } },
      { ref: '45:16-28', texto: 'O faraó ficou feliz e mandou carroças para trazer toda a família ao Egito. Quando os irmãos contaram a Jacó que José estava vivo e governava o Egito, ele não acreditou. Mas, ao ver as carroças, seu espírito reviveu: “Basta! Meu filho José está vivo. Irei vê-lo antes de morrer.”',
        cena: { fundo: 'dia', el: [{ t: 'carroca', x: 600, y: 400 }, { t: 'carroca', x: 720, y: 405, s: .8 }, p('jaco', 330, 395, { velho: true, bracos: 'cima' }), p('irmao1', 430, 395, { bracos: 'aberto' }), fala('Meu filho José está vivo!', 100, 220)] } },
    ],
    licao: 'José viu a mão de Deus por trás de tudo o que sofreu. O perdão não apaga o mal feito, mas permite que Deus transforme a história em salvação.',
    pergunta: 'Como olhar para uma dor do passado e enxergar o que Deus fez com ela?',
    versiculo: '45:5',
  };

  C[46] = {
    titulo: 'Jacó desce ao Egito',
    personagens: ['Jacó (Israel)', 'José', 'Os 70 da família'],
    cenas: [
      { ref: '46:1-7', texto: 'Jacó partiu com tudo o que tinha. Em Berseba, ofereceu sacrifícios, e Deus falou com ele de noite: “Não tenha medo de descer ao Egito. Ali farei de você uma grande nação. Eu mesmo descerei com você e o trarei de volta.”',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 50, h: 220 }, luz(450, -40, { opacidade: .6 }), { t: 'altar', x: 300, y: 390 }, p('jaco', 400, 395, { velho: true, bracos: 'orando' }), fala('Não tenha medo.\nEu irei com você.', 460, 160)] } },
      { ref: '46:8-27', texto: 'O capítulo lista os filhos e netos de Jacó que foram ao Egito. Ao todo, a família somava setenta pessoas. Era pequena, mas dali Deus formaria um povo enorme.',
        cena: { fundo: 'deserto', el: [{ t: 'carroca', x: 160, y: 400, anim: 'andar' }, p('jaco', 260, 395, { velho: true, anim: 'andar' }), ...irmaos(320, 395, { anim: 'andar', s: .8 }), { t: 'ovelha', x: 640, y: 405, anim: 'andar' }, { t: 'camelo', x: 720, y: 405, anim: 'andar' }, { t: 'rotulo', texto: '70 pessoas', x: 20, y: 20 }] } },
      { ref: '46:28-34', texto: 'José preparou sua carruagem e foi encontrar o pai em Gósen. Quando o viu, lançou-se ao pescoço dele e chorou por muito tempo. Jacó disse: “Agora já posso morrer, pois vi o seu rosto e sei que você está vivo.”',
        cena: { fundo: 'egito', el: [{ t: 'carroca', x: 640, y: 395 }, p('joseEg', 420, 390, { coroa: true, espelho: true, bracos: 'aberto' }), p('jaco', 350, 390, { velho: true, bracos: 'aberto' }), { t: 'coracao', x: 385, y: 240, anim: 'pulsar' }] } },
    ],
    licao: 'Deus não apenas manda, Ele vai junto. A família de Jacó desceu ao Egito sabendo que Deus estaria com eles e que a promessa continuava.',
    pergunta: 'Que mudança grande você está enfrentando? Como a promessa “eu irei com você” te encoraja?',
    versiculo: '46:4',
  };

  C[47] = {
    titulo: 'Jacó diante do faraó',
    personagens: ['Jacó', 'Faraó', 'José'],
    cenas: [
      { ref: '47:1-12', texto: 'José apresentou cinco irmãos e depois o pai ao faraó. O faraó deu a eles a terra de Gósen, a melhor região para pastores. O velho Jacó, de 130 anos, abençoou o faraó, o homem mais poderoso do mundo.',
        cena: { fundo: 'interior', el: [{ t: 'trono', x: 560, y: 395 }, p('farao', 560, 370, { espelho: true }), p('jaco', 400, 395, { velho: true, bracos: 'cima' }), p('joseEg', 300, 395, { coroa: true })] } },
      { ref: '47:13-26', texto: 'A fome piorou. O povo trocou primeiro o dinheiro, depois os rebanhos e por fim as terras por comida. José organizou um sistema: o povo plantaria e daria um quinto da colheita ao faraó. O povo disse: “Você salvou nossas vidas!”',
        cena: { fundo: 'egito', el: [p('joseEg', 400, 390, { coroa: true, bracos: 'aberto' }), { t: 'saco', x: 320, y: 395 }, { t: 'saco', x: 480, y: 395 }, p('irmao1', 200, 392, { cor: '#f0e6d0', pele: PELE.c, barba: false, bracos: 'frente' }), p('irmao2', 600, 392, { cor: '#f0e6d0', pele: PELE.c, barba: false, espelho: true }), { t: 'rotulo', texto: '1/5 para o faraó', x: 20, y: 20 }] } },
      { ref: '47:27-31', texto: 'Israel prosperou em Gósen e se multiplicou. Jacó viveu ali dezessete anos. Perto de morrer, pediu a José que jurasse não sepultá-lo no Egito, mas em Canaã, junto com Abraão e Isaque. Ele tinha certeza da promessa de Deus.',
        cena: { fundo: 'por-do-sol', el: [p('jaco', 360, 395, { velho: true, pose: 'ajoelhado', bracos: 'frente' }), p('joseEg', 460, 395, { coroa: true, espelho: true, bracos: 'frente' }), fala('Leve-me para Canaã.', 100, 230)] } },
    ],
    licao: 'José foi um administrador sábio numa crise. E Jacó, mesmo no Egito, manteve o coração voltado para a promessa de Deus.',
    pergunta: 'Onde está o seu coração: no conforto de agora ou nas promessas de Deus?',
    versiculo: '47:25',
  };

  C[48] = {
    titulo: 'Jacó abençoa Efraim e Manassés',
    personagens: ['Jacó', 'José', 'Manassés', 'Efraim'],
    cenas: [
      { ref: '48:1-12', texto: 'Jacó ficou doente. José levou seus dois filhos, Manassés e Efraim. Jacó contou como Deus o tinha abençoado em Betel e disse que adotaria os dois netos como seus filhos: eles se tornariam duas tribos de Israel.',
        cena: { fundo: 'interior', el: [p('jaco', 520, 395, { velho: true, pose: 'ajoelhado', espelho: true, bracos: 'aberto' }), p('joseEg', 280, 395, { coroa: true }), p('crianca', 380, 395, { cor: '#f0e6d0', s: .7 }), p('crianca', 440, 395, { cor: '#e0d0b0', s: .65 })] } },
      { ref: '48:13-22', texto: 'José colocou o mais velho, Manassés, à direita de Jacó, e Efraim à esquerda. Mas Jacó cruzou os braços e pôs a mão direita, a da bênção maior, sobre Efraim, o mais novo. José tentou corrigir, mas Jacó disse: “Eu sei, meu filho, eu sei. O mais novo será maior.”',
        cena: { fundo: 'interior', el: [luz(450, -40, { opacidade: .5 }), p('jaco', 450, 395, { velho: true, bracos: 'cima' }), p('crianca', 400, 395, { cor: '#f0e6d0', s: .65, pose: 'ajoelhado' }), p('crianca', 500, 395, { cor: '#e0d0b0', s: .6, pose: 'ajoelhado' }), p('joseEg', 250, 395, { coroa: true, bracos: 'frente' }),
          fala('Eu sei, meu filho, eu sei.', 520, 200)] } },
    ],
    licao: 'Na Bíblia, Deus muitas vezes escolhe o mais novo ou o menos esperado: Abel, Isaque, Jacó, José, Efraim. A bênção é presente da graça, não direito por ordem de nascimento.',
    pergunta: 'Você já se sentiu “o menos provável” para ser usado por Deus?',
    versiculo: '48:15-16',
  };

  C[49] = {
    titulo: 'Jacó abençoa os doze filhos',
    personagens: ['Jacó', 'Os doze filhos de Jacó', 'Judá', 'José'],
    cenas: [
      { ref: '49:1-7', texto: 'Jacó reuniu os filhos: “Venham, e eu direi o que acontecerá com vocês nos últimos dias.” Rúben, o mais velho, perdeu a primazia por um grave pecado. Simeão e Levi foram repreendidos pela violência em Siquém.',
        cena: { fundo: 'interior', el: [p('jaco', 400, 395, { velho: true, pose: 'ajoelhado', bracos: 'aberto' }), ...irmaos(120, 395, { s: .75 }), p('irmao3', 600, 395, { s: .75, espelho: true }), p('irmao4', 650, 395, { s: .75, espelho: true }), p('joseEg', 700, 395, { s: .75, espelho: true })] } },
      { ref: '49:8-12', veja: ['apocalipse 5:5'], texto: 'Sobre Judá, Jacó disse: “Judá, seus irmãos o louvarão. Você é um leão. O cetro não se afastará de Judá até que venha aquele a quem pertence, e a ele os povos obedecerão.” Era uma profecia do rei Davi e, por fim, de Jesus, chamado de “Leão da tribo de Judá”.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'leao', x: 520, y: 395, s: 1.4, espelho: true, anim: 'surgir' }, { t: 'coroa', x: 560, y: 260, anim: 'flutuar' }, p('juda', 300, 395, { bracos: 'cima' }), { t: 'rotulo', texto: 'O Leão de Judá', x: 20, y: 20 }] } },
      { ref: '49:13-28', texto: 'Cada filho recebeu uma palavra: Zebulom junto ao mar, Issacar forte como jumento, Dã como juiz, Gade lutador, Aser com pão farto, Naftali como corça livre, José como árvore frutífera junto à fonte, abençoado pelo Poderoso de Jacó, e Benjamim como lobo valente. Eram as doze tribos de Israel.',
        cena: { fundo: 'dia', el: [{ t: 'arvore', x: 400, y: 360, s: 1.4, fruto: '#e0453a' }, { t: 'poco', x: 480, y: 395, s: .6 }, { t: 'agua', x: 0, y: 420, h: 40 }, { t: 'rotulo', texto: '12 tribos de Israel', x: 20, y: 20 }, ...irmaos(80, 395, { s: .7 }), p('benjamim', 620, 395, { s: .75 }), p('joseEg', 680, 395, { s: .75 })] } },
      { ref: '49:29-33', texto: 'Depois das bênçãos, Jacó pediu de novo para ser sepultado na caverna de Macpela, com Abraão, Sara, Isaque, Rebeca e Lia. Então se deitou, deu o último suspiro e foi reunido ao seu povo.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 60, h: 260 }, p('jaco', 400, 395, { velho: true, pose: 'deitado' }), luz(400, -40, { opacidade: .4 })] } },
    ],
    licao: 'As palavras finais de Jacó mostram que Deus conhece o futuro de cada família. Da tribo de Judá viria o Rei prometido.',
    pergunta: 'Que “bênção” ou palavra você gostaria de deixar para quem vem depois de você?',
    versiculo: '49:10',
  };

  C[50] = {
    titulo: 'Deus transformou o mal em bem',
    personagens: ['José', 'Os irmãos', 'Faraó'],
    cenas: [
      { ref: '50:1-14', texto: 'José chorou sobre o pai. Os egípcios guardaram luto por setenta dias. Depois, uma grande comitiva, com carruagens e oficiais do faraó, subiu a Canaã, e os filhos sepultaram Jacó na caverna de Macpela, como ele pediu.',
        cena: { fundo: 'deserto', el: [{ t: 'caverna', x: 620, y: 390 }, { t: 'carroca', x: 160, y: 400 }, p('joseEg', 320, 395, { coroa: true, triste: true }), p('juda', 400, 395, { triste: true }), p('benjamim', 470, 395, { triste: true })] } },
      { ref: '50:15-21', texto: 'Com o pai morto, os irmãos tiveram medo de que José se vingasse. Mandaram pedir perdão e se jogaram aos pés dele. José chorou e respondeu: “Não tenham medo. Estou eu no lugar de Deus? Vocês planejaram o mal contra mim, mas Deus o transformou em bem, para salvar muitas vidas.” E os consolou.',
        cena: { fundo: 'interior', el: [luz(380, -40, { opacidade: .6 }), p('joseEg', 380, 395, { coroa: true, bracos: 'aberto' }), ...irmaos(470, 395, { espelho: true, pose: 'ajoelhado', s: .8 }), fala('Vocês planejaram o mal,\nmas Deus o tornou em bem.', 40, 190)] } },
      { ref: '50:22-26', texto: 'José viveu 110 anos e conheceu bisnetos. Antes de morrer, disse: “Deus certamente virá ajudar vocês e os levará para a terra que prometeu a Abraão, Isaque e Jacó. Quando isso acontecer, levem os meus ossos.” Gênesis termina no Egito, com o povo esperando a promessa. A história continua no Êxodo.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'piramide', x: 620, y: 365 }, p('joseEg', 360, 395, { velho: true, coroa: true, bracos: 'frente' }), p('crianca', 440, 395, { cor: '#6aa0c0', s: .6 }), p('crianca', 480, 395, { cor: '#c8904a', s: .55 }), { t: 'estrelas', x: 0, y: 0, n: 20, h: 140 },
          fala('Deus vai cumprir\na promessa!', 90, 210)] } },
    ],
    licao: 'Este é o resumo de Gênesis: as pessoas falham, o mal acontece, mas Deus é soberano e fiel. Ele transforma até o mal em bem e sempre cumpre suas promessas.',
    pergunta: 'Que situação da sua vida você precisa entregar a Deus, confiando que Ele pode transformá-la em bem?',
    versiculo: '50:20',
  };

  CONTEUDO.registrar('genesis', {
    autor: 'Tradição: Moisés',
    epoca: 'Da criação até cerca de 1800 a.C.',
    tema: 'Os começos: Deus cria, o ser humano cai, e Deus escolhe uma família para abençoar todas as nações.',
    introducao: 'Gênesis quer dizer “origem”. É o livro dos começos: do mundo, da humanidade, do pecado, das nações e do povo de Israel. Ele se divide em duas grandes partes: a história das origens (capítulos 1 a 11) e a história dos patriarcas Abraão, Isaque, Jacó e José (capítulos 12 a 50).',
    capa: { fundo: 'aurora', el: [{ t: 'estrelas', x: 0, y: 0, n: 40, h: 200 }, luz(400, -30), { t: 'arvore', x: 150, y: 370, fruto: '#d22a3a' }, { t: 'arca', x: 600, y: 330, s: .6 }, { t: 'arco-iris', x: 600, y: 360, s: .6, opacidade: .7 }, p('abraao', 380, 390, { bracos: 'cima' })] },
    partes: [
      { titulo: 'Criação e queda', de: 1, ate: 5 },
      { titulo: 'Noé e o dilúvio', de: 6, ate: 10 },
      { titulo: 'Babel', de: 11, ate: 11 },
      { titulo: 'Abraão', de: 12, ate: 25 },
      { titulo: 'Isaque e Jacó', de: 26, ate: 36 },
      { titulo: 'José', de: 37, ate: 50 },
    ],
    capitulos: C,
  }, 'pt-BR');
})();
