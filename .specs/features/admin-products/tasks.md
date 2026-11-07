# Admin de Produtos — Tasks

| ID | Task | Depende de | Requisitos | Verificação |
| --- | --- | --- | --- | --- |
| T1 | Schemas `productInputSchema`, `productUpdateSchema`, `productFormSchema`, `parseBRL` | — | ADM-03, ADM-05 | `tsc` ok |
| T2 | `POST /api/products` + `GET/PATCH/DELETE /api/products/[id]` com 400/404/409 | T1, db | ADM-05, 06, 08, 09, 11 | curl retorna códigos esperados |
| T3 | `/admin` com tabela | db | ADM-01 | tabela lista seed |
| T4 | `ProductForm` (create/edit, auto-slug, setError 409) | T1, T2 | ADM-02..04, 06, 07 | criar produto aparece no catálogo |
| T5 | Páginas `new` e `[id]/edit` (404 se inexistente) | T4 | ADM-07, ADM-09 | `/admin/products/xxx/edit` → 404 |
| T6 | `DeleteProductButton` com Dialog | T2, T3 | ADM-10, ADM-11 | excluir some da tabela |

**Paralelizável:** T3 com T1/T2.
