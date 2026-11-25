# Bíblia Livre (BLIVRE): texto bíblico de referência do In Lumen

Esta pasta contém o texto bíblico completo usado como **base de todo o projeto**: os 66 livros, 1189 capítulos e 31.102 versículos.

## Créditos e licença

> Todas as Escrituras em português citadas são da **Bíblia Livre (BLIVRE)**, Copyright © 2018 Diego Santos, Mario Sérgio e Marco Teles, <http://sites.google.com/site/biblialivre/>.
> Licença **Creative Commons Atribuição 4.0 Brasil** (<https://creativecommons.org/licenses/by/4.0/deed.pt_BR>).
> Reprodução permitida desde que devidamente mencionados fonte e autores.

A Bíblia Livre é uma atualização da tradução de **João Ferreira de Almeida** (edição de 1819, Textus Receptus) para o português do Brasil.

## Versão e procedência

| Item | Valor |
|---|---|
| Fonte | eBible.org, pacote `porbr2018_vpl.zip` (<https://ebible.org/Scriptures/porbr2018_vpl.zip>) |
| Data dos arquivos-fonte | 12/12/2025 (gerado pelo eBible.org em 30/10/2026) |
| Baixado em | 25/11/2026 |
| SHA-256 de `fonte/porbr2018_vpl.txt` | `20f7cccf95e99d0b07d3a483aeebe9a0dcad0c8b52cb169cf917c9e684a4d858` |

A Bíblia Livre é um trabalho em andamento. Ao atualizar, registre a nova data nesta tabela e em `js/biblia-texto.js` (`versao`).

## Estrutura

```
fonte/porbr2018_vpl.txt         texto original, sem alterações (1 versículo por linha)
fonte/porbr2018_about.htm       descrição do pacote (eBible.org)
fonte/porbr2018_copyright.htm   página de licença (eBible.org)
fonte/signature.txt.asc         assinatura PGP do pacote (eBible.org)
<livro>.js                      um arquivo por livro, gerado a partir da fonte e carregado sob demanda pelo site
```

## Alterações

**O texto não foi alterado.** Os arquivos `<livro>.js` só reorganizam os versículos em capítulos. As palavras entre colchetes `[ ]`, acrescentadas pelos tradutores, são preservadas e exibidas em itálico no site.

## Reimportar ou atualizar

```bash
node scripts/importar-biblia.js biblia/blivre/fonte/porbr2018_vpl.txt blivre --versiculos
node scripts/validar.js
```
