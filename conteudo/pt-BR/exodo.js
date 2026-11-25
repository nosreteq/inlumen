/* Êxodo: estudo ilustrado, capítulo por capítulo.
 * Textos: recontos livres em linguagem simples (não são tradução bíblica).
 * Texto bíblico de referência: Bíblia Livre (BLIVRE), via biblia/blivre/. Nomes e grafias seguem a BLIVRE.
 * Formato: ver conteudo/pt-BR/genesis.js e a skill .claude/skills/escrever-capitulos.
 */
(function () {
  /* ---------- personagens recorrentes (aparência consistente) ---------- */
  const PELE = { a: '#f1c9a0', b: '#d9a67a', c: '#b97d53', d: '#8d5a3a' };
  const T = {
    moisesJovem: { cor: '#6a5a8a', pele: PELE.c, barba: '#2a1a10' },
    moises:      { cor: '#6a5a8a', pele: PELE.c, cabelo: '#9a9a9a', barba: '#bdbdbd', cajado: true }, // 80 anos (Êx 7:7)
    arao:        { cor: '#3f6aa8', pele: PELE.c, cabelo: '#9a9a9a', barba: '#bdbdbd' },
    araoSacerdote: { cor: '#2c4f9a', pele: PELE.c, cabelo: '#9a9a9a', barba: '#bdbdbd', peitoral: true },
    miria:       { cor: '#a04a6a', pele: PELE.c, veu: '#e0a0b8' },
    mae:         { cor: '#7a5a3a', pele: PELE.c, veu: '#b89a7a' },
    farao:       { cor: '#f6f2e6', pele: PELE.c, coroa: true },
    filhaFarao:  { cor: '#f6f2e6', pele: PELE.c, veu: '#e8c25a' },
    egipcio:     { cor: '#f0e6d0', pele: PELE.c },
    capataz:     { cor: '#e8dcc0', pele: PELE.c, cajado: true },
    jetro:       { cor: '#8a6a4a', pele: PELE.d, velho: true, barba: true, cajado: true },
    zipora:      { cor: '#b8703a', pele: PELE.d, veu: '#e0b06a' },
    josue:       { cor: '#8a4a2a', pele: PELE.c, barba: '#3a2a1e' },
    hur:         { cor: '#4a7a5a', pele: PELE.c, barba: true },
    bezalel:     { cor: '#9a6a3a', pele: PELE.c, barba: true },
    h1: { cor: '#7a6a4a', pele: PELE.c, barba: true },
    h2: { cor: '#4a6a5a', pele: PELE.b, barba: true },
    h3: { cor: '#8a4a5a', pele: PELE.c, veu: '#c8a0a0' },
    h4: { cor: '#5a5a7a', pele: PELE.b, barba: true },
    h5: { cor: '#9a7a4a', pele: PELE.c, veu: '#d8c08a' },
  };
  const p = (quem, x, y, extra = {}) => ({ t: 'pessoa', x, y, ...T[quem], ...extra });
  const fala = (texto, x, y, extra = {}) => ({ t: 'fala', texto, x, y, ...extra });
  const luz = (x = 400, y = -30, extra = {}) => ({ t: 'luz', x, y, anim: 'brilhar', ...extra });
  const rotulo = (texto) => ({ t: 'rotulo', texto, x: 20, y: 20 });
  // grupo de israelitas
  const povo = (x0, y, n = 5, extra = {}) => Array.from({ length: n }, (_, i) => p(['h1', 'h2', 'h3', 'h4', 'h5'][i % 5], x0 + i * 46, y + (i % 2) * 6, { s: .8, ...extra }));

  const C = {};

  C[1] = {
    titulo: 'Escravos no Egito',
    personagens: ['Os filhos de Israel', 'O novo rei do Egito (Faraó)', 'Sifrá', 'Puá'],
    cenas: [
      { ref: '1:1-7', texto: 'A família de Jacó tinha chegado ao Egito com setenta pessoas. José e seus irmãos morreram, mas os filhos de Israel tiveram muitos filhos e netos. Eles se multiplicaram tanto que a terra se encheu deles, como Deus tinha prometido a Abraão.',
        cena: { fundo: 'egito', el: [{ t: 'piramide', x: 660, y: 360, s: .8 }, ...povo(120, 395, 9), { t: 'bebe', x: 560, y: 400 }, rotulo('70 pessoas → um povo')] } },
      { ref: '1:8-14', texto: 'Subiu ao trono um novo rei, que não tinha conhecido José. Com medo de que os israelitas ficassem fortes demais, ele os transformou em escravos. Eles faziam barro e tijolos e construíram as cidades-armazém de Pitom e Ramessés. Mas, quanto mais eram oprimidos, mais se multiplicavam.',
        cena: { fundo: 'deserto', el: [{ t: 'sol', x: 690, y: 80 }, { t: 'cidade', x: 560, y: 365, w: 260, cor: '#c8a070' }, { t: 'tijolos', x: 230, y: 398 }, p('h1', 150, 395, { triste: true, bracos: 'frente' }),
          p('h2', 330, 395, { triste: true, bracos: 'cima' }), p('capataz', 430, 395, { espelho: true, bracos: 'frente' }), fala('Mais tijolos!', 440, 250)] } },
      { ref: '1:15-22', texto: 'O rei mandou as parteiras dos hebreus, Sifrá e Puá, matarem os meninos que nascessem. Mas elas temiam a Deus e deixaram os bebês viverem. Deus abençoou as parteiras. Então Faraó deu uma ordem cruel a todo o povo: jogar no rio Nilo todo menino hebreu que nascesse.',
        cena: { fundo: 'interior', el: [p('farao', 560, 395, { espelho: true, bracos: 'frente' }), p('h3', 330, 395, { veu: '#d8d0c0', cor: '#8a7a6a' }), p('h5', 250, 395, { veu: '#e0d8c0', cor: '#6a7a8a' }), { t: 'bebe', x: 290, y: 330 }, fala('Matem os meninos!', 450, 210), luz(280, -40, { opacidade: .4, r: 300 })] } },
    ],
    licao: 'Sifrá e Puá obedeceram a Deus em vez de obedecer ao rei. Temer a Deus dá coragem para fazer o certo, mesmo quando o poderoso manda fazer o errado.',
    pergunta: 'As parteiras arriscaram a vida para proteger bebês. Que atitude de coragem a fé em Deus pede de nós hoje?',
    versiculo: '1:17',
  };

  C[2] = {
    titulo: 'O bebê no cesto: o nascimento de Moisés',
    personagens: ['Moisés', 'Sua mãe', 'Sua irmã', 'A filha de Faraó', 'Reuel (Jetro)', 'Zípora', 'Gérson'],
    cenas: [
      { ref: '2:1-4', texto: 'Um casal da tribo de Levi teve um menino. A mãe viu que ele era lindo e o escondeu por três meses. Quando não deu mais para esconder, ela fez um cesto de junco, vedou com piche, colocou o bebê dentro e o deixou entre os juncos, na beira do rio. A irmã dele ficou de longe, vigiando.',
        cena: { fundo: 'egito', el: [{ t: 'palmeira', x: 120, y: 375 }, { t: 'cestinho', x: 420, y: 412, anim: 'flutuar' }, { t: 'trigo', x: 480, y: 408, n: 6, s: .7 }, { t: 'trigo', x: 360, y: 410, n: 5, s: .7 },
          p('mae', 250, 385, { triste: true, bracos: 'frente' }), p('miria', 640, 385, { s: .75, espelho: true })] } },
      { ref: '2:5-10', texto: 'A filha de Faraó desceu para se banhar no rio, viu o cesto e mandou buscá-lo. Quando o abriu, o bebê chorava, e ela teve compaixão: “É um menino dos hebreus.” A irmã do bebê se ofereceu para chamar uma ama, e chamou a própria mãe! Quando o menino cresceu, a princesa o adotou e o chamou de Moisés, porque “das águas o tirei”.',
        cena: { fundo: 'egito', el: [{ t: 'palmeira', x: 680, y: 375 }, p('filhaFarao', 360, 390, { bracos: 'frente' }), { t: 'cestinho', x: 420, y: 400 }, p('miria', 230, 392, { s: .75, bracos: 'frente' }), p('egipcio', 500, 390, { s: .85, veu: '#f2eee6' }),
          fala('É um menino\ndos hebreus!', 380, 230)] } },
      { ref: '2:11-15', texto: 'Já adulto, Moisés foi ver o trabalho pesado do seu povo e viu um egípcio batendo num hebreu. Achando que ninguém via, matou o egípcio e o escondeu na areia. No dia seguinte, um hebreu lhe disse: “Vai me matar como matou o egípcio?” Moisés teve medo. Faraó quis matá-lo, e ele fugiu para a terra de Midiã.',
        cena: { fundo: 'deserto', el: [{ t: 'sol', x: 690, y: 80 }, p('moisesJovem', 330, 395, { anim: 'andar', espelho: true, triste: true }), { t: 'piramide', x: 120, y: 360, s: .5 }, rotulo('Fuga para Midiã')] } },
      { ref: '2:16-25', texto: 'Em Midiã, Moisés sentou-se junto a um poço. Chegaram as sete filhas de Reuel, o sacerdote de Midiã, mas uns pastores as expulsaram. Moisés as defendeu e deu água às ovelhas. Reuel o acolheu e lhe deu a filha Zípora em casamento; tiveram um filho, Gérson. Enquanto isso, no Egito, o povo clamava, e Deus ouviu e se lembrou da sua aliança com Abraão, Isaque e Jacó.',
        cena: { fundo: 'deserto', el: [{ t: 'poco', x: 400, y: 395 }, p('moisesJovem', 300, 395, { bracos: 'frente' }), p('zipora', 500, 395, { espelho: true }), p('h5', 560, 398, { s: .8, cor: '#c88a4a', pele: PELE.d, veu: '#e8c080' }),
          { t: 'ovelha', x: 180, y: 402 }, { t: 'ovelha', x: 650, y: 405, espelho: true }, luz(400, -40, { opacidade: .5 }), fala('Deus ouviu o clamor', 520, 120)] } },
    ],
    licao: 'Deus protegeu Moisés por meio de pessoas improváveis: uma mãe corajosa, uma irmã atenta e até a filha do opressor. Ele também ouve o clamor de quem sofre e não esquece suas promessas.',
    pergunta: 'Quem Deus já usou de forma inesperada para cuidar de você?',
    versiculo: '2:24',
  };

  C[3] = {
    titulo: 'A sarça ardente',
    personagens: ['Moisés', 'Deus (EU SOU)', 'Jetro'],
    cenas: [
      { ref: '3:1-6', texto: 'Moisés cuidava das ovelhas do sogro, Jetro, perto de Horebe, o monte de Deus. Ali viu algo impressionante: uma sarça pegava fogo, mas não se queimava! Quando se aproximou, Deus o chamou do meio da sarça: “Moisés, Moisés! Tire as sandálias, porque este lugar é terra santa. Eu sou o Deus de Abraão, de Isaque e de Jacó.” Moisés cobriu o rosto, com medo.',
        cena: { fundo: 'montanha', el: [{ t: 'sarca', x: 470, y: 392 }, luz(470, 280, { r: 300, nucleo: 60 }), p('moises', 300, 398, { bracos: 'rosto' }), { t: 'ovelha', x: 160, y: 404 }, fala('Moisés, Moisés!', 500, 190)] } },
      { ref: '3:7-12', texto: 'Deus disse: “Eu vi o sofrimento do meu povo e ouvi o seu clamor. Desci para libertá-los e levá-los a uma terra boa, onde corre leite e mel. Vá, eu o envio a Faraó.” Moisés respondeu: “Quem sou eu para ir?” E Deus prometeu: “Eu estarei com você.”',
        cena: { fundo: 'montanha', el: [{ t: 'sarca', x: 520, y: 392 }, luz(520, 280, { r: 300, nucleo: 60 }), p('moises', 340, 398, { bracos: 'aberto' }), fala('Quem sou eu?', 180, 240), fala('Eu estarei com você.', 520, 180)] } },
      { ref: '3:13-22', texto: 'Moisés perguntou qual nome deveria dizer ao povo. Deus respondeu: “EU SOU O QUE SOU. Diga: EU SOU me enviou a vocês.” Deus avisou que Faraó só deixaria o povo sair por causa da sua mão poderosa, e que os israelitas não sairiam de mãos vazias.',
        cena: { fundo: 'montanha', el: [{ t: 'sarca', x: 480, y: 392 }, luz(480, 280, { r: 340, nucleo: 70 }), p('moises', 300, 398, { pose: 'ajoelhado', bracos: 'orando' }), rotulo('EU SOU O QUE SOU')] } },
    ],
    licao: 'Deus vê o sofrimento do seu povo e age. Ele chama pessoas comuns, que se sentem incapazes, e a resposta dele não é “você consegue”, mas “eu estarei com você”.',
    pergunta: 'Para que tarefa você se sente pequeno demais? Como a promessa “eu estarei com você” muda isso?',
    versiculo: '3:14',
  };

  C[4] = {
    titulo: 'Os sinais de Moisés e a volta ao Egito',
    personagens: ['Moisés', 'Arão', 'Zípora', 'Jetro', 'Os anciãos de Israel'],
    cenas: [
      { ref: '4:1-9', texto: 'Moisés tinha medo de que o povo não acreditasse nele. Então Deus lhe deu sinais: a vara jogada no chão virou uma cobra e, quando ele a pegou pela cauda, voltou a ser vara. Sua mão ficou leprosa e depois sarou. E, se ainda não cressem, a água do rio viraria sangue.',
        cena: { fundo: 'montanha', el: [{ t: 'sarca', x: 600, y: 392, s: .8 }, luz(600, 300, { r: 260, nucleo: 50, opacidade: .7 }), p('moises', 320, 398, { cajado: false, bracos: 'aberto' }), { t: 'serpente', x: 400, y: 410, anim: 'surgir' }, rotulo('Sinais')] } },
      { ref: '4:10-17', texto: 'Moisés insistiu: “Não sei falar bem, sou lento para falar.” Deus respondeu: “Quem fez a boca do homem? Eu estarei com a sua boca.” Mesmo assim, Moisés pediu que Deus mandasse outra pessoa. Deus se irou, mas lhe deu um ajudante: seu irmão Arão falaria por ele.',
        cena: { fundo: 'montanha', el: [{ t: 'sarca', x: 600, y: 392, s: .8 }, luz(600, 300, { r: 260, nucleo: 50, opacidade: .7 }), p('moises', 320, 398, { bracos: 'rosto', triste: true }), fala('Não sei falar bem…', 120, 240), fala('Quem fez a boca\ndo homem?', 520, 160)] } },
      { ref: '4:18-31', texto: 'Moisés se despediu de Jetro e voltou para o Egito com a esposa e os filhos, levando a vara de Deus na mão. No caminho houve um episódio misterioso e sério, e Zípora circuncidou o filho deles. Arão foi ao encontro de Moisés no monte de Deus. Juntos, reuniram os anciãos de Israel; o povo creu, se curvou e adorou.',
        cena: { fundo: 'deserto', el: [p('moises', 300, 395, { bracos: 'aberto' }), p('arao', 380, 395, { espelho: true, bracos: 'aberto' }), { t: 'coracao', x: 340, y: 240, anim: 'pulsar' }, ...povo(480, 398, 5, { pose: 'ajoelhado', bracos: 'orando' })] } },
    ],
    licao: 'Deus não escolhe os mais capazes, mas capacita os que chama. E ele não nos manda sozinhos: dá companheiros, como deu Arão a Moisés.',
    pergunta: 'Que desculpas costumamos dar a Deus? Quem ele já colocou ao seu lado para ajudar?',
    versiculo: '4:12',
  };

  C[5] = {
    titulo: '“Quem é o SENHOR?”: tijolos sem palha',
    personagens: ['Moisés', 'Arão', 'Faraó', 'Os capatazes', 'Os supervisores israelitas'],
    cenas: [
      { ref: '5:1-9', texto: 'Moisés e Arão disseram a Faraó: “O SENHOR, o Deus de Israel, diz: deixe o meu povo ir celebrar uma festa no deserto.” Faraó respondeu com desprezo: “Quem é o SENHOR para que eu lhe obedeça? Não conheço o SENHOR!” E ainda mandou que os escravos fizessem a mesma quantidade de tijolos, mas sem receber palha.',
        cena: { fundo: 'interior', el: [{ t: 'trono', x: 600, y: 395 }, p('farao', 600, 370, { espelho: true, bracos: 'aberto' }), p('moises', 300, 395), p('arao', 380, 395, { bracos: 'frente' }), fala('Quem é o SENHOR?', 480, 200), fala('Deixe o meu povo ir!', 150, 230)] } },
      { ref: '5:10-23', texto: 'O povo teve que procurar palha pelo Egito inteiro, e os supervisores israelitas eram espancados por não cumprir a meta. Eles culparam Moisés e Arão. Moisés, então, levou sua angústia a Deus: “Senhor, por que me enviaste? Desde que falei com Faraó, ele maltrata ainda mais este povo!”',
        cena: { fundo: 'deserto', el: [{ t: 'sol', x: 680, y: 80 }, { t: 'trigo', x: 150, y: 400, n: 5, seco: true }, p('h1', 250, 395, { triste: true, bracos: 'frente' }), p('capataz', 360, 395, { espelho: true, bracos: 'cima' }),
          p('moises', 560, 398, { bracos: 'cima', triste: true }), fala('Por que me enviaste?', 560, 230)] } },
    ],
    licao: 'Obedecer a Deus nem sempre melhora as coisas de imediato. Moisés foi honesto e levou sua frustração a Deus em oração, em vez de desistir.',
    pergunta: 'Quando as coisas pioram depois de fazermos o certo, o que podemos aprender com a oração sincera de Moisés?',
    versiculo: '5:22',
  };

  C[6] = {
    titulo: 'As promessas de Deus e a família de Moisés',
    personagens: ['Moisés', 'Arão', 'Deus', 'Anrão', 'Joquebede'],
    cenas: [
      { ref: '6:1-9', texto: 'Deus respondeu a Moisés: “Eu sou o SENHOR. Fiz uma aliança com Abraão, Isaque e Jacó. Eu ouvi o gemido do meu povo. Vou tirá-los da escravidão, resgatá-los com braço estendido, tomá-los como meu povo e serei o Deus deles.” Mas o povo, desanimado pela escravidão pesada, não quis ouvir.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 50, h: 220 }, luz(400, -30, { opacidade: .7 }), p('moises', 400, 398, { bracos: 'cima' }), ...povo(560, 400, 4, { triste: true }), fala('Eu sou o SENHOR.\nEu vou tirar vocês!', 120, 160)] } },
      { ref: '6:10-30', texto: 'Aqui a Bíblia faz uma pausa para mostrar a árvore genealógica de Moisés e Arão. Eles eram da tribo de Levi, filhos de Anrão e Joquebede. Arão se casou com Eliseba e teve quatro filhos: Nadabe, Abiú, Eleazar e Itamar. Moisés ainda se sentia incapaz: “Como Faraó vai me ouvir, se eu falo mal?”',
        cena: { fundo: 'dia', el: [p('h1', 160, 395, { velho: true, s: .9 }), p('mae', 230, 395, { s: .9 }), p('arao', 340, 395), p('moises', 420, 395), p('h2', 520, 398, { s: .7 }), p('h4', 570, 398, { s: .7 }), p('h1', 620, 398, { s: .7 }), p('h2', 670, 398, { s: .7 }), rotulo('Tribo de Levi')] } },
    ],
    licao: 'As promessas de Deus não dependem do nosso ânimo. Mesmo quando o povo não conseguia acreditar, Deus repetiu: “Eu sou o SENHOR. Eu farei.”',
    pergunta: 'Quais das promessas de Deus em Êxodo 6:6-7 mais te encorajam?',
    versiculo: '6:7',
  };

  C[7] = {
    titulo: 'A vara de Arão e a primeira praga: água em sangue',
    personagens: ['Moisés', 'Arão', 'Faraó', 'Os magos do Egito'],
    cenas: [
      { ref: '7:1-13', texto: 'Moisés tinha 80 anos e Arão 83 quando falaram com Faraó. Arão jogou a vara diante do rei e ela virou uma cobra. Os magos do Egito fizeram o mesmo com seus encantamentos, mas a vara de Arão engoliu as varas deles. Ainda assim, o coração de Faraó se endureceu.',
        cena: { fundo: 'interior', el: [{ t: 'trono', x: 640, y: 395 }, p('farao', 640, 370, { espelho: true }), p('arao', 330, 395, { bracos: 'frente' }), p('moises', 250, 395), { t: 'serpente', x: 440, y: 410, s: 1.2, anim: 'balancar' }, p('egipcio', 540, 395, { espelho: true, s: .85 }), rotulo('80 e 83 anos')] } },
      { ref: '7:14-25', texto: 'De manhã, junto ao rio Nilo, Arão estendeu a vara sobre as águas, e toda a água do Egito virou sangue. Os peixes morreram, o rio cheirava mal e ninguém conseguia beber. Os magos imitaram o sinal, e Faraó voltou para o palácio sem se importar. Sete dias se passaram.',
        cena: { fundo: 'egito', el: [{ t: 'agua', x: 0, y: 398, cor: '#9a1e1e', cor2: '#7a1414', h: 60 }, p('arao', 320, 390, { bracos: 'frente', cajado: true }), p('moises', 240, 390), p('farao', 580, 388, { espelho: true, bracos: 'rosto' }), rotulo('1ª praga: sangue')] } },
    ],
    licao: 'As pragas mostraram que os deuses do Egito eram falsos e que só o SENHOR tem poder sobre a criação. O coração duro de Faraó é um alerta: é possível ver sinais claros e mesmo assim recusar a Deus.',
    pergunta: 'O que endurece o coração de uma pessoa diante de Deus?',
    versiculo: '7:5',
  };

  C[8] = {
    titulo: 'Rãs, piolhos e moscas',
    personagens: ['Moisés', 'Arão', 'Faraó', 'Os magos'],
    cenas: [
      { ref: '8:1-15', texto: 'Segunda praga: rãs! Elas saíram do rio e entraram nas casas, nos quartos, nas camas e até nos fornos. Faraó pediu: “Orem para tirar as rãs, e eu deixo o povo ir.” Moisés orou, as rãs morreram e foram juntadas em montes. Mas, quando Faraó se viu aliviado, endureceu de novo o coração.',
        cena: { fundo: 'interior', el: [{ t: 'trono', x: 620, y: 395 }, p('farao', 620, 370, { espelho: true, bracos: 'aberto' }), { t: 'ra', x: 200, y: 400 }, { t: 'ra', x: 280, y: 410, s: .8 }, { t: 'ra', x: 380, y: 400, s: 1.1, anim: 'flutuar' }, { t: 'ra', x: 480, y: 412 }, { t: 'ra', x: 560, y: 300, s: .7 }, rotulo('2ª praga: rãs')] } },
      { ref: '8:16-19', texto: 'Terceira praga: Arão bateu com a vara no pó, e o pó virou piolhos em pessoas e animais. Desta vez os magos não conseguiram imitar e disseram a Faraó: “Isto é o dedo de Deus.” Mas Faraó não quis ouvir.',
        cena: { fundo: 'deserto', el: [p('arao', 300, 395, { bracos: 'frente', cajado: true }), { t: 'moscas', x: 360, y: 300, w: 300, h: 90, n: 70, cor: '#5a4a3a' }, p('egipcio', 560, 395, { espelho: true, bracos: 'rosto' }), fala('É o dedo de Deus!', 520, 240), rotulo('3ª praga: piolhos')] } },
      { ref: '8:20-32', texto: 'Quarta praga: enxames de moscas encheram as casas dos egípcios. Mas na terra de Gósen, onde morava o povo de Israel, não houve moscas: Deus fez distinção entre o seu povo e o Egito. Faraó prometeu deixar o povo ir, mas mudou de ideia outra vez.',
        cena: { fundo: 'egito', el: [{ t: 'casa', x: 220, y: 390 }, { t: 'moscas', x: 100, y: 200, w: 260, h: 150, n: 80 }, { t: 'casa', x: 600, y: 390, cor: '#e8d0a0' }, ...povo(540, 398, 3), rotulo('4ª praga: moscas · Gósen protegida')] } },
    ],
    licao: 'Faraó prometia e voltava atrás assim que o problema passava. Arrependimento verdadeiro não é só querer se livrar das consequências.',
    pergunta: 'Qual a diferença entre se arrepender de verdade e só querer que o problema passe?',
    versiculo: '8:19',
  };

  C[9] = {
    titulo: 'Peste no gado, úlceras e granizo',
    personagens: ['Moisés', 'Arão', 'Faraó'],
    cenas: [
      { ref: '9:1-7', texto: 'Quinta praga: uma peste grave atingiu o gado dos egípcios: cavalos, jumentos, camelos, bois e ovelhas. Mas nenhum animal dos israelitas morreu. Faraó mandou conferir e viu que era verdade, mesmo assim não deixou o povo ir.',
        cena: { fundo: 'egito', el: [{ t: 'vaca', x: 200, y: 398, magra: true, triste: true }, { t: 'camelo', x: 330, y: 400, opacidade: .6 }, { t: 'vaca', x: 560, y: 395, espelho: true }, { t: 'ovelha', x: 660, y: 402, espelho: true }, rotulo('5ª praga: peste no gado')] } },
      { ref: '9:8-12', texto: 'Sexta praga: Moisés jogou cinza de um forno para o alto, diante de Faraó, e ela causou feridas e úlceras em pessoas e animais por todo o Egito. Nem os magos conseguiam ficar de pé diante de Moisés, por causa das feridas.',
        cena: { fundo: 'interior', el: [p('moises', 300, 395, { bracos: 'cima' }), { t: 'moscas', x: 260, y: 160, w: 200, h: 120, n: 50, cor: '#8a8a8a' }, p('egipcio', 520, 395, { espelho: true, bracos: 'rosto', triste: true }), p('farao', 640, 395, { espelho: true, triste: true }), rotulo('6ª praga: úlceras')] } },
      { ref: '9:13-35', texto: 'Sétima praga: Deus avisou que viria um granizo nunca visto, e quem temeu a palavra do SENHOR protegeu seus servos e animais. Caiu granizo com fogo e trovões, destruindo plantações e árvores, mas em Gósen não caiu granizo. Faraó admitiu: “Desta vez eu pequei!” Moisés orou e o granizo parou, mas Faraó endureceu o coração de novo.',
        cena: { fundo: 'tempestade', el: [{ t: 'nuvem', x: 200, y: 70, cor: '#4a5060', s: 1.4 }, { t: 'nuvem', x: 560, y: 60, cor: '#4a5060', s: 1.5 }, { t: 'chuva', x: 0, y: 80, w: 800, n: 90, cor: '#ffffff' }, { t: 'fogo', x: 300, y: 380, s: .7 }, { t: 'arvore', x: 520, y: 380, cor: '#4a6a3a' },
          p('farao', 640, 395, { espelho: true, bracos: 'rosto' }), fala('Desta vez eu pequei!', 500, 260), rotulo('7ª praga: granizo')] } },
    ],
    licao: 'Mesmo no juízo, Deus avisou e deu chance de proteção a quem levou sua palavra a sério, inclusive egípcios. A misericórdia de Deus aparece até nos momentos de juízo.',
    pergunta: 'Por que alguns servos de Faraó levaram o aviso a sério e outros não?',
    versiculo: '9:16',
  };

  C[10] = {
    titulo: 'Gafanhotos e trevas',
    personagens: ['Moisés', 'Arão', 'Faraó', 'Os servos de Faraó'],
    cenas: [
      { ref: '10:1-20', texto: 'Oitava praga: os próprios servos de Faraó imploraram: “Deixe esse povo ir! O Egito está arruinado!” Faraó quis deixar só os homens saírem. Então um vento do oriente trouxe gafanhotos que cobriram o chão e comeram tudo o que o granizo tinha deixado. Faraó pediu perdão, um vento do ocidente levou os gafanhotos para o mar Vermelho, mas ele não libertou o povo.',
        cena: { fundo: 'deserto', el: [{ t: 'gafanhoto', x: 60, y: 80, n: 45, w: 680, h: 280 }, { t: 'trigo', x: 240, y: 400, n: 7, seco: true }, p('farao', 560, 395, { espelho: true, bracos: 'cima' }), rotulo('8ª praga: gafanhotos')] } },
      { ref: '10:21-29', texto: 'Nona praga: Moisés estendeu a mão ao céu e caíram trevas tão densas sobre o Egito que se podia apalpá-las. Por três dias ninguém enxergava ninguém, mas nas casas dos israelitas havia luz. Faraó, furioso, expulsou Moisés: “Se você aparecer de novo, morrerá!” E Moisés respondeu: “Você não verá mais o meu rosto.”',
        cena: { fundo: 'trevas', el: [{ t: 'casa', x: 230, y: 395, cor: '#3a3a40' }, { t: 'casa', x: 560, y: 395, luz: true, cor: '#d9b88a' }, luz(560, 300, { r: 220, nucleo: 60, opacidade: .5 }), ...povo(470, 400, 3), rotulo('9ª praga: trevas · 3 dias')] } },
    ],
    licao: 'Deus separou claramente trevas e luz. Faraó negociava com Deus, tentando ceder só um pouco; mas a liberdade que Deus oferece é completa.',
    pergunta: 'Faraó queria liberar “só os homens” ou “sem os animais”. Também tentamos negociar com Deus pela metade?',
    versiculo: '10:23',
  };

  C[11] = {
    titulo: 'O anúncio da última praga',
    personagens: ['Moisés', 'Faraó'],
    cenas: [
      { ref: '11:1-3', texto: 'Deus disse a Moisés: “Trarei mais uma praga sobre Faraó e o Egito; depois dela, ele vai expulsar vocês.” Os israelitas deveriam pedir objetos de prata e de ouro aos vizinhos egípcios, e Deus fez o povo ser bem visto por eles. O próprio Moisés era muito respeitado no Egito.',
        cena: { fundo: 'egito', el: [luz(400, -40, { opacidade: .5 }), ...povo(160, 398, 3, { bracos: 'frente' }), p('egipcio', 420, 395, { espelho: true, bracos: 'frente' }), { t: 'moedas', x: 340, y: 405 }, { t: 'taca', x: 380, y: 405 }, p('moises', 600, 395)] } },
      { ref: '11:4-10', texto: 'Moisés avisou Faraó: “À meia-noite o SENHOR passará pelo Egito, e morrerão os primogênitos, desde o filho de Faraó até o filho da serva, e também os primeiros filhotes dos animais. Mas entre os israelitas nem um cão vai latir.” Moisés saiu irado da presença do rei. E Faraó não ouviu.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 40, h: 200 }, { t: 'lua', x: 660, y: 80 }, { t: 'palacio', x: 400, y: 380, s: .55 }, p('moises', 250, 398, { bracos: 'frente' }), p('farao', 470, 380, { espelho: true }), fala('À meia-noite…', 280, 230)] } },
    ],
    licao: 'Deus deu a Faraó aviso após aviso. A paciência de Deus é grande, mas recusar sempre a sua palavra tem consequências.',
    pergunta: 'Por que você acha que Deus avisa antes de agir?',
    versiculo: '11:7',
  };

  C[12] = {
    titulo: 'A Páscoa e a saída do Egito',
    personagens: ['Moisés', 'Arão', 'Os anciãos de Israel', 'Faraó'],
    cenas: [
      { ref: '12:1-13', veja: ['joao 1:29'], texto: 'Deus deu instruções para uma noite especial, a Páscoa. Cada família escolheria um cordeiro sem defeito, o sacrificaria e passaria o sangue nos batentes e na parte de cima da porta. Comeriam a carne assada, com pão sem fermento e ervas amargas, vestidos e prontos para partir. “Quando eu vir o sangue, passarei por cima de vocês.”',
        cena: { fundo: 'por-do-sol', el: [{ t: 'casa', x: 300, y: 392, sangue: true }, { t: 'ovelha', x: 470, y: 402, espelho: true }, p('h1', 410, 395, { bracos: 'frente' }), p('h3', 160, 395, { cajado: true }), rotulo('A Páscoa')] } },
      { ref: '12:14-28', texto: 'Aquele dia deveria ser lembrado para sempre, com a festa dos Pães sem Fermento durante sete dias. Moisés reuniu os anciãos e explicou o que fazer. E acrescentou: quando os filhos perguntarem “O que significa esta festa?”, respondam: “É a Páscoa do SENHOR, que passou por cima das nossas casas no Egito.” O povo se curvou e adorou.',
        cena: { fundo: 'interior', el: [{ t: 'mesa', x: 400, y: 420, s: 1.3 }, p('h1', 250, 395, { velho: true, bracos: 'frente' }), p('h3', 330, 395), { t: 'crianca', x: 470, y: 395, cor: '#6aa0c0', s: .6 }, p('h2', 560, 395, { espelho: true }), fala('O que significa\nesta festa?', 440, 260)] } },
      { ref: '12:29-36', texto: 'À meia-noite, o SENHOR feriu todos os primogênitos do Egito, do filho de Faraó ao do prisioneiro no calabouço. Houve um grande clamor, pois não havia casa sem um morto. Na mesma noite, Faraó chamou Moisés e Arão: “Saiam do meio do meu povo! Vão servir ao SENHOR e abençoem a mim também.” Os egípcios deram ao povo prata, ouro e roupas.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 30, h: 180 }, { t: 'casa', x: 160, y: 395, sangue: true }, { t: 'palacio', x: 560, y: 380, s: .5 }, p('farao', 540, 380, { espelho: true, bracos: 'rosto', triste: true }), fala('Saiam! Vão!', 420, 230)] } },
      { ref: '12:37-51', texto: 'Os israelitas partiram de Ramessés para Sucote, cerca de seiscentos mil homens a pé, além das mulheres e crianças, junto com muita gente de outros povos e muitos rebanhos. Levaram a massa de pão ainda sem fermento. Eles tinham morado no Egito por 430 anos e, naquele mesmo dia, o SENHOR os tirou de lá.',
        cena: { fundo: 'aurora', el: [{ t: 'piramide', x: 100, y: 370, s: .6 }, ...povo(220, 395, 9, { anim: 'andar' }), { t: 'ovelha', x: 680, y: 405, anim: 'andar' }, { t: 'camelo', x: 740, y: 402, anim: 'andar', s: .8 }, rotulo('430 anos · 600 mil homens')] } },
    ],
    licao: 'Na Páscoa, o sangue do cordeiro protegeu quem estava em casa. O Novo Testamento chama Jesus de “nosso Cordeiro pascal”: a libertação do Egito aponta para uma libertação ainda maior.',
    pergunta: 'Por que Deus quis que a Páscoa fosse contada às crianças de geração em geração?',
    versiculo: '12:13',
  };

  C[13] = {
    titulo: 'A coluna de nuvem e de fogo',
    personagens: ['Moisés', 'O povo de Israel'],
    cenas: [
      { ref: '13:1-16', texto: 'Deus pediu que todo primogênito fosse consagrado a ele, lembrando que o SENHOR libertou o povo com mão forte. Moisés ensinou: “Lembrem-se deste dia. Quando seus filhos perguntarem, contem o que o SENHOR fez quando nos tirou do Egito.”',
        cena: { fundo: 'dia', el: [p('moises', 380, 395, { bracos: 'aberto' }), ...povo(140, 398, 4), { t: 'bebe', x: 520, y: 400 }, p('h3', 580, 395, { espelho: true }), luz(400, -40, { opacidade: .5 })] } },
      { ref: '13:17-22', texto: 'Deus não levou o povo pelo caminho mais curto, pela terra dos filisteus, para que não desanimassem diante de uma guerra e quisessem voltar. Foram pelo deserto, rumo ao mar Vermelho. Moisés levou os ossos de José, como ele tinha pedido. O SENHOR ia à frente deles: de dia numa coluna de nuvem e, de noite, numa coluna de fogo.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'coluna', x: 560, y: 380 }, { t: 'coluna', x: 660, y: 385, fogo: true }, ...povo(120, 398, 6, { anim: 'andar' }), { t: 'carroca', x: 440, y: 405, s: .8 }, rotulo('Nuvem de dia · fogo de noite')] } },
    ],
    licao: 'Deus guiou o povo por um caminho mais longo para protegê-lo. Nem sempre o caminho mais curto é o melhor, e Deus nunca deixou o povo sem direção.',
    pergunta: 'Você já percebeu que um “desvio” na sua vida foi, na verdade, proteção de Deus?',
    versiculo: '13:21',
  };

  C[14] = {
    titulo: 'A travessia do mar Vermelho',
    personagens: ['Moisés', 'O povo de Israel', 'Faraó e seu exército'],
    cenas: [
      { ref: '14:1-14', texto: 'Faraó se arrependeu de ter libertado os escravos e perseguiu o povo com seiscentos carros escolhidos. Encurralados entre o mar e o exército, os israelitas se apavoraram: “Era melhor servir aos egípcios!” Moisés respondeu: “Não tenham medo! Fiquem firmes e vejam o livramento do SENHOR. O SENHOR lutará por vocês.”',
        cena: { fundo: 'mar', el: [...povo(140, 398, 4, { triste: true, bracos: 'rosto' }), p('moises', 380, 395, { bracos: 'cima' }), { t: 'carroca', x: 620, y: 395, espelho: true }, { t: 'carroca', x: 730, y: 400, espelho: true, s: .8 }, fala('O SENHOR lutará\npor vocês!', 340, 200), rotulo('600 carros')] } },
      { ref: '14:15-22', veja: ['1corintios 10:1-2', 'hebreus 11:29'], texto: 'Deus disse: “Erga a sua vara e estenda a mão sobre o mar.” A coluna de nuvem se pôs entre os israelitas e os egípcios. Moisés estendeu a mão, e um forte vento do oriente soprou a noite inteira, abrindo o mar. Os israelitas atravessaram em terra seca, com as águas como um muro à direita e à esquerda!',
        cena: { fundo: 'ceu', el: [{ t: 'mar-aberto', x: 400, y: 450 }, ...povo(350, 330, 3, { s: .55, anim: 'andar' }), p('moises', 400, 440, { bracos: 'cima', s: .9 }), luz(400, -40, { opacidade: .6 })] } },
      { ref: '14:23-31', texto: 'Os egípcios entraram no mar atrás deles, mas as rodas dos carros travaram. Ao amanhecer, Moisés estendeu a mão de novo, e as águas voltaram, cobrindo todo o exército de Faraó. Naquele dia, o SENHOR salvou Israel. O povo viu o grande poder de Deus, temeu ao SENHOR e creu nele e em Moisés, seu servo.',
        cena: { fundo: 'aurora', el: [{ t: 'agua', x: 0, y: 380, cor: '#2f6fa3', cor2: '#285f8e' }, { t: 'carroca', x: 560, y: 420, opacidade: .5 }, ...povo(100, 398, 4, { bracos: 'cima' }), p('moises', 320, 395, { bracos: 'frente' })] } },
    ],
    licao: 'Quando não havia saída, Deus abriu um caminho onde ninguém imaginava. “O SENHOR lutará por vocês” é uma das promessas mais consoladoras da Bíblia.',
    pergunta: 'Que “mar Vermelho” está na sua frente hoje? O que significa “ficar firme e ver o livramento do SENHOR”?',
    versiculo: '14:14',
  };

  C[15] = {
    titulo: 'O cântico de Moisés e as águas de Mara',
    personagens: ['Moisés', 'Miriã', 'O povo de Israel'],
    cenas: [
      { ref: '15:1-21', texto: 'Do outro lado do mar, Moisés e o povo cantaram ao SENHOR: “O SENHOR é a minha força e a minha canção; ele é a minha salvação! Quem é como tu, SENHOR?” Miriã, a profetisa, irmã de Arão, pegou um pandeiro, e todas as mulheres a seguiram dançando: “Cantem ao SENHOR, pois triunfou gloriosamente!”',
        cena: { fundo: 'dia', el: [{ t: 'agua', x: 0, y: 420, h: 40 }, p('miria', 280, 392, { bracos: 'cima', anim: 'pulsar' }), p('h3', 200, 395, { bracos: 'cima' }), p('h5', 360, 395, { bracos: 'cima' }), p('moises', 540, 392, { bracos: 'cima' }), ...povo(600, 398, 3, { bracos: 'cima' }),
          fala('Cantem ao SENHOR!', 200, 230)] } },
      { ref: '15:22-27', texto: 'Depois de três dias no deserto sem achar água, chegaram a Mara, mas a água era amarga. O povo reclamou: “O que vamos beber?” Moisés clamou ao SENHOR, que lhe mostrou uma árvore; ele a jogou na água, e a água ficou doce. Deus disse: “Eu sou o SENHOR que te sara.” Depois chegaram a Elim, onde havia doze fontes e setenta palmeiras.',
        cena: { fundo: 'deserto', el: [{ t: 'rio', x: 300, y: 405, s: .7 }, { t: 'arvore', x: 300, y: 395, s: .5, cor: '#6a8a3a' }, p('moises', 200, 395, { bracos: 'frente' }), { t: 'palmeira', x: 560, y: 380 }, { t: 'palmeira', x: 640, y: 384, s: .9 }, { t: 'palmeira', x: 720, y: 380 }, rotulo('Mara → Elim: 12 fontes, 70 palmeiras')] } },
    ],
    licao: 'O mesmo povo que cantou louvores reclamou três dias depois. Deus respondeu com paciência e se revelou como “o SENHOR que te sara”.',
    pergunta: 'Por que é tão fácil passar do louvor à reclamação? Como guardar na memória o que Deus já fez?',
    versiculo: '15:2',
  };

  C[16] = {
    titulo: 'Codornizes e maná: pão do céu',
    personagens: ['Moisés', 'Arão', 'O povo de Israel'],
    cenas: [
      { ref: '16:1-12', texto: 'Um mês depois da saída do Egito, no deserto de Sim, o povo reclamou: “No Egito tínhamos panelas de carne e pão à vontade! Vocês nos trouxeram aqui para morrer de fome!” Deus respondeu: “Vou fazer chover pão do céu.” A glória do SENHOR apareceu na nuvem, e ele prometeu carne ao entardecer e pão pela manhã.',
        cena: { fundo: 'deserto', el: [{ t: 'nuvem', x: 560, y: 110, s: 1.3, anim: 'flutuar' }, luz(560, 90, { r: 260, nucleo: 50, opacidade: .6 }), ...povo(120, 398, 5, { bracos: 'aberto' }), p('moises', 440, 395), p('arao', 520, 395, { espelho: true }), fala('No Egito tínhamos\ncomida à vontade!', 60, 220)] } },
      { ref: '16:13-21', veja: ['joao 6:35'], texto: 'À tarde vieram codornizes e cobriram o acampamento. De manhã, quando o orvalho secou, havia no chão uma coisa fina, como flocos. O povo perguntou: “Que é isto?” Moisés explicou: “É o pão que o SENHOR deu para vocês comerem.” Cada um recolhia o necessário para o dia; quem tentou guardar para o dia seguinte achou o maná podre e com bichos.',
        cena: { fundo: 'aurora', el: [{ t: 'mana', x: 400, y: 410, w: 700, n: 90 }, ...povo(160, 398, 4, { bracos: 'frente' }), { t: 'cesto', x: 460, y: 405 }, { t: 'passaro', x: 560, y: 160, anim: 'voar' }, { t: 'passaro', x: 640, y: 120, anim: 'voar', atraso: 1 }, fala('Que é isto?', 160, 250)] } },
      { ref: '16:22-36', texto: 'No sexto dia, recolhiam o dobro, porque o sétimo dia era o sábado, dia de descanso consagrado ao SENHOR. Nesse dia, o maná guardado não estragava, e no campo não caía nada. O pão se chamou maná: era branco como semente de coentro e tinha gosto de bolo com mel. Uma porção foi guardada num vaso, como lembrança. Israel comeu maná durante quarenta anos.',
        cena: { fundo: 'dia', el: [{ t: 'tenda', x: 200, y: 385 }, { t: 'tenda', x: 600, y: 388, cor: '#8a6a4a' }, ...povo(300, 398, 4, { bracos: 'orando' }), { t: 'cesto', x: 520, y: 405 }, rotulo('Sábado: dia de descanso'), luz(400, -40, { opacidade: .4 })] } },
    ],
    licao: 'Deus sustentou o povo todos os dias, ensinando a confiar nele para o pão de cada dia e a respeitar o descanso. Jesus se apresentou como “o pão da vida”.',
    pergunta: 'O que o maná, que não podia ser acumulado, ensina sobre confiança em Deus?',
    versiculo: '16:4',
  };

  C[17] = {
    titulo: 'Água da rocha e a vitória sobre Amaleque',
    personagens: ['Moisés', 'Arão', 'Hur', 'Josué', 'Os amalequitas'],
    cenas: [
      { ref: '17:1-7', texto: 'Em Refidim não havia água, e o povo brigou com Moisés: “Dê-nos água!” Moisés clamou: “Que farei com este povo? Daqui a pouco vão me apedrejar!” Deus mandou que ele batesse na rocha de Horebe com a vara. Saiu água e o povo bebeu. O lugar se chamou Massá e Meribá, porque o povo pôs Deus à prova: “O SENHOR está ou não está no meio de nós?”',
        cena: { fundo: 'deserto', el: [{ t: 'rocha', x: 470, y: 398, agua: true, s: 1.2 }, p('moises', 330, 395, { bracos: 'frente' }), ...povo(100, 398, 4, { bracos: 'aberto' }), luz(470, -40, { opacidade: .5 })] } },
      { ref: '17:8-16', texto: 'Os amalequitas atacaram Israel. Josué foi lutar, e Moisés subiu ao alto do monte com Arão e Hur. Enquanto Moisés mantinha as mãos levantadas, Israel vencia; quando as baixava, Amaleque vencia. Como as mãos dele ficaram pesadas, Arão e Hur o fizeram sentar numa pedra e seguraram suas mãos até o pôr do sol. Josué venceu, e Moisés construiu um altar: “O SENHOR é minha bandeira.”',
        cena: { fundo: 'montanha', el: [{ t: 'pedras', x: 400, y: 250, s: .5 }, p('moises', 400, 250, { bracos: 'cima', s: .8, pose: 'ajoelhado' }), p('arao', 350, 255, { bracos: 'cima', s: .75 }), p('hur', 450, 255, { bracos: 'cima', s: .75 }),
          p('josue', 260, 400, { bracos: 'cima', cajado: true }), p('h2', 180, 400, { bracos: 'cima' }), p('egipcio', 560, 400, { cor: '#6a4a3a', espelho: true, cajado: true }), rotulo('O SENHOR é minha bandeira')] } },
    ],
    licao: 'A vitória veio de Deus, e também do trabalho em equipe: Josué lutando, Moisés orando, Arão e Hur sustentando. Ninguém precisa carregar tudo sozinho.',
    pergunta: 'Quem são os “Arão e Hur” que seguram suas mãos quando você se cansa? De quem você pode ser apoio?',
    versiculo: '17:12',
  };

  C[18] = {
    titulo: 'O conselho de Jetro',
    personagens: ['Moisés', 'Jetro', 'Zípora', 'Gérson', 'Eliézer'],
    cenas: [
      { ref: '18:1-12', texto: 'Jetro, sogro de Moisés, ouviu tudo o que Deus tinha feito e foi ao deserto levando Zípora e os dois filhos de Moisés, Gérson e Eliézer. Moisés foi recebê-lo com alegria e contou como o SENHOR libertou Israel. Jetro louvou: “Agora sei que o SENHOR é maior que todos os deuses!” E ofereceu sacrifícios a Deus.',
        cena: { fundo: 'deserto', el: [{ t: 'tenda', x: 640, y: 385 }, p('jetro', 300, 395, { bracos: 'aberto' }), p('moises', 400, 395, { espelho: true, bracos: 'aberto' }), p('zipora', 210, 395), p('h2', 150, 398, { s: .7, barba: false }), p('h4', 110, 398, { s: .65, barba: false }), fala('O SENHOR é maior\nque todos os deuses!', 120, 200)] } },
      { ref: '18:13-27', texto: 'No dia seguinte, Jetro viu Moisés julgando as causas do povo da manhã até a noite. Ele aconselhou: “Isso não está bom. Você vai se esgotar! Escolha homens capazes, que temam a Deus, sejam honestos e odeiem o suborno, e coloque-os como chefes de mil, de cem, de cinquenta e de dez. Eles resolvem as causas pequenas, e você, as difíceis.” Moisés ouviu o sogro.',
        cena: { fundo: 'deserto', el: [{ t: 'pedras', x: 400, y: 405, s: .4 }, p('moises', 400, 395, { bracos: 'frente' }), ...povo(470, 398, 6), p('jetro', 230, 395, { bracos: 'frente' }), fala('Você vai se esgotar!\nDivida o trabalho.', 60, 220)] } },
    ],
    licao: 'Até grandes líderes precisam de conselho. Moisés teve humildade para ouvir o sogro e aprendeu a dividir responsabilidades.',
    pergunta: 'Você aceita conselhos com facilidade? Que tarefa você poderia dividir com outras pessoas?',
    versiculo: '18:21',
  };

  C[19] = {
    titulo: 'No monte Sinai',
    personagens: ['Moisés', 'Arão', 'O povo de Israel'],
    cenas: [
      { ref: '19:1-8', texto: 'No terceiro mês após a saída do Egito, o povo chegou ao deserto do Sinai e acampou diante do monte. Deus disse: “Vocês viram como os carreguei sobre asas de águia e os trouxe a mim. Se obedecerem à minha aliança, serão o meu tesouro especial, um reino de sacerdotes e uma nação santa.” O povo respondeu: “Faremos tudo o que o SENHOR disse.”',
        cena: { fundo: 'montanha', el: [luz(430, 90, { r: 360, nucleo: 50, opacidade: .6 }), { t: 'tenda', x: 160, y: 390, s: .8 }, ...povo(280, 400, 6, { bracos: 'cima' }), fala('Faremos tudo o que\no SENHOR disse!', 300, 220), rotulo('Monte Sinai')] } },
      { ref: '19:9-25', texto: 'O povo se preparou por três dias e lavou suas roupas. Foram marcados limites ao redor do monte, que ninguém podia ultrapassar. No terceiro dia, houve trovões, relâmpagos, uma nuvem espessa e um som de trombeta muito forte. O monte Sinai fumegava, porque o SENHOR desceu sobre ele em fogo, e o monte inteiro tremia. Moisés subiu ao encontro de Deus.',
        cena: { fundo: 'tempestade', el: [{ t: 'montanha', x: 430, y: 380, w: 520, h: 300, cor: '#5a5a66' }, { t: 'nuvem', x: 430, y: 90, cor: '#3a3a44', s: 1.6, anim: 'flutuar' }, { t: 'fogo', x: 430, y: 110, s: 1.4 }, luz(430, 70, { r: 300, nucleo: 40, opacidade: .6 }),
          ...povo(80, 410, 4, { bracos: 'rosto', s: .7 }), p('moises', 640, 405, { s: .7, anim: 'subir' })] } },
    ],
    licao: 'Deus primeiro salvou o povo e só depois deu a Lei. A obediência não é o preço da salvação, mas a resposta de quem foi libertado. E Deus é santo: aproximar-se dele exige reverência.',
    pergunta: 'O que significa ser “um reino de sacerdotes e uma nação santa” no dia a dia?',
    versiculo: '19:5',
  };

  C[20] = {
    titulo: 'Os Dez Mandamentos',
    personagens: ['Deus', 'Moisés', 'O povo de Israel'],
    cenas: [
      { ref: '20:1-11', texto: 'Deus falou: “Eu sou o SENHOR teu Deus, que te tirei do Egito, da casa da escravidão.” E deu os mandamentos sobre a relação com ele: não ter outros deuses; não fazer imagens para adorar; não usar o nome do SENHOR em vão; lembrar-se do dia de descanso, porque em seis dias o SENHOR fez o céu e a terra e descansou no sétimo.',
        cena: { fundo: 'montanha', el: [luz(400, 40, { r: 420, nucleo: 60 }), { t: 'tabuas', x: 400, y: 330, s: 1.6, anim: 'surgir' }, p('moises', 250, 398, { bracos: 'cima' }), rotulo('Mandamentos 1 a 4: amar a Deus')] } },
      { ref: '20:12-17', veja: ['mateus 22:37-40'], texto: 'Depois vieram os mandamentos sobre a relação com o próximo: honrar pai e mãe; não matar; não adulterar; não roubar; não dar falso testemunho; não cobiçar o que é do próximo. São dez “palavras” que resumem como amar a Deus e as pessoas.',
        cena: { fundo: 'dia', el: [{ t: 'tabuas', x: 400, y: 260, s: 1.2 }, p('h1', 200, 395, { velho: true }), { t: 'crianca', x: 260, y: 395, cor: '#6aa0c0', s: .6 }, p('h3', 320, 395), p('h2', 520, 395, { espelho: true, bracos: 'aberto' }), p('h4', 600, 395, { espelho: true, bracos: 'aberto' }), rotulo('Mandamentos 5 a 10: amar o próximo')] } },
      { ref: '20:18-26', texto: 'O povo viu os trovões, os relâmpagos, o som da trombeta e o monte fumegando, e tremeu de medo. Pediram a Moisés: “Fale você conosco, e nós ouviremos; mas que Deus não fale conosco, senão morreremos.” Moisés respondeu: “Não tenham medo. Deus veio para que vocês o temam e não pequem.” Deus também orientou sobre um altar simples, de terra ou de pedras não lavradas.',
        cena: { fundo: 'tempestade', el: [{ t: 'montanha', x: 600, y: 380, w: 360, h: 260, cor: '#5a5a66' }, { t: 'fogo', x: 600, y: 140 }, ...povo(80, 400, 5, { bracos: 'rosto' }), p('moises', 400, 398, { bracos: 'aberto' }), fala('Não tenham medo!', 380, 230)] } },
    ],
    licao: 'Os mandamentos começam com a graça: “Eu te tirei da escravidão.” Eles mostram o caminho da liberdade: amar a Deus acima de tudo e ao próximo como a nós mesmos (Mateus 22:37-40).',
    pergunta: 'Qual dos Dez Mandamentos você acha mais difícil de viver hoje? Por quê?',
    versiculo: '20:2-3',
  };

  C[21] = {
    titulo: 'Leis para uma sociedade justa (1)',
    personagens: ['Moisés', 'O povo de Israel'],
    cenas: [
      { ref: '21:1-11', texto: 'Deus deu a Moisés leis práticas para organizar a vida do povo. As primeiras protegiam os mais vulneráveis: um servo hebreu trabalharia seis anos e, no sétimo, sairia livre, sem pagar nada. Mulheres em situação de servidão também tinham direitos garantidos.',
        cena: { fundo: 'dia', el: [p('moises', 300, 395, { bracos: 'frente' }), p('h1', 470, 395, { espelho: true, bracos: 'cima' }), { t: 'tenda', x: 640, y: 385 }, rotulo('7º ano: liberdade'), luz(400, -40, { opacidade: .4 })] } },
      { ref: '21:12-36', texto: 'Outras leis tratavam de violência e danos: tirar uma vida era muito grave, mas havia diferença entre o crime planejado e o acidente. O princípio “olho por olho, dente por dente” limitava a punição ao tamanho do dano, para evitar vinganças sem fim. Os donos também respondiam pelos danos causados pelos seus animais.',
        cena: { fundo: 'dia', el: [p('moises', 400, 395, { bracos: 'aberto' }), p('h2', 250, 395, { bracos: 'frente' }), p('h4', 550, 395, { espelho: true, bracos: 'frente' }), { t: 'vaca', x: 680, y: 400, espelho: true }, rotulo('Justiça na medida certa')] } },
    ],
    licao: 'A Lei de Deus protegia os fracos e colocava limites à vingança. Justiça, para Deus, não é revanche: é proporção, responsabilidade e proteção da vida.',
    pergunta: 'Por que limitar a punição ao tamanho do dano foi um avanço para a justiça?',
    versiculo: '21:2',
  };

  C[22] = {
    titulo: 'Leis para uma sociedade justa (2)',
    personagens: ['Moisés', 'O povo de Israel', 'Estrangeiros, viúvas e órfãos'],
    cenas: [
      { ref: '22:1-15', texto: 'Quem roubasse ou causasse prejuízo devia restituir, às vezes várias vezes o valor. Havia regras para quem cuidasse dos bens ou dos animais de outra pessoa, e para o que fosse emprestado. A honestidade nos negócios fazia parte da fidelidade a Deus.',
        cena: { fundo: 'dia', el: [p('h1', 280, 395, { bracos: 'frente' }), { t: 'ovelha', x: 380, y: 402 }, { t: 'ovelha', x: 430, y: 406, s: .9 }, p('h2', 540, 395, { espelho: true }), { t: 'moedas', x: 480, y: 405 }, rotulo('Restituir o que foi tirado')] } },
      { ref: '22:16-31', texto: 'Deus mandou proteger os mais frágeis: “Não maltrate o estrangeiro, pois vocês foram estrangeiros no Egito. Não aflija a viúva nem o órfão; se clamarem a mim, eu os ouvirei.” Não se cobravam juros do pobre, e o manto dado como garantia devia ser devolvido antes do pôr do sol, porque era o seu cobertor. Também havia leis contra feitiçaria e idolatria.',
        cena: { fundo: 'por-do-sol', el: [p('h3', 260, 395, { veu: '#6a6a6a', cor: '#4a4a4a' }), { t: 'crianca', x: 320, y: 395, cor: '#8a7a6a', s: .6 }, p('h1', 480, 395, { espelho: true, bracos: 'frente' }), { t: 'tunica', x: 400, y: 380, s: .5 }, luz(300, -40, { opacidade: .5 }), rotulo('Deus ouve o clamor do fraco')] } },
    ],
    licao: 'O cuidado com o estrangeiro, a viúva, o órfão e o pobre está no coração da Lei. A forma como tratamos os vulneráveis mostra se conhecemos a Deus.',
    pergunta: 'Quem são hoje “o estrangeiro, a viúva e o órfão” ao seu redor? Como cuidar deles?',
    versiculo: '22:21',
  };

  C[23] = {
    titulo: 'Justiça, descanso e festas',
    personagens: ['Moisés', 'O povo de Israel', 'O anjo do SENHOR'],
    cenas: [
      { ref: '23:1-9', texto: 'Nos tribunais, ninguém devia espalhar boatos, dar falso testemunho, seguir a maioria para fazer o mal nem aceitar suborno. Havia até uma lei de bondade com o inimigo: “Se encontrar o boi ou o jumento do seu inimigo perdido, leve-o de volta; se o jumento dele cair com a carga, ajude a levantá-lo.”',
        cena: { fundo: 'dia', el: [p('h2', 300, 395, { bracos: 'frente' }), { t: 'camelo', x: 430, y: 400, s: .9 }, p('h4', 560, 395, { espelho: true, triste: true }), rotulo('Ajudar até o inimigo')] } },
      { ref: '23:10-19', texto: 'A terra seria cultivada por seis anos e descansaria no sétimo, e o que nascesse sozinho ficaria para os pobres e os animais. Também o sábado era descanso para servos, estrangeiros e animais. Três vezes por ano o povo celebraria festas ao SENHOR: a dos Pães sem Fermento, a da Colheita e a do fim da colheita.',
        cena: { fundo: 'dia', el: [{ t: 'trigo', x: 200, y: 400, n: 9 }, { t: 'trigo', x: 340, y: 402, n: 7 }, ...povo(430, 398, 4, { bracos: 'cima' }), rotulo('3 festas ao ano')] } },
      { ref: '23:20-33', texto: 'Deus prometeu: “Envio um anjo à sua frente para guardá-los no caminho e levá-los ao lugar que preparei. Obedeçam a ele.” Os povos de Canaã seriam expulsos pouco a pouco, para que a terra não ficasse abandonada. Mas Israel não devia fazer aliança com os deuses deles.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'anjo', x: 560, y: 390 }, ...povo(160, 398, 6, { anim: 'andar' }), { t: 'colina', x: 700, y: 410, w: 200, h: 50, cor: '#5a7a4a' }] } },
    ],
    licao: 'Para Deus, justiça inclui a verdade nos tribunais, a bondade com o inimigo, o descanso, a generosidade com os pobres e a alegria das festas.',
    pergunta: 'Ajudar o jumento do inimigo: o que essa lei antiga ensina para os nossos conflitos de hoje?',
    versiculo: '23:4-5',
  };

  C[24] = {
    titulo: 'A aliança é selada',
    personagens: ['Moisés', 'Arão', 'Nadabe', 'Abiú', 'Os setenta anciãos', 'Josué'],
    cenas: [
      { ref: '24:1-8', veja: ['mateus 26:28', 'hebreus 9:19-20'], texto: 'Moisés contou ao povo todas as palavras do SENHOR, e todos responderam: “Faremos tudo o que o SENHOR disse.” Ele escreveu as palavras, construiu um altar ao pé do monte e ergueu doze colunas, uma para cada tribo. Leu o Livro da Aliança e aspergiu sangue sobre o povo: “Este é o sangue da aliança que o SENHOR fez com vocês.”',
        cena: { fundo: 'montanha', el: [{ t: 'altar', x: 400, y: 390 }, ...Array.from({ length: 12 }, (_, i) => ({ t: 'pedras', x: 120 + i * 50 + (i > 5 ? 120 : 0), y: 405, s: .25 })), p('moises', 300, 395, { bracos: 'cima' }), ...povo(470, 400, 4, { bracos: 'orando' }), rotulo('12 colunas: 12 tribos')] } },
      { ref: '24:9-18', texto: 'Moisés, Arão, Nadabe, Abiú e setenta anciãos subiram e viram a glória do Deus de Israel: debaixo dos seus pés havia algo como um piso de safira, claro como o céu. Eles comeram e beberam na presença de Deus. Depois Moisés subiu com Josué; a nuvem cobriu o monte, e a glória do SENHOR parecia um fogo. Moisés ficou no monte quarenta dias e quarenta noites.',
        cena: { fundo: 'montanha', el: [{ t: 'nuvem', x: 430, y: 120, s: 1.8, cor: '#e8e8f0', anim: 'flutuar' }, { t: 'fogo', x: 430, y: 130, s: 1.2 }, luz(430, 60, { r: 380 }), p('moises', 430, 300, { s: .6, bracos: 'cima' }), p('josue', 330, 380, { s: .7 }), ...povo(80, 410, 4, { s: .6 }), rotulo('40 dias e 40 noites')] } },
    ],
    licao: 'A aliança foi selada com sangue e celebrada com uma refeição na presença de Deus. Jesus, na última ceia, falou do cálice como “o sangue da nova aliança”.',
    pergunta: 'O que significa para você ter uma aliança, um compromisso de amor, com Deus?',
    versiculo: '24:7',
  };

  C[25] = {
    titulo: 'Um lugar para Deus habitar: a arca, a mesa e o candelabro',
    personagens: ['Moisés', 'Deus'],
    cenas: [
      { ref: '25:1-9', veja: ['joao 1:14'], texto: 'No monte, Deus pediu ofertas voluntárias, dadas de coração: ouro, prata, bronze, tecidos, madeira de acácia, azeite, perfumes e pedras preciosas. E explicou o motivo: “Façam para mim um santuário, e eu habitarei no meio deles.” Tudo devia seguir o modelo que Deus mostrou.',
        cena: { fundo: 'dia', el: [...povo(140, 398, 4, { bracos: 'frente' }), { t: 'moedas', x: 400, y: 405 }, { t: 'saco', x: 460, y: 405 }, { t: 'taca', x: 510, y: 405 }, p('moises', 620, 395, { espelho: true }), fala('Eu habitarei no\nmeio deles.', 480, 200), luz(400, -40, { opacidade: .5 })] } },
      { ref: '25:10-22', texto: 'O objeto mais sagrado seria a arca da aliança: uma caixa de acácia coberta de ouro, carregada com varas. Dentro ficariam as tábuas da Lei. A tampa, chamada propiciatório, teria dois querubins de ouro com as asas estendidas. “Ali eu me encontrarei com você”, disse Deus.',
        cena: { fundo: 'interior', el: [{ t: 'arca-alianca', x: 400, y: 395, s: 1.6 }, rotulo('A arca da aliança')] } },
      { ref: '25:23-40', texto: 'Também haveria uma mesa coberta de ouro para os pães colocados diante de Deus, e um candelabro de ouro puro com sete lâmpadas, decorado com flores de amendoeira, para iluminar o santuário.',
        cena: { fundo: 'interior', el: [{ t: 'candelabro', x: 260, y: 395, s: 1.3 }, { t: 'mesa', x: 560, y: 400 }, rotulo('A mesa e o candelabro')] } },
    ],
    licao: 'O Deus santo quis morar no meio do seu povo. O Evangelho de João diz que Jesus “habitou entre nós”: Deus continua se aproximando de nós.',
    pergunta: 'O que significa para você que Deus quer habitar no meio do seu povo?',
    versiculo: '25:8',
  };

  C[26] = {
    titulo: 'O tabernáculo',
    personagens: ['Moisés'],
    cenas: [
      { ref: '26:1-30', texto: 'Deus descreveu o tabernáculo: uma grande tenda desmontável, feita de cortinas de linho azul, púrpura e vermelho, bordadas com querubins, coberta com peles e sustentada por tábuas de acácia revestidas de ouro, sobre bases de prata. Assim Deus poderia acompanhar o povo na caminhada pelo deserto.',
        cena: { fundo: 'deserto', el: [{ t: 'tabernaculo', x: 400, y: 400 }, ...povo(60, 402, 2, { s: .7 }), rotulo('O tabernáculo')] } },
      { ref: '26:31-37', veja: ['hebreus 10:19-20'], texto: 'Um véu bordado com querubins dividiria o interior em duas partes: o Lugar Santo, com a mesa e o candelabro, e o Santo dos Santos, onde ficaria a arca. O véu mostrava que Deus é santo e que o acesso a ele não é algo banal.',
        cena: { fundo: 'interior', el: [{ t: 'candelabro', x: 180, y: 395 }, { t: 'mesa', x: 330, y: 400, s: .7 }, { t: 'arca-alianca', x: 620, y: 395, s: 1.1 }, rotulo('Lugar Santo · Santo dos Santos')] } },
    ],
    licao: 'O véu separava o Santo dos Santos. Os Evangelhos contam que, quando Jesus morreu, o véu do templo se rasgou de alto a baixo: o caminho até Deus foi aberto.',
    pergunta: 'Por que o tabernáculo precisava ser uma tenda que se podia desmontar e levar?',
    versiculo: '26:33',
  };

  C[27] = {
    titulo: 'O altar e o pátio',
    personagens: ['Moisés', 'Arão e seus filhos'],
    cenas: [
      { ref: '27:1-8', texto: 'Na entrada ficaria o altar dos sacrifícios, feito de acácia e coberto de bronze, com quatro pontas nos cantos. Ali seriam oferecidos os sacrifícios do povo.',
        cena: { fundo: 'deserto', el: [{ t: 'altar', x: 400, y: 395, s: 1.6 }, p('h1', 250, 395, { bracos: 'frente' }), { t: 'ovelha', x: 560, y: 402, espelho: true }] } },
      { ref: '27:9-21', texto: 'Ao redor de tudo haveria um pátio cercado de cortinas de linho presas em colunas, com uma entrada colorida. E o povo traria azeite puro de oliva para que a lâmpada do candelabro ficasse sempre acesa diante do SENHOR, da tarde até a manhã.',
        cena: { fundo: 'por-do-sol', el: [{ t: 'tabernaculo', x: 400, y: 400 }, { t: 'candelabro', x: 680, y: 330, s: .5 }, rotulo('A lâmpada sempre acesa')] } },
    ],
    licao: 'O altar na entrada ensinava que o pecado tem um custo e que o perdão vem de Deus. A lâmpada sempre acesa lembrava que Deus nunca deixa seu povo nas trevas.',
    pergunta: 'O que a “lâmpada sempre acesa” pode simbolizar na sua vida com Deus?',
    versiculo: '27:20',
  };

  C[28] = {
    titulo: 'As vestes do sumo sacerdote',
    personagens: ['Arão', 'Nadabe', 'Abiú', 'Eleazar', 'Itamar'],
    cenas: [
      { ref: '28:1-14', texto: 'Deus escolheu Arão e seus filhos, Nadabe, Abiú, Eleazar e Itamar, para servirem como sacerdotes. Artesãos habilidosos fariam vestes santas para Arão, “para glória e beleza”. No éfode, uma espécie de colete, havia duas pedras de ônix nos ombros com os nomes das doze tribos de Israel.',
        cena: { fundo: 'interior', el: [p('araoSacerdote', 400, 395, { bracos: 'aberto' }), p('h2', 250, 398, { s: .8, cor: '#f2eee6' }), p('h4', 550, 398, { s: .8, cor: '#f2eee6', espelho: true }), rotulo('Sacerdotes')] } },
      { ref: '28:15-30', veja: ['hebreus 4:14-16'], texto: 'Sobre o peito, Arão usaria o peitoral do juízo, com doze pedras preciosas, cada uma com o nome de uma tribo. Assim, sempre que entrasse no santuário, ele levaria os nomes do povo sobre o coração, diante de Deus.',
        cena: { fundo: 'interior', el: [p('araoSacerdote', 400, 395, { s: 1.5, bracos: 'orando' }), luz(400, -40, { opacidade: .5 }), rotulo('12 pedras · 12 tribos')] } },
      { ref: '28:31-43', texto: 'O manto era todo azul, com romãs e sininhos de ouro na barra, que tocavam quando Arão se movia no santuário. Na frente do turbante havia uma placa de ouro com a inscrição: “SANTIDADE AO SENHOR”. Os filhos de Arão também receberiam túnicas e turbantes.',
        cena: { fundo: 'interior', el: [p('araoSacerdote', 400, 395, { bracos: 'aberto' }), { t: 'candelabro', x: 620, y: 395, s: .8 }, fala('SANTIDADE AO SENHOR', 420, 230)] } },
    ],
    licao: 'O sacerdote levava o povo “sobre o coração” diante de Deus. A carta aos Hebreus apresenta Jesus como o grande sumo sacerdote, que intercede por nós.',
    pergunta: 'Por quem você tem “levado no coração” diante de Deus em oração?',
    versiculo: '28:29',
  };

  C[29] = {
    titulo: 'A consagração dos sacerdotes',
    personagens: ['Moisés', 'Arão e seus filhos'],
    cenas: [
      { ref: '29:1-37', texto: 'Moisés deveria consagrar Arão e seus filhos numa cerimônia de sete dias: eles seriam lavados, vestidos com as roupas santas e ungidos com azeite. Também seriam oferecidos um novilho e dois carneiros, e o sangue seria colocado no altar e neles. Assim estariam separados para servir a Deus.',
        cena: { fundo: 'deserto', el: [{ t: 'altar', x: 600, y: 390 }, p('moises', 300, 395, { bracos: 'cima', cajado: false }), p('araoSacerdote', 400, 395, { pose: 'ajoelhado', bracos: 'orando' }), { t: 'ovelha', x: 500, y: 403, chifres: true }, rotulo('7 dias de consagração')] } },
      { ref: '29:38-46', texto: 'Todos os dias seriam oferecidos dois cordeiros: um pela manhã e outro ao entardecer. E Deus prometeu: “Habitarei no meio dos filhos de Israel e serei o seu Deus. Eles saberão que eu sou o SENHOR, que os tirei do Egito para habitar no meio deles.”',
        cena: { fundo: 'aurora', el: [{ t: 'tabernaculo', x: 400, y: 400 }, luz(500, -30, { opacidade: .6 }), fala('Habitarei no meio deles\ne serei o seu Deus.', 80, 160)] } },
    ],
    licao: 'O objetivo de tudo, da saída do Egito ao tabernáculo, era este: Deus habitar com o seu povo. Ele nos salvou para estar conosco.',
    pergunta: 'O sacrifício era oferecido toda manhã e toda tarde. Como você pode dedicar o começo e o fim do seu dia a Deus?',
    versiculo: '29:45-46',
  };

  C[30] = {
    titulo: 'Incenso, resgate e unção',
    personagens: ['Moisés', 'Arão'],
    cenas: [
      { ref: '30:1-10', texto: 'Diante do véu ficaria um pequeno altar de ouro para queimar incenso perfumado, toda manhã e toda tarde. O incenso subindo era um símbolo das orações do povo chegando a Deus.',
        cena: { fundo: 'interior', el: [{ t: 'tocha', x: 400, y: 400, s: 1.1 }, { t: 'nuvem', x: 400, y: 250, s: .6, cor: '#e0dcd0', anim: 'subir' }, p('araoSacerdote', 280, 395, { bracos: 'frente' }), rotulo('O altar do incenso')] } },
      { ref: '30:11-16', texto: 'Quando o povo fosse contado, cada pessoa daria meio siclo como oferta ao SENHOR, um resgate pela própria vida. Rico e pobre davam o mesmo valor: diante de Deus, todas as vidas têm o mesmo preço.',
        cena: { fundo: 'dia', el: [p('h1', 280, 395, { coroa: false, cor: '#7a4a8a', bracos: 'frente' }), p('h4', 520, 395, { cor: '#8a8070', espelho: true, bracos: 'frente' }), { t: 'moedas', x: 400, y: 405, s: .7 }, rotulo('Rico e pobre: meio siclo')] } },
      { ref: '30:17-38', texto: 'Uma bacia de bronze serviria para os sacerdotes lavarem as mãos e os pés antes de servir. Deus também ensinou a fazer um azeite santo para ungir o tabernáculo e os sacerdotes, e um incenso sagrado, que não podia ser copiado para uso comum.',
        cena: { fundo: 'deserto', el: [{ t: 'poco', x: 400, y: 400, s: .8 }, p('araoSacerdote', 280, 395, { bracos: 'frente' }), p('h2', 520, 395, { cor: '#f2eee6', espelho: true }), rotulo('A bacia de bronze')] } },
    ],
    licao: 'Oração, igualdade e pureza: o incenso, o meio siclo e a bacia ensinavam que aproximar-se de Deus é para todos, mas com coração sincero.',
    pergunta: 'O que o fato de ricos e pobres darem o mesmo valor ensina sobre como Deus nos vê?',
    versiculo: '30:15',
  };

  C[31] = {
    titulo: 'Bezalel, o sábado e as tábuas de pedra',
    personagens: ['Moisés', 'Bezalel', 'Aoliabe'],
    cenas: [
      { ref: '31:1-11', texto: 'Deus escolheu Bezalel, da tribo de Judá, e o encheu do Espírito de Deus, com sabedoria e habilidade para trabalhar com ouro, prata, bronze, pedras e madeira. Junto com ele estaria Aoliabe, da tribo de Dã. Eles e outros artesãos fariam tudo o que Deus mostrou.',
        cena: { fundo: 'interior', el: [p('bezalel', 330, 395, { bracos: 'frente' }), p('h2', 460, 395, { espelho: true, bracos: 'frente' }), { t: 'candelabro', x: 600, y: 395, s: .7 }, { t: 'moedas', x: 400, y: 405 }, luz(330, -40, { opacidade: .5 })] } },
      { ref: '31:12-18', texto: 'Deus lembrou que o sábado era um sinal entre ele e o povo para sempre, um dia santo de descanso. Ao terminar de falar com Moisés no Sinai, Deus lhe entregou as duas tábuas do testemunho, tábuas de pedra escritas pelo dedo de Deus.',
        cena: { fundo: 'montanha', el: [luz(400, 60, { r: 400 }), { t: 'tabuas', x: 400, y: 330, s: 1.4 }, p('moises', 290, 398, { bracos: 'frente' }), rotulo('Escritas pelo dedo de Deus')] } },
    ],
    licao: 'Talento artístico e trabalho manual também são dons do Espírito de Deus. E o descanso do sábado lembra que nossa identidade não está só no que produzimos.',
    pergunta: 'Que habilidade Deus te deu que pode ser usada para servir a ele e aos outros?',
    versiculo: '31:3',
  };

  C[32] = {
    titulo: 'O bezerro de ouro',
    personagens: ['Moisés', 'Arão', 'Josué', 'O povo de Israel', 'Os levitas'],
    cenas: [
      { ref: '32:1-6', texto: 'Moisés demorava no monte, e o povo pressionou Arão: “Faça-nos deuses que vão à nossa frente!” Arão recolheu os brincos de ouro, fez um bezerro de metal e construiu um altar diante dele. No dia seguinte, o povo ofereceu sacrifícios, comeu, bebeu e se levantou para se divertir.',
        cena: { fundo: 'deserto', el: [{ t: 'altar', x: 400, y: 400, fogo: false }, { t: 'vaca', x: 400, y: 345, cor: '#e8b830', s: .9, anim: 'brilhar' }, p('arao', 250, 395, { bracos: 'aberto', triste: true }), ...povo(480, 398, 5, { bracos: 'cima', anim: 'pulsar' })] } },
      { ref: '32:7-14', texto: 'Deus disse a Moisés: “Desça, porque o povo se corrompeu.” E ameaçou destruí-lo. Moisés intercedeu: “Por que destruir o povo que tiraste do Egito? Lembra-te de Abraão, Isaque e Israel, e das tuas promessas!” E o SENHOR desistiu do mal que tinha dito que faria ao seu povo.',
        cena: { fundo: 'montanha', el: [luz(400, 60, { r: 360, opacidade: .7 }), p('moises', 400, 398, { pose: 'ajoelhado', bracos: 'cima' }), { t: 'tabuas', x: 300, y: 400, s: .6 }, fala('Lembra-te das tuas\npromessas!', 450, 220)] } },
      { ref: '32:15-24', texto: 'Moisés desceu com as tábuas escritas por Deus. Josué ouviu barulho e pensou que era guerra, mas era cantoria. Quando Moisés viu o bezerro e as danças, ficou irado, jogou as tábuas e as quebrou ao pé do monte. Queimou o bezerro, moeu-o até virar pó e o espalhou na água. Arão se desculpou: “Joguei o ouro no fogo e saiu este bezerro.”',
        cena: { fundo: 'deserto', el: [{ t: 'tabuas', x: 360, y: 405, quebradas: true }, p('moises', 250, 395, { bracos: 'cima', cajado: false }), p('josue', 160, 395, { s: .9 }), { t: 'fogo', x: 560, y: 400 }, p('arao', 650, 395, { espelho: true, bracos: 'aberto', triste: true }), fala('Saiu este bezerro…', 520, 240)] } },
      { ref: '32:25-35', veja: ['romanos 9:3'], texto: 'O povo estava descontrolado. Moisés chamou: “Quem é do SENHOR venha até mim!”, e os levitas se juntaram a ele. Houve um juízo duro, e cerca de três mil homens morreram naquele dia. Depois, Moisés voltou a Deus e orou: “Perdoa o pecado deles; se não, apaga-me do teu livro.” Deus mandou que ele continuasse guiando o povo.',
        cena: { fundo: 'por-do-sol', el: [p('moises', 400, 398, { pose: 'ajoelhado', bracos: 'orando', triste: true }), luz(400, -40, { opacidade: .5 }), ...povo(90, 400, 3, { triste: true }), fala('Perdoa o pecado deles…', 430, 230)] } },
    ],
    licao: 'Pouco depois de prometer fidelidade, o povo trocou Deus por um ídolo feito por mãos humanas. Moisés intercedeu a ponto de oferecer a própria vida: um retrato do amor de quem se coloca entre Deus e o povo.',
    pergunta: 'Que “bezerros de ouro” as pessoas fabricam hoje quando Deus parece demorar?',
    versiculo: '32:31-32',
  };

  C[33] = {
    titulo: '“Mostra-me a tua glória”',
    personagens: ['Moisés', 'Josué', 'Deus'],
    cenas: [
      { ref: '33:1-11', texto: 'Deus disse que mandaria um anjo, mas que ele mesmo não iria no meio de um povo tão teimoso. O povo ficou de luto e tirou seus enfeites. Moisés armava uma tenda fora do acampamento, a Tenda do Encontro; quando entrava, a coluna de nuvem descia à porta, e o SENHOR falava com Moisés face a face, como quem fala com um amigo. O jovem Josué não saía da tenda.',
        cena: { fundo: 'deserto', el: [{ t: 'tenda', x: 500, y: 390, s: 1.2, cor: '#8a6a4a' }, { t: 'coluna', x: 590, y: 380 }, p('moises', 420, 395, { bracos: 'orando' }), p('josue', 340, 395, { s: .9 }), ...povo(60, 400, 3, { s: .7, bracos: 'orando' }), rotulo('Face a face, como um amigo')] } },
      { ref: '33:12-23', texto: 'Moisés pediu: “Se a tua presença não for conosco, não nos faças sair daqui.” Deus respondeu: “A minha presença irá com você, e eu lhe darei descanso.” Moisés ainda pediu: “Mostra-me a tua glória.” Deus disse que ninguém pode ver o seu rosto e viver, mas o colocou numa fenda da rocha, cobriu-o com a mão e deixou que visse as suas costas quando a glória passasse.',
        cena: { fundo: 'montanha', el: [{ t: 'rocha', x: 400, y: 400, s: 1.8 }, p('moises', 390, 380, { s: .8, bracos: 'rosto' }), luz(560, 120, { r: 460, nucleo: 120 }), fala('A minha presença irá\ncom você.', 470, 210)] } },
    ],
    licao: 'Moisés sabia que a maior bênção não é a terra prometida, mas a presença de Deus. Ele desejou conhecer mais a Deus, e Deus se revelou na medida que um ser humano pode suportar.',
    pergunta: 'O que você deseja mais: as bênçãos de Deus ou a presença de Deus?',
    versiculo: '33:14',
  };

  C[34] = {
    titulo: 'A aliança renovada e o rosto que brilhava',
    personagens: ['Moisés', 'Deus', 'Arão', 'O povo de Israel'],
    cenas: [
      { ref: '34:1-9', texto: 'Deus mandou Moisés preparar duas novas tábuas de pedra. No monte, o SENHOR desceu na nuvem e passou diante dele proclamando: “SENHOR, SENHOR, Deus misericordioso e piedoso, tardio para se irar e grande em bondade e fidelidade, que perdoa a maldade, a rebelião e o pecado.” Moisés se curvou até o chão e pediu que Deus fosse no meio do povo e o perdoasse.',
        cena: { fundo: 'montanha', el: [{ t: 'nuvem', x: 430, y: 120, s: 1.6, anim: 'flutuar' }, luz(430, 80, { r: 420 }), { t: 'tabuas', x: 520, y: 400, s: .8 }, p('moises', 380, 398, { pose: 'ajoelhado', bracos: 'orando' }), rotulo('Misericordioso e piedoso')] } },
      { ref: '34:10-28', texto: 'Deus renovou a aliança e prometeu fazer maravilhas nunca vistas. Repetiu as orientações: não fazer alianças com os deuses de Canaã, guardar as festas, o descanso e as primícias. Moisés ficou de novo quarenta dias e quarenta noites no monte, sem comer nem beber, e escreveu nas tábuas as dez palavras da aliança.',
        cena: { fundo: 'montanha', el: [luz(400, 60, { r: 380, opacidade: .7 }), { t: 'tabuas', x: 420, y: 340, s: 1.3, anim: 'surgir' }, p('moises', 300, 398, { bracos: 'frente' }), rotulo('40 dias e 40 noites')] } },
      { ref: '34:29-35', veja: ['2corintios 3:7-8'], texto: 'Quando Moisés desceu com as tábuas, a pele do seu rosto brilhava, porque ele tinha falado com Deus, mas ele não sabia. Arão e o povo tiveram medo de se aproximar. Moisés os chamou e lhes passou tudo o que Deus tinha dito. Depois colocou um véu sobre o rosto, e só o tirava quando ia falar com o SENHOR.',
        cena: { fundo: 'deserto', el: [p('moises', 400, 395, { brilho: true, bracos: 'frente' }), { t: 'tabuas', x: 470, y: 405, s: .6 }, p('arao', 250, 395, { bracos: 'rosto' }), ...povo(540, 398, 4, { bracos: 'rosto' })] } },
    ],
    licao: 'Depois do bezerro de ouro, Deus se revelou como misericordioso e perdoador. Quem passa tempo na presença de Deus é transformado, e isso se reflete em quem está ao redor.',
    pergunta: 'Como o tempo com Deus tem “brilhado” no seu jeito de tratar as pessoas?',
    versiculo: '34:6',
  };

  C[35] = {
    titulo: 'Ofertas de coração disposto',
    personagens: ['Moisés', 'Bezalel', 'Aoliabe', 'O povo de Israel'],
    cenas: [
      { ref: '35:1-19', texto: 'Moisés reuniu o povo e lembrou o sábado, dia santo de descanso. Depois convidou: “Quem tiver o coração disposto traga uma oferta ao SENHOR” e pediu que os artesãos habilidosos viessem trabalhar na construção do tabernáculo e de tudo o que havia nele.',
        cena: { fundo: 'dia', el: [p('moises', 400, 395, { bracos: 'aberto' }), ...povo(100, 398, 6), rotulo('De coração disposto')] } },
      { ref: '35:20-35', texto: 'Homens e mulheres vieram com alegria, trazendo joias, ouro, prata, bronze, tecidos, peles, madeira, azeite e perfumes. Mulheres habilidosas fiaram linho e pelo de cabra. Moisés apresentou Bezalel e Aoliabe, cheios do Espírito de Deus, para fazer e também ensinar o trabalho.',
        cena: { fundo: 'dia', el: [p('h3', 180, 395, { bracos: 'frente' }), p('h5', 260, 395, { bracos: 'frente' }), { t: 'moedas', x: 340, y: 405 }, { t: 'saco', x: 400, y: 405 }, { t: 'taca', x: 450, y: 405 }, p('bezalel', 560, 395, { espelho: true, bracos: 'aberto' }), p('h2', 640, 395, { espelho: true })] } },
    ],
    licao: 'A obra de Deus foi feita com ofertas voluntárias e talentos colocados à disposição. Deus ama quem dá com alegria.',
    pergunta: 'Qual é a diferença entre dar por obrigação e dar de coração disposto?',
    versiculo: '35:21',
  };

  C[36] = {
    titulo: 'Ofertas de sobra e a construção',
    personagens: ['Moisés', 'Bezalel', 'Aoliabe', 'Os artesãos'],
    cenas: [
      { ref: '36:1-7', texto: 'Os artesãos começaram o trabalho, mas o povo continuava trazendo ofertas toda manhã. Eles avisaram Moisés: “O povo está trazendo muito mais do que precisamos!” Então Moisés mandou anunciar no acampamento que ninguém trouxesse mais nada. Havia material de sobra!',
        cena: { fundo: 'dia', el: [{ t: 'saco', x: 300, y: 405 }, { t: 'saco', x: 340, y: 400 }, { t: 'saco', x: 320, y: 365 }, { t: 'moedas', x: 400, y: 405 }, { t: 'taca', x: 450, y: 405 }, p('moises', 560, 395, { espelho: true, bracos: 'aberto' }), ...povo(80, 398, 3, { bracos: 'frente' }), fala('Já temos o suficiente!', 500, 230)] } },
      { ref: '36:8-38', texto: 'Os artesãos fizeram as cortinas de linho com querubins bordados, as cobertas de pelo de cabra e de peles, as tábuas de acácia cobertas de ouro e o véu, exatamente conforme o modelo que Deus tinha mostrado a Moisés.',
        cena: { fundo: 'deserto', el: [p('bezalel', 260, 395, { bracos: 'frente' }), p('h2', 380, 395, { bracos: 'cima' }), { t: 'tabernaculo', x: 560, y: 400, s: .7 }, rotulo('Tudo conforme o modelo')] } },
    ],
    licao: 'Quando o povo se envolve de coração, sobra! A generosidade transbordante é sinal de um povo que reconhece o que recebeu de Deus.',
    pergunta: 'Já participou de algo em que todos deram tanto que sobrou? Como foi?',
    versiculo: '36:5',
  };

  C[37] = {
    titulo: 'Bezalel faz a arca, a mesa e o candelabro',
    personagens: ['Bezalel'],
    cenas: [
      { ref: '37:1-29', texto: 'Bezalel fez a arca da aliança de acácia coberta de ouro, com o propiciatório e os dois querubins de asas estendidas. Fez também a mesa dos pães, o candelabro de ouro puro com sete lâmpadas, o altar do incenso, o azeite santo e o incenso perfumado, tudo como Deus tinha mandado.',
        cena: { fundo: 'interior', el: [{ t: 'arca-alianca', x: 560, y: 395, s: 1.2 }, { t: 'candelabro', x: 250, y: 395 }, p('bezalel', 400, 395, { bracos: 'frente' }), rotulo('Feito com sabedoria do Espírito')] } },
    ],
    licao: 'Bezalel fez cada detalhe com cuidado, porque era para Deus. Fazer bem feito também é uma forma de adoração.',
    pergunta: 'Como fazer o seu trabalho do dia a dia “como para o Senhor”?',
    versiculo: '37:1',
  };

  C[38] = {
    titulo: 'O altar, a bacia e as contas da obra',
    personagens: ['Bezalel', 'Aoliabe', 'Itamar'],
    cenas: [
      { ref: '38:1-20', texto: 'Foram feitos o altar dos sacrifícios coberto de bronze e a bacia de bronze, feita com os espelhos das mulheres que serviam à entrada da Tenda do Encontro. Depois, o pátio com suas cortinas de linho, colunas e bases.',
        cena: { fundo: 'deserto', el: [{ t: 'altar', x: 300, y: 395, s: 1.3, fogo: false }, { t: 'poco', x: 520, y: 400, s: .8 }, p('h3', 620, 395, { espelho: true }), p('h5', 680, 395, { espelho: true }), rotulo('Bronze dos espelhos')] } },
      { ref: '38:21-31', texto: 'Itamar, filho de Arão, fez as contas de todo o material usado. Os metais vieram das ofertas do povo: o ouro, a prata do resgate pago por cada pessoa contada e o bronze. Tudo foi registrado com transparência.',
        cena: { fundo: 'interior', el: [p('h2', 330, 395, { bracos: 'frente', cor: '#f2eee6' }), { t: 'moedas', x: 450, y: 405 }, { t: 'moedas', x: 490, y: 405 }, { t: 'saco', x: 560, y: 405 }, rotulo('Prestação de contas')] } },
    ],
    licao: 'Até os espelhos das mulheres viraram parte da obra de Deus. E a prestação de contas mostra que a obra de Deus deve ser feita com honestidade e transparência.',
    pergunta: 'Por que a transparência com o dinheiro é importante na obra de Deus?',
    versiculo: '38:21',
  };

  C[39] = {
    titulo: 'As vestes sagradas e a obra concluída',
    personagens: ['Moisés', 'Arão', 'Os artesãos'],
    cenas: [
      { ref: '39:1-31', texto: 'Os artesãos fizeram as vestes sagradas de Arão: o éfode, o peitoral com as doze pedras, o manto azul com romãs e sininhos de ouro, as túnicas, o turbante e a placa de ouro com “SANTIDADE AO SENHOR”, tudo como o SENHOR tinha ordenado a Moisés.',
        cena: { fundo: 'interior', el: [p('araoSacerdote', 400, 395, { s: 1.3, bracos: 'aberto' }), p('h3', 230, 395, { bracos: 'frente' }), p('h2', 580, 395, { espelho: true, bracos: 'frente' })] } },
      { ref: '39:32-43', texto: 'Assim ficou pronta toda a obra do tabernáculo. Os israelitas levaram tudo a Moisés: a tenda, a arca, a mesa, o candelabro, os altares, a bacia, o pátio e as vestes. Moisés examinou tudo, viu que fizeram exatamente como o SENHOR tinha mandado, e os abençoou.',
        cena: { fundo: 'dia', el: [{ t: 'arca-alianca', x: 200, y: 400, s: .7 }, { t: 'candelabro', x: 320, y: 400, s: .6 }, { t: 'mesa', x: 460, y: 405, s: .5 }, p('moises', 600, 395, { espelho: true, bracos: 'cima' }), ...povo(640, 400, 2, { s: .7 }), luz(600, -40, { opacidade: .5 })] } },
    ],
    licao: 'A frase “como o SENHOR havia ordenado” se repete muitas vezes: a obra foi feita com obediência cuidadosa. E terminou com bênção.',
    pergunta: 'O que significa obedecer a Deus “nos detalhes”?',
    versiculo: '39:43',
  };

  C[40] = {
    titulo: 'A glória de Deus enche o tabernáculo',
    personagens: ['Moisés', 'Arão e seus filhos', 'O povo de Israel'],
    cenas: [
      { ref: '40:1-33', texto: 'No primeiro dia do primeiro mês do segundo ano após a saída do Egito, Moisés levantou o tabernáculo. Colocou as tábuas dentro da arca, o véu, a mesa, o candelabro, o altar do incenso, o altar dos sacrifícios e a bacia. Ungiu tudo, e Arão e seus filhos foram consagrados. Moisés fez tudo como o SENHOR tinha mandado.',
        cena: { fundo: 'aurora', el: [{ t: 'tabernaculo', x: 400, y: 400 }, p('moises', 120, 398, { bracos: 'cima' }), p('araoSacerdote', 190, 398, { s: .9 }), rotulo('1º dia do 1º mês, 2º ano')] } },
      { ref: '40:34-38', veja: ['apocalipse 21:3'], texto: 'Então a nuvem cobriu a Tenda do Encontro, e a glória do SENHOR encheu o tabernáculo, tanto que nem Moisés conseguia entrar. Dali em diante, quando a nuvem se levantava, o povo partia; quando ela ficava, o povo ficava. De dia a nuvem e, de noite, o fogo estavam sobre o tabernáculo, à vista de todo Israel, em todas as suas viagens.',
        cena: { fundo: 'noite', el: [{ t: 'estrelas', x: 0, y: 0, n: 50, h: 200 }, { t: 'tabernaculo', x: 400, y: 400 }, { t: 'coluna', x: 520, y: 250, fogo: true }, luz(520, 200, { r: 420, nucleo: 90 }), ...povo(60, 410, 3, { s: .7, bracos: 'cima' }), rotulo('A glória do SENHOR')] } },
    ],
    licao: 'Êxodo começa com o povo escravo, longe de Deus, e termina com Deus morando no meio dele. Esse é o grande plano de Deus: estar com o seu povo e guiá-lo em cada passo.',
    pergunta: 'O povo só partia quando a nuvem se movia. Como discernir o tempo de Deus nas suas decisões?',
    versiculo: '40:34',
  };

  CONTEUDO.registrar('exodo', {
    autor: 'Tradição: Moisés',
    epoca: 'Saída do Egito, por volta do século XV ou XIII a.C.',
    tema: 'Deus liberta o seu povo da escravidão, faz aliança com ele e vem habitar no meio dele.',
    introducao: 'Êxodo quer dizer “saída”. É a história de como Deus ouviu o clamor dos israelitas escravizados no Egito, chamou Moisés, enviou as pragas, abriu o mar Vermelho e levou o povo ao monte Sinai. Ali Deus deu os Dez Mandamentos, fez uma aliança com Israel e mandou construir o tabernáculo, a tenda onde a sua presença habitaria no meio do povo.',
    capa: { fundo: 'por-do-sol', el: [{ t: 'mar-aberto', x: 400, y: 450, s: .9 }, { t: 'coluna', x: 660, y: 300, fogo: true }, ...povo(330, 360, 3, { s: .5 }), p('moises', 400, 440, { bracos: 'cima', s: .9 })] },
    partes: [
      { titulo: 'Escravidão e o chamado de Moisés', de: 1, ate: 6 },
      { titulo: 'As pragas e a Páscoa', de: 7, ate: 13 },
      { titulo: 'O mar Vermelho e o deserto', de: 14, ate: 18 },
      { titulo: 'A aliança no Sinai e as leis', de: 19, ate: 24 },
      { titulo: 'Instruções para o tabernáculo', de: 25, ate: 31 },
      { titulo: 'O bezerro de ouro e a aliança renovada', de: 32, ate: 34 },
      { titulo: 'A construção do tabernáculo', de: 35, ate: 40 },
    ],
    capitulos: C,
  }, 'pt-BR');
})();
