---
name: traduzir-conteudo
description: Traduz as histórias ilustradas de um livro do portal In Lumen (conteudo/pt-BR/<id>.js) para outro idioma, preservando cenas, ilustrações e referências; também cobre a tradução da interface e dos nomes dos livros. Use quando pedirem para traduzir um livro, capítulos ou a interface do portal para outro idioma (ex.: "traduza Gênesis para inglês", "adicione o idioma coreano").
---

# Traduzir conteúdo

O portal tem três camadas de idioma, todas com fallback (detalhes no `README.md`, seção "Internacionalização"):

| Camada | Arquivo |
|---|---|
| Interface | `js/i18n.js` → `UI[idioma]` |
| Nomes dos 66 livros | `js/i18n.js` → `NOMES[idioma]` |
| Histórias | `conteudo/<idioma>/<id>.js` |

Os códigos de idioma ficam em `I18N.IDIOMAS` (ex.: `en`, `es`, `zh-CN`, `ar`). Para um idioma novo, comece pela seção "Novo idioma" abaixo.

## Traduzir as histórias de um livro

1. Copie o original: `conteudo/pt-BR/<id>.js` → `conteudo/<idioma>/<id>.js`.
2. **Traduza apenas os textos:**
   - nos capítulos: `titulo`, `personagens`, `licao`, `pergunta`;
   - nas cenas: `texto`;
   - dentro das ilustrações: o `texto` dos balões `fala(...)` e dos `rotulo`;
   - no registro final: `autor`, `epoca`, `tema`, `introducao` e `partes[].titulo`.
3. **Nunca altere:** `ref`, `versiculo` (referências bíblicas), coordenadas, cores, elementos, animações, o objeto `T` de personagens e a estrutura do arquivo.
4. Altere o idioma no registro: `CONTEUDO.registrar('<id>', { … }, '<idioma>');`
5. Registre o idioma em `js/livros.js`: `DISPONIVEIS = { <id>: ['pt-BR', '<idioma>'] }`. O primeiro da lista continua sendo o original.

### Qualidade da tradução

- **Nomes próprios** na forma consagrada no idioma de destino (ex.: Abraão → Abraham em `en`, Abraham em `es`, 亚伯拉罕 em `zh-CN`). Para alinhar com a Bíblia do idioma, siga a tradução bíblica de domínio público mais usada nele, se houver uma registrada em `js/biblia-texto.js`.
- Mantenha o tom: linguagem leiga, frases curtas, adequada a famílias e crianças.
- **Balões `fala`:** mantenha-os curtos (no máximo ~28 caracteres por linha, use `\n`), pois a largura do balão é calculada pelo número de caracteres. Em idiomas com caracteres largos (zh, ja), use frases ainda mais curtas.
- Em idiomas RTL (ar), escreva o texto normalmente; o site aplica `dir` automaticamente.
- O texto bíblico ("Ler na Bíblia" e "Para guardar") continua vindo da tradução bíblica configurada para o idioma em `TEXTO_BIBLICO.POR_IDIOMA`; sem ela, usa a BLIVRE.

### Tradução parcial

Quando o idioma está registrado em `DISPONIVEIS`, o site usa **o arquivo inteiro** desse idioma no lugar do original. Um capítulo ausente nele aparece como "em preparação", e não em português. Por isso, pode traduzir em lotes, mas só registre o idioma em `DISPONIVEIS` quando o livro estiver completo. O validador avisa sobre capítulos que faltam em relação ao original.

## Novo idioma da interface

1. Em `js/i18n.js`, adicione `{ codigo, nome, dir }` em `IDIOMAS`, com o nome no próprio idioma e `dir: 'rtl'` quando for o caso.
2. Copie o bloco `UI['pt-BR']` para `UI['<codigo>']` e traduza **todas** as chaves:
   - mantenha as variáveis `{livro}`, `{n}`, `{total}` e demais exatamente como estão;
   - os plurais usam as categorias de `Intl.PluralRules` do idioma (`zero`, `one`, `two`, `few`, `many`, `other`), e `other` é obrigatória;
   - as chaves `sobre.*` aceitam HTML simples (`<strong>`, `<em>`).
3. Se souber os nomes canônicos, adicione os 66 nomes em `NOMES['<codigo>']`, separados por `|`, na ordem de `js/livros.js`. O validador exige exatamente 66.

## Validar

```bash
node scripts/validar.js
```

- Sem erros; avisos de "chave sem tradução" indicam lacunas na interface.
- Confira no navegador com `?lang=<codigo>`: home, página do livro, um capítulo (balões dentro do palco) e a página "Sobre". Em RTL, confira o alinhamento.
- Informe ao usuário que traduções geradas precisam de **revisão por falante nativo** antes de divulgar.
- Publique com a skill `publicar`.
