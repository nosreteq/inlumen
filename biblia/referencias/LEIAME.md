# Referências cruzadas (OpenBible.info): base do "Veja também" e do leitor da Bíblia

Esta pasta guarda as referências cruzadas entre trechos bíblicos usadas no portal:

- **nas histórias:** "Veja também" em cada cena;
- **no leitor da Bíblia:** as referências de cada versículo.

## Créditos e licença

> Referências cruzadas: **OpenBible.info**, <https://www.openbible.info/labs/cross-references/>.
> Licença **Creative Commons Attribution (CC BY)**.
> Os dados derivam principalmente do *Treasury of Scripture Knowledge*, de domínio público.

Os arquivos contêm **apenas referências** (ex.: `Gn 15:6 → Rm 4:3`), sem nenhum texto bíblico de terceiros. O texto exibido é sempre o da Bíblia Livre (`../blivre/`).

## Versão e procedência

| Item | Valor |
|---|---|
| Fonte | <https://a.openbible.info/data/cross-references.zip> |
| Data dos dados | 23/11/2026 (cabeçalho do arquivo: `#www.openbible.info CC-BY 2026-11-23`) |
| Baixado em | 25/11/2026 |
| SHA-256 de `fonte/cross-references.zip` | `650cafbdfe06458e78c67f33ce57cd11162de867f5842240846863e96bcd62f2` |
| SHA-256 de `cross_references.txt` (dentro do zip) | `d548f9ca1c66008f88bc3f175d1a403cd1c9b528fe8fe8460d0ef4592ba5e471` |

## Como os dados foram tratados

O importador `scripts/importar-referencias.js` faz o seguinte:

- converte as abreviações OSIS (`Gen.1.1`) nos ids do portal (`genesis 1:1`);
- descarta referências com votos menores que 1 e referências que não existem na versificação da BLIVRE (18 de 344.799);
- guarda até **8 referências por versículo**, ordenadas por votos da comunidade (mais relevantes primeiro). O resultado são 193.452 referências.

## Reimportar ou atualizar

```bash
unzip biblia/referencias/fonte/cross-references.zip -d /tmp/xref
node scripts/importar-referencias.js /tmp/xref/cross_references.txt --max 8 --min-votos 1
node scripts/validar.js
```
