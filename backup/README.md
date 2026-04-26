# Backup — assets legacy del repo

Carpeta de respaldos puntuales. **No es parte del runtime de la app** — Vercel ignora esto. Sirve como evidencia auditable cuando se migra contenido o se elimina algo.

## `blog-source/html/`

Snapshot HTML completo (DOM post-JavaScript) de los 13 posts del blog que vivían en el SPA legacy fetcheando un Apps Script de Google.

Capturado el 2026-04-26 con Chrome headless (`--dump-dom`) antes de migrar a Server Components + MDX en `src/content/posts/`.

Se conservan acá para:
- Auditar la migración: si un MDX queda dudoso, comparar contra el HTML original.
- Referencia futura si hace falta recuperar formato/imágenes específicas.
- Evidencia editorial de la versión 2026-04-26 de cada post.

**No editar estos HTML.** Si necesitas cambiar un post, edita el `.mdx` correspondiente en `src/content/posts/`.
