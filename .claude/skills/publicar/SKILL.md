---
name: publicar
description: Publica mudanças do portal In Lumen no GitHub Pages pelo fluxo validar → commit/push → pull request → CI → merge → deploy → conferência do site. Use quando pedirem para publicar, subir, fazer o merge, colocar no ar ou abrir PR das mudanças do portal.
---

# Publicar o portal

O workflow `.github/workflows/pages.yml` valida todo PR para a `main` e, após o merge, valida de novo e publica no GitHub Pages: <https://nosreteq.github.io/inlumen/>.

## Regras

- **Merge só com pedido explícito do usuário** na conversa. Abrir PR também só quando ele pedir publicação ou PR.
- Nunca faça push direto na `main`; trabalhe na branch de desenvolvimento indicada pela sessão.
- Nunca pule, desative nem enfraqueça a validação para "ficar verde". Corrija a causa.

## Passos

1. **Validar localmente:**
   ```bash
   node scripts/validar.js
   ```
   Corrija todos os erros (❌). Avisos (⚠️) de cobertura ou grafia também devem ser resolvidos antes de publicar conteúdo novo.

2. **Conferir no navegador**, se a mudança afeta a interface ou o conteúdo: sirva com `python3 -m http.server 8765` e use o Playwright já instalado para abrir as páginas alteradas. Verifique se não há erros de console e se não há rolagem horizontal no mobile (`devices['iPhone 13']`), e veja capturas de tela. Ao final, encerre o servidor.

3. **Commit e push** na branch de desenvolvimento, com mensagem descritiva em português e as linhas de atribuição pedidas pela sessão. Antes, sincronize com a `main`:
   ```bash
   git fetch origin main && git merge --no-edit origin/main
   ```

4. **Pull request** para a `main` (ferramenta `mcp__github__create_pull_request`), com resumo, mudanças e testes realizados.

5. **Aguardar o CI do PR:** consulte as execuções com `mcp__github__actions_list` (`list_workflow_runs`, evento `pull_request`) e confira se o `head_sha` é o do último commit. Não use `sleep` solto; espere com um comando em segundo plano.

6. **Merge**, somente se o CI passou e o usuário pediu: `mcp__github__merge_pull_request` com `merge_method: "merge"` e `expectedHeadSha` do último commit.

7. **Acompanhar o deploy:** a execução `push` na `main` tem os jobs `validar` → `empacotar` (upload do artefato) → `publicar` (deploy). Liste os jobs com `list_workflow_jobs`.

8. **Conferir o site:** confirme que os arquivos novos respondem com 200 (pode levar 1 a 2 minutos após o deploy):
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" https://nosreteq.github.io/inlumen/<arquivo-novo>
   ```

## Falhas conhecidas no deploy

| Sintoma | Causa provável | Ação |
|---|---|---|
| Job `publicar` falha em segundos, **sem passos e sem log** | Regra de proteção do ambiente `github-pages` não permite a branch | Pedir ao usuário: Settings → Environments → `github-pages` → Deployment branches → incluir `main` |
| `deploy-pages` falha com "Fetching artifact metadata failed" ou "No artifacts named github-pages" | Instabilidade transitória do GitHub: o artefato ainda não estava visível | Disparar um **run novo**: `mcp__github__actions_run_trigger` com `run_workflow`, `workflow_id: "pages.yml"`, `ref: "main"`. **Não** use `rerun_failed_jobs`: o rerun envia um 2º artefato no mesmo run e falha com "Multiple artifacts named github-pages" |
| "Multiple artifacts named github-pages" | Foi usado rerun no mesmo run | Disparar um run novo com `run_workflow`, como acima |
| `validar` falha | Erro real de conteúdo ou código | Ler o log (`mcp__github__get_job_logs`), corrigir localmente e repetir a partir do passo 1 |

Ao terminar, informe ao usuário o link do PR, o resultado do CI e do deploy e o link do site.
