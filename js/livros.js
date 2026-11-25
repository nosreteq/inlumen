/* Catálogo dos 66 livros da Bíblia (cânon protestante), em ordem.
 * id: usado na URL e no nome do arquivo em /conteudo/<idioma>/<id>.js
 * nome/resumo aqui estão em pt-BR (idioma padrão); nomes em outros idiomas ficam em js/i18n.js.
 * Para publicar o estudo de um livro, crie conteudo/<idioma>/<id>.js e registre o idioma em DISPONIVEIS.
 */
window.BIBLIA = (function () {
  const SECOES = {
    // nomes das seções: chaves 'secao.<id>' em js/i18n.js
    pentateuco:   { cor: '#c0803a', testamento: 'AT' },
    historicos:   { cor: '#8a6d3b', testamento: 'AT' },
    poeticos:     { cor: '#6b8e4e', testamento: 'AT' },
    profMaiores:  { cor: '#7a5c99', testamento: 'AT' },
    profMenores:  { cor: '#9a6a8a', testamento: 'AT' },
    evangelhos:   { cor: '#c25b4a', testamento: 'NT' },
    historicoNT:  { cor: '#b9773a', testamento: 'NT' },
    paulinas:     { cor: '#3f7d9a', testamento: 'NT' },
    gerais:       { cor: '#4f8f84', testamento: 'NT' },
    profeticoNT:  { cor: '#8a4f6d', testamento: 'NT' },
  };

  // [id, nome, abreviação, capítulos, seção, resumo]
  const L = [
    ['genesis', 'Gênesis', 'Gn', 50, 'pentateuco', 'O começo de tudo: a criação, a queda, o dilúvio e a história de Abraão, Isaque, Jacó e José.'],
    ['exodo', 'Êxodo', 'Êx', 40, 'pentateuco', 'Deus liberta Israel da escravidão no Egito pelas mãos de Moisés e entrega a Lei no Sinai.'],
    ['levitico', 'Levítico', 'Lv', 27, 'pentateuco', 'As leis de santidade, os sacrifícios e as festas que ensinam o povo a se aproximar de Deus.'],
    ['numeros', 'Números', 'Nm', 36, 'pentateuco', 'Quarenta anos de caminhada no deserto: censos, revoltas, fidelidade de Deus e preparo para a Terra Prometida.'],
    ['deuteronomio', 'Deuteronômio', 'Dt', 34, 'pentateuco', 'Os últimos discursos de Moisés relembrando a Lei antes de o povo entrar em Canaã.'],
    ['josue', 'Josué', 'Js', 24, 'historicos', 'Josué conduz Israel na conquista e na divisão da Terra Prometida.'],
    ['juizes', 'Juízes', 'Jz', 21, 'historicos', 'Ciclos de desobediência e libertação: Gideão, Débora, Sansão e outros juízes.'],
    ['rute', 'Rute', 'Rt', 4, 'historicos', 'Uma história de lealdade e amor: a moabita Rute se torna bisavó do rei Davi.'],
    ['1samuel', '1 Samuel', '1Sm', 31, 'historicos', 'Samuel, o último juiz; Saul, o primeiro rei; e a ascensão do jovem Davi.'],
    ['2samuel', '2 Samuel', '2Sm', 24, 'historicos', 'O reinado de Davi: vitórias, erros, arrependimento e a promessa de um reino eterno.'],
    ['1reis', '1 Reis', '1Rs', 22, 'historicos', 'Salomão e o Templo, a divisão do reino e o profeta Elias.'],
    ['2reis', '2 Reis', '2Rs', 25, 'historicos', 'Eliseu, os reis de Israel e Judá e o exílio do povo.'],
    ['1cronicas', '1 Crônicas', '1Cr', 29, 'historicos', 'Genealogias e o reinado de Davi contados do ponto de vista do culto a Deus.'],
    ['2cronicas', '2 Crônicas', '2Cr', 36, 'historicos', 'De Salomão ao exílio, com foco no Templo e nos reis de Judá.'],
    ['esdras', 'Esdras', 'Ed', 10, 'historicos', 'O retorno do exílio e a reconstrução do Templo em Jerusalém.'],
    ['neemias', 'Neemias', 'Ne', 13, 'historicos', 'Neemias lidera a reconstrução dos muros de Jerusalém.'],
    ['ester', 'Ester', 'Et', 10, 'historicos', 'Uma rainha corajosa salva seu povo da destruição na Pérsia.'],
    ['jo', 'Jó', 'Jó', 42, 'poeticos', 'O sofrimento de um homem justo e o encontro dele com Deus.'],
    ['salmos', 'Salmos', 'Sl', 150, 'poeticos', 'Cânticos e orações de louvor, lamento, confiança e gratidão.'],
    ['proverbios', 'Provérbios', 'Pv', 31, 'poeticos', 'Conselhos práticos de sabedoria para a vida diária.'],
    ['eclesiastes', 'Eclesiastes', 'Ec', 12, 'poeticos', 'A busca pelo sentido da vida "debaixo do sol".'],
    ['cantares', 'Cânticos', 'Ct', 8, 'poeticos', 'Um poema sobre o amor entre noivo e noiva.'],
    ['isaias', 'Isaías', 'Is', 66, 'profMaiores', 'Juízo e esperança: as grandes profecias sobre o Messias que viria.'],
    ['jeremias', 'Jeremias', 'Jr', 52, 'profMaiores', 'O "profeta chorão" alerta Judá antes da queda de Jerusalém.'],
    ['lamentacoes', 'Lamentações', 'Lm', 5, 'profMaiores', 'Poemas de luto pela destruição de Jerusalém.'],
    ['ezequiel', 'Ezequiel', 'Ez', 48, 'profMaiores', 'Visões impressionantes de um profeta no exílio, incluindo o vale de ossos secos.'],
    ['daniel', 'Daniel', 'Dn', 12, 'profMaiores', 'Fidelidade na Babilônia: a cova dos leões, a fornalha e visões do futuro.'],
    ['oseias', 'Oseias', 'Os', 14, 'profMenores', 'O amor fiel de Deus por um povo infiel.'],
    ['joel', 'Joel', 'Jl', 3, 'profMenores', 'Uma praga de gafanhotos e a promessa do derramar do Espírito.'],
    ['amos', 'Amós', 'Am', 9, 'profMenores', 'Um pastor chama o povo à justiça social.'],
    ['obadias', 'Obadias', 'Ob', 1, 'profMenores', 'O juízo sobre Edom, que se alegrou com a queda de Judá.'],
    ['jonas', 'Jonas', 'Jn', 4, 'profMenores', 'O profeta que fugiu, o grande peixe e a misericórdia de Deus por Nínive.'],
    ['miqueias', 'Miqueias', 'Mq', 7, 'profMenores', 'Praticar a justiça, amar a misericórdia e andar humildemente com Deus.'],
    ['naum', 'Naum', 'Na', 3, 'profMenores', 'O anúncio da queda de Nínive.'],
    ['habacuque', 'Habacuque', 'Hc', 3, 'profMenores', 'Um profeta faz perguntas difíceis a Deus e aprende a confiar.'],
    ['sofonias', 'Sofonias', 'Sf', 3, 'profMenores', 'O dia do Senhor e a alegria de Deus pelo seu povo.'],
    ['ageu', 'Ageu', 'Ag', 2, 'profMenores', 'Um chamado para terminar a reconstrução do Templo.'],
    ['zacarias', 'Zacarias', 'Zc', 14, 'profMenores', 'Visões de restauração e do Rei que vem montado num jumentinho.'],
    ['malaquias', 'Malaquias', 'Ml', 4, 'profMenores', 'A última voz profética do Antigo Testamento.'],
    ['mateus', 'Mateus', 'Mt', 28, 'evangelhos', 'Jesus, o Messias prometido e Rei, cumpre as Escrituras.'],
    ['marcos', 'Marcos', 'Mc', 16, 'evangelhos', 'O evangelho mais curto e ágil: Jesus, o servo que age.'],
    ['lucas', 'Lucas', 'Lc', 24, 'evangelhos', 'Um relato cuidadoso da vida de Jesus, amigo dos pobres e excluídos.'],
    ['joao', 'João', 'Jo', 21, 'evangelhos', 'Jesus, a Palavra que se fez carne, para que creiamos e tenhamos vida.'],
    ['atos', 'Atos', 'At', 28, 'historicoNT', 'O Espírito Santo vem e a igreja se espalha de Jerusalém até Roma.'],
    ['romanos', 'Romanos', 'Rm', 16, 'paulinas', 'A explicação mais completa do evangelho: graça, fé e nova vida.'],
    ['1corintios', '1 Coríntios', '1Co', 16, 'paulinas', 'Conselhos a uma igreja dividida, incluindo o famoso capítulo do amor.'],
    ['2corintios', '2 Coríntios', '2Co', 13, 'paulinas', 'Paulo abre o coração sobre fraqueza, sofrimento e o poder de Deus.'],
    ['galatas', 'Gálatas', 'Gl', 6, 'paulinas', 'A liberdade em Cristo e o fruto do Espírito.'],
    ['efesios', 'Efésios', 'Ef', 6, 'paulinas', 'A igreja como um só corpo e a armadura de Deus.'],
    ['filipenses', 'Filipenses', 'Fp', 4, 'paulinas', 'A carta da alegria, escrita da prisão.'],
    ['colossenses', 'Colossenses', 'Cl', 4, 'paulinas', 'Cristo acima de tudo.'],
    ['1tessalonicenses', '1 Tessalonicenses', '1Ts', 5, 'paulinas', 'Encorajamento e esperança na volta de Jesus.'],
    ['2tessalonicenses', '2 Tessalonicenses', '2Ts', 3, 'paulinas', 'Firmeza enquanto se espera o dia do Senhor.'],
    ['1timoteo', '1 Timóteo', '1Tm', 6, 'paulinas', 'Orientações a um jovem líder sobre a igreja.'],
    ['2timoteo', '2 Timóteo', '2Tm', 4, 'paulinas', 'As últimas palavras de Paulo: "combati o bom combate".'],
    ['tito', 'Tito', 'Tt', 3, 'paulinas', 'Boa doutrina e boas obras na ilha de Creta.'],
    ['filemom', 'Filemom', 'Fm', 1, 'paulinas', 'Um pedido de perdão para um escravo fugitivo que se tornou irmão.'],
    ['hebreus', 'Hebreus', 'Hb', 13, 'gerais', 'Jesus é superior a tudo; a galeria dos heróis da fé.'],
    ['tiago', 'Tiago', 'Tg', 5, 'gerais', 'Uma fé que se mostra na prática.'],
    ['1pedro', '1 Pedro', '1Pe', 5, 'gerais', 'Esperança para quem sofre por causa da fé.'],
    ['2pedro', '2 Pedro', '2Pe', 3, 'gerais', 'Crescer na graça e cuidado com falsos mestres.'],
    ['1joao', '1 João', '1Jo', 5, 'gerais', 'Deus é luz e Deus é amor.'],
    ['2joao', '2 João', '2Jo', 1, 'gerais', 'Andar na verdade e no amor.'],
    ['3joao', '3 João', '3Jo', 1, 'gerais', 'Hospitalidade e bom exemplo.'],
    ['judas', 'Judas', 'Jd', 1, 'gerais', 'Lutar pela fé entregue aos santos.'],
    ['apocalipse', 'Apocalipse', 'Ap', 22, 'profeticoNT', 'A vitória final de Jesus e a promessa de novos céus e nova terra.'],
  ];

  // livro -> idiomas em que o conteúdo ilustrado existe (o primeiro é o original)
  const DISPONIVEIS = {
    genesis: ['pt-BR'],
    exodo: ['pt-BR'],
  };

  const livros = L.map(([id, nome, abrev, capitulos, secao, resumo], i) => ({
    id, nome, abrev, capitulos, secao, resumo, ordem: i + 1,
    testamento: SECOES[secao].testamento,
    idiomas: DISPONIVEIS[id] || [],
    disponivel: !!DISPONIVEIS[id],
  }));

  const porId = Object.fromEntries(livros.map((l) => [l.id, l]));

  return { SECOES, livros, porId };
})();

/* Registro de conteúdo: cada arquivo em /conteudo/<idioma>/ chama CONTEUDO.registrar(id, dados, idioma). */
window.CONTEUDO = {
  _dados: {},
  registrar(id, dados, idioma = 'pt-BR') { this._dados[idioma + '/' + id] = dados; },
  obter(id, idioma = 'pt-BR') { return this._dados[idioma + '/' + id]; },
};
