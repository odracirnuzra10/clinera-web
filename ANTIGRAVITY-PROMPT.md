# ANTIGRAVITY — Prompt de ejecución SEO Master Plan

> Pega esto **completo** en el agente de Antigravity dentro del repo `odracirnuzra10/clinera-web`. Es un solo prompt con 5 fases y checkpoints. **No avances de fase sin que Ricardo te dé luz verde explícita.**

---

## CONTEXTO

Vas a implementar el **SEO Master Plan** de Clinera.io. El plan completo está en el archivo `SEO-MASTER-PLAN.md` en la raíz del repo (o en un directorio adjunto que Ricardo te indicará). **Léelo COMPLETO antes de escribir una sola línea de código.** Es la fuente de verdad de toda decisión.

Stack del repo:
- Next.js 16.2.3, React 19.2.4, Tailwind CSS 4, TypeScript 5
- App Router en `src/app/`
- Componentes en `src/components/`
- Tests e2e en Playwright (`tests/`)
- Deploy en Vercel desde `main`

## REGLAS DURAS — léelas dos veces

1. **Tu fuente única de verdad es `SEO-MASTER-PLAN.md`**. Si te falta un dato, búscalo ahí. Si tampoco está ahí, inserta `// TODO Ricardo: <qué falta>` y sigue. **NO inventes copy, métricas, slugs, URLs, números de WhatsApp, ni nada.**
2. **NO toques** los HTML legacy en `public/` (`contrata/`, `presentacion/`, `support/`, `inicia*/`, `demo/`, `leads/`, `eliminar-datos/`, `gracias.html`, etc.). Salvo `gracias.html`, que se reemplaza con la nueva ruta `/gracias` en `src/app/gracias/` (la versión vieja se elimina al final).
3. **NO duplicar lo que ya existe**. Antes de crear cualquier archivo, verifica si ya existe. Si existe, **edita quirúrgicamente**, no reescribas. Lista de archivos que YA están y son intocables sin instrucción explícita: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/comparativas/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/efectividad/`, `src/app/planes/page.tsx`, `next.config.ts`, `tsconfig.json`, `package.json`, `eslint.config.mjs`.
4. **NO agregar dependencias nuevas sin avisar primero**. Si necesitas `next-mdx-remote`, `gray-matter`, `reading-time`, `clsx`, etc. → reportarlo en el checkpoint, esperar luz verde, recién entonces `npm install`.
5. **NO romper tests Playwright existentes**. Si una edición rompe `tests/analytics.spec.ts`, ajustar el test, no skipearlo.
6. **NO commits intermedios sin orden de Ricardo.** Trabaja todo en working tree, reporta diff en cada checkpoint, Ricardo decide cuándo commitear.
7. **Idioma**: todo el contenido en español rioplatense/chileno neutro. Sin emojis en código ni en copy salvo cuando el plan los incluya literalmente.
8. **Estilo de código**: TypeScript estricto, no `any` salvo en el bridge a `window.dataLayer`/`window.fbq` donde es inevitable. Usar Server Components por defecto, `'use client'` solo cuando hay interactividad.
9. **`// TODO Ricardo:` es la única forma válida de dejar pendientes**. No `FIXME`, no `XXX`, no comentarios crípticos. Cada TODO debe explicar qué falta y por qué.
10. **Si una fase requiere un componente del repo que no encuentras** (ej: `<NavV3 />`, `<FooterV3 />`, `<PlanesV3 />`), busca en `src/components/**/*.tsx` con grep. Si no existe, repórtalo en el checkpoint, no lo crees inventando.

## FORMATO DE CHECKPOINT

Al final de **cada fase**, reporta exactamente así (markdown):

```
### Checkpoint Fase <N> — <nombre>

**Tareas completadas:**
- [x] Archivo X creado/editado: <resumen 1 línea>
- [x] ...

**Tareas saltadas (con razón):**
- [ ] Tarea Y — razón: <por qué>

**TODOs Ricardo dejados en código:**
- src/.../archivo.tsx:42 — falta foto de Nohelymar
- ...

**Diff resumido:**
- N archivos creados, M archivos editados, K líneas añadidas, J eliminadas

**Validación:**
- npm run build → ✓ / ✗ + log si falla
- npm run lint → ✓ / ✗
- Playwright (si aplica) → ✓ / ✗

**¿Avanzo a Fase <N+1>?** ⏸️ Esperando luz verde de Ricardo.
```

---

## FASE 0 — Verificación crítica del Stripe `client_reference_id`

**Gate**: esta fase desbloquea Pilar G. Si falla, NO avanzar a Fase 1 sin reportar.

### Tareas

1. Buscar el componente real que renderiza los buttons de plan en `/planes`. Empieza por `src/components/interior-v3/PlanesV3.tsx`. Si no existe, busca con `grep -r "buy.stripe.com" src/`.
2. Inspeccionar el código del button/anchor de cada plan (Growth, Conect, Advanced).
3. Verificar si el `href` se construye con un `client_reference_id` con **7 segmentos separados por `::`** en este orden exacto: `gclid::gaClientId::fbc::gaSessionId::fbp::ip::userAgent`.
4. Si NO está, agregarlo. El `href` final debe ser:
   ```
   https://buy.stripe.com/<id-stripe>?client_reference_id=<gclid>::<gaClientId>::<fbc-sin-fb.1.>::<gaSessionId>::<fbp-sin-fb.1.>::<ip>::<encodeURIComponent(userAgent)>
   ```
5. Para obtener `gaClientId` y `gaSessionId`, usar las APIs `gtag('get', 'G-FB5YV66KKJ', 'client_id', cb)` y `gtag('get', 'G-FB5YV66KKJ', 'session_id', cb)`. Para `fbc`/`fbp`, leer cookies `_fbc` y `_fbp`. Para `gclid`, leer query string del landing inicial (puedes guardarlo en sessionStorage al cargar). Para `ip` y `userAgent`, dejar string vacío en cliente (n8n los rellena con headers HTTP del webhook si aplica al flujo posterior; en Stripe checkout no es crítico).
6. Si Stripe checkout es server-side via API route, ajustar la API route en lugar del client.

### Validación
- En DevTools, hacer click en "Activar plan" y revisar la URL del redirect. Debe contener el `client_reference_id` con 7 partes (vacíos cuentan, los `::` deben estar igual).
- Mirar también `/contrata` (legacy HTML) — si tiene el mismo flow, **NO tocar**, solo reportar.

### Checkpoint Fase 0
Reportar según formato. Si no encontraste el componente, dejarlo claro y proponer dónde más buscar.

---

## FASE 1 — Foundation técnica

**Pre-requisitos**: Fase 0 OK o reportada como "no aplica".

### Tareas

1. **Editar `src/app/robots.ts`**: mover `'SemrushBot'` y `'AhrefsBot'` del array `scrapers` a un nuevo array `seoTools`, y mappearlo igual que `aiCrawlers` (allow `/`, disallow `/admin/` y `/api/`). NO tocar el resto del archivo. Detalle exacto en `SEO-MASTER-PLAN.md` sección 1.1.

2. **Cambiar `<html lang="es">` → `<html lang="es-CL">`** en `src/app/layout.tsx`.

3. **Verificar Meta Pixel en layout**: hacer grep de `1104567405156111` en el repo. Si NO está cargándose como script en `<head>` (independiente del GTM), agregarlo según código de `SEO-MASTER-PLAN.md` sección 8.5. Si ya está cargado vía GTM tag, **NO duplicar** — reportar.

4. **Crear `src/app/gracias/page.tsx`** y `src/app/gracias/ThanksContent.tsx` según código completo en `SEO-MASTER-PLAN.md` sección 7.7. La foto debe quedar en `public/team/catalina.jpg` (Ricardo la sube manualmente — dejar `// TODO Ricardo: subir public/team/catalina.jpg`). Lo mismo para `nohelymar.jpg`.

5. **Después de crear `/gracias`**, agregar en `next.config.ts` un `redirect` 301 de `/gracias.html` → `/gracias` (no eliminar `public/gracias.html` aún — esperar luz verde en checkpoint).

6. **Crear `src/lib/tracking.ts`** con los helpers `track`, `trackPixel`, `getGaClientId`, `getGaSessionId`, `getCookie`, `getFbc`, `getFbp`, `buildLeadPayload`. Código exacto en `SEO-MASTER-PLAN.md` sección 8.3.

### Validación
- `npm run build` → debe pasar.
- `npm run lint` → debe pasar.
- Visitar `/robots.txt` localmente con `npm run dev`, verificar que `SemrushBot` y `AhrefsBot` aparecen con `Allow: /`.
- Visitar `/gracias?source=test&event_id=abc` localmente, ver que carga.

### Checkpoint Fase 1
Reportar.

---

## FASE 2 — Schemas + Metadata por ruta

**Pre-requisitos**: Fase 1 OK.

### Tareas

1. **Crear `src/components/seo/JsonLd.tsx`** según código exacto del plan (sección 1.2).
2. **Crear `src/components/seo/schemas.ts`** con TODAS las factories: `orgSchema`, `softwareSchema`, `productPlansSchema`, `faqSchema`, `breadcrumbSchema`, `blogPostingSchema`, `medicalBusinessSchema`, `reviewSchema`. Código exacto en sección 1.2.
3. **Editar `src/app/page.tsx`** (home): agregar `<JsonLd>` con `orgSchema`, `softwareSchema`. NO modificar el copy ni el layout — solo inyectar JSON-LD en el `<head>` o al inicio del body.
4. **Editar `src/app/planes/page.tsx`**: si ya tiene Schema.org JSON-LD para los planes, NO duplicar. Si no, agregar `<JsonLd data={productPlansSchema} />`.
5. **Editar `src/app/comparativas/[slug]/page.tsx`**:
   - Agregar `<JsonLd>` con `breadcrumbSchema`, `faqSchema(faqs del competidor)`, `reviewSchema(testimonio asignado en sección 7.5)`.
   - Verificar que `generateMetadata` dinámico esté generando title/description según tabla en sección 1.3 del plan.
6. **Editar `src/app/blog/[slug]/page.tsx`**:
   - Agregar `<JsonLd>` con `blogPostingSchema(post)`, `faqSchema(post.faq si existe)`, `breadcrumbSchema`.
   - Verificar que `generateMetadata` produce OG `type: 'article'` con `publishedTime`, `modifiedTime`, `authors`, `tags`.
7. **Verificar/agregar `metadata` y `alternates.canonical`** en cada page según tabla 1.3 del plan: `/`, `/planes`, `/funciones`, `/efectividad`, `/demo`, `/reunion`, `/hablar-con-ventas`, `/novedades`, `/ayuda`. Solo agregar lo que falte. NO sobrescribir titles existentes que ya estén en el patrón correcto.

### Validación
- `npm run build` → ✓.
- `curl -s http://localhost:3000/planes | grep "application/ld+json"` debe encontrar el bloque.
- Validar 1-2 schemas con https://validator.schema.org/ (manualmente con la URL pública).

### Checkpoint Fase 2
Reportar.

---

## FASE 3 — Programmatic SEO (B.1 + B.3 + B.4 ola 1)

**Pre-requisitos**: Fase 2 OK.

### Tareas

#### Bloque A — Pilar B.1 (`/clinicas/[slug]`)

1. **Crear `src/content/clinics.ts`** con el dataset completo de las 8 clínicas seed (Hebe ×3, Lumina ×3, Lázaro ×2). Datos exactos en `SEO-MASTER-PLAN.md` sección 2.2.
2. **Crear `src/app/clinicas/[slug]/page.tsx`** según template completo en sección 2.3.
3. **Crear `src/app/clinicas/page.tsx`** (index): listado paginado agrupado por ciudad con schema `ItemList`.

#### Bloque B — Pilar B.3 (comparativas cruzadas + mejora de las 4 directas)

4. **Crear/editar `src/content/comparativas.ts`**: 
   - Si ya existe data source de las 4 actuales, agregar las 6 cruzadas con `type: 'cross'`.
   - Si no existe (las 4 están hardcoded en el `[slug]/page.tsx`), refactorizar a data source y agregar las 6.
5. **Las 6 cruzadas a generar**: `agendapro-vs-reservo`, `agendapro-vs-medilink`, `reservo-vs-medilink`, `agendapro-vs-doctocliq`, `reservo-vs-doctocliq`, `medilink-vs-doctocliq`. Plantilla copy en sección 3.3 del plan.
6. **Mejorar las 4 directas existentes**:
   - Agregar testimonio inline según tabla de sección 7.5 (testimoniales reales de `/ventas`).
   - Agregar internal linking obligatorio: cada comparativa linkea a las otras 3 directas + a la cruzada relacionada (ej: `/comparativas/agendapro` linkea a `/comparativas/agendapro-vs-reservo` y `/comparativas/agendapro-vs-medilink`) + a `/planes` + a `/efectividad` + a `/blog/efectividad`.
7. **Editar `src/app/comparativas/page.tsx`** (index): mostrar 2 secciones — "Comparativas con Clinera" (4) y "Otras comparativas útiles" (6 cruzadas).

#### Bloque C — Pilar B.4 ola 1 (mejor-software-clinicas × 8 ciudades CL)

8. **Crear `src/content/recursos.ts`** con el dataset completo (44 recursos) según código en sección 4.2 del plan, pero **solo marcar `publishedAt` para los 8 de la ola 1** (`mejor-software-clinicas-{santiago|concepcion|vina-del-mar|temuco|la-serena|antofagasta|iquique|los-angeles}-2026`). Los otros 36 quedan en el dataset pero con un flag `published: false`.
9. **Crear `src/content/recursos-templates.ts`** con la función `generateRecursoContent({topic, ciudad, countryCode})` que devuelve `{h1, intro, sections, faqs, cta}`. Implementar SOLO el template `mejor-software-clinicas` según sección 4.3.
10. **Crear `src/app/recursos/[slug]/page.tsx`** con `generateStaticParams` filtrando por `published: true`. Schema `Article` + `FAQPage` + `BreadcrumbList`.
11. **Crear `src/app/recursos/page.tsx`** (index): listado paginado por ciudad/topic.

#### Bloque D — Sitemap

12. **Editar `src/app/sitemap.ts`**: extender (NO reescribir) con los bloques dinámicos según código en sección 1.4. Importa de `@/content/clinics`, `posts`, `recursos`, `comparativas`. Conserva el array `urls` actual intacto.

### Validación
- `npm run build` → ✓ (debe generar las páginas estáticas).
- Visitar localmente `/clinicas/metodo-hebe-vitacura`, `/comparativas/agendapro-vs-reservo`, `/recursos/mejor-software-clinicas-santiago-2026`. Cada una debe renderizar.
- `curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"` debe dar ≥ 22 (estáticas) + 8 (clínicas) + 6 (cruzadas) + 8 (recursos) = **44 URLs mínimo**.

### Checkpoint Fase 3
Reportar. Importante: indicar cuántas páginas estáticas generó el build (`Generating static pages (X/Y)`).

---

## FASE 4 — Content + AEO

**Pre-requisitos**: Fase 3 OK.

### Tareas

1. **Verificar/agregar dependencia `next-mdx-remote`** y `gray-matter` si no están en `package.json`. Reportar antes de instalar.
2. **Crear `src/content/posts.ts`** que lee `src/content/posts/*.mdx`, parsea frontmatter con gray-matter, exporta `allPosts` y `getPostBySlug(slug)`. Si ya existe equivalente (porque /blog/[slug] ya funciona), **NO duplicar** — solo extenderlo si le faltan campos del schema del plan (sección 5.3).
3. **Escribir los primeros 4 posts MDX** según calendario sección 5.2:
   - `como-reducir-no-shows-clinica-estetica.mdx` (audiencia A, post #1)
   - `cuanto-cuesta-perder-paciente-calculo-real.mdx` (audiencia A, post #2)
   - `pacientes-no-confirman-cita-que-hacer.mdx` (audiencia B, post #13)
   - `paciente-agendar-fuera-horario-clinica.mdx` (audiencia B, post #23)
   
   **Importante**: usa los outlines (H2s) del plan como esqueleto, pero el contenido textual lo redactas tú con tono Clinera (directo, basado en datos, sin clichés AI). Cada post: mínimo 1.500 palabras, máximo 2.500. TL;DR de 3-4 bullets al inicio. FAQ al final (mínimo 5 preguntas). Frontmatter completo según sección 5.3.
4. **Mejorar `src/app/novedades/page.tsx`** (index del blog):
   - Agregar fecha visible en cada card (formato `23 abr 2026`).
   - Tags clickeables con filtro por tag (`/novedades?tag=operaciones`).
   - Schema `Blog` + `ItemList`.
   - Card destacada (post con `featured: true` o el más reciente).
   - Paginación 12-en-12 si supera 12 posts.
5. **Mejorar `src/app/blog/[slug]/page.tsx`**:
   - Sección "Posts relacionados" al final (3 posts del mismo tag + link a comparativa relevante si frontmatter declara `relatedComparativa`).
   - Table of Contents auto-generado para posts >2.000 palabras.
6. **Reemplazar `public/llms-full.txt`** con el contenido literal de sección 6.1 del plan. Confirmar que sigue siendo accesible en `https://clinera.io/llms-full.txt`.
7. **Reemplazar `public/llms.txt`** con el contenido literal de sección 6.3.

### Validación
- `npm run build` → ✓.
- Visitar `/blog/como-reducir-no-shows-clinica-estetica`, ver que renderiza con frontmatter correcto, FAQ schema, posts relacionados.
- Visitar `/llms-full.txt` y `/llms.txt`, ver contenido nuevo.
- Validar que `/novedades` muestra 13 (existentes) + 4 (nuevos) = 17 posts.

### Checkpoint Fase 4
Reportar. Adjuntar links a los 4 posts nuevos.

---

## FASE 5 — CRO + Tracking

**Pre-requisitos**: Fase 4 OK + Fase 0 confirmada (Stripe `client_reference_id` armado).

### Tareas

1. **Crear `src/components/cro/StickyMobileCTA.tsx`** según código completo en sección 7.2.
2. **Montar `<StickyMobileCTA />`** en `src/app/layout.tsx` después de `{children}`. NO mostrar en rutas `/admin/*`.
3. **Editar `src/app/page.tsx`** (home): agregar el bloque hero-trust según sección 7.1, con copy literal:
   `+52 clínicas activas · +2.400 citas agendadas por IA · 100% en ≤3 intentos · Ver estudio →`
4. **Crear `src/components/cro/RoiCalculator.tsx`** según código completo en sección 7.3. **Importante**: el `submit` debe postear al webhook n8n `https://clinerasoftware.app.n8n.cloud/webhook/088a2cfe-5c93-4a4b-a4e5-ac2617979ea5` con el payload exacto del workflow LEAD (ver sección 0.4 del plan). Usar `buildLeadPayload` de `src/lib/tracking.ts`.
5. **Crear `src/app/recursos/calculadora-roi/page.tsx`** que renderice `<RoiCalculator />` arriba, ejemplos abajo, testimoniales (3 de los 5 oficiales), y FAQ.
6. **Banner trial visible** en home: agregar después del hero principal una banda CTA con copy literal:
   `Prueba Clinera 7 días — devolución 100% si no te convence [Activar Conect $129] [Hablar con ventas]`
7. **Implementar tracking de eventos** según tabla sección 8.2. Para cada evento, agregar:
   - `data-event="<event_name>"` y `data-*` con los params en el elemento HTML correspondiente.
   - Listener global en `<body>` (puede ir en `layout.tsx` como `useEffect` en un Client Component wrapper) que detecta clicks/views y dispara `track()` de `src/lib/tracking.ts`.
   - Para `view_*` (page-level): disparar en `useEffect` del page component.
   - Para `whatsapp_click`: agregar handler global a todos los `<a href="https://wa.me/...">`.
   - Para `scroll_50` y `scroll_90` en posts: hook `useScrollDepth` que se importa solo en blog post pages.
8. **A/B test del form** en `/hablar-con-ventas`: implementar variante B (3 campos) según sección 7.6. Selección de variante por hash del `event_id` o random 50/50 en cliente. Trackear `lead_form_variant_a` o `lead_form_variant_b` en GA4.

### Validación
- `npm run build` → ✓.
- En localhost mobile (DevTools responsive), scroll 50% en `/`, ver que aparece `<StickyMobileCTA>`.
- En `/recursos/calculadora-roi`, mover sliders y ver cálculos en vivo.
- En GTM Preview Mode, verificar que `view_clinic`, `view_comparative`, `whatsapp_click`, `roi_calc_used` disparan.
- En Meta Events Test Events, enviar Lead desde la calc ROI y verificar que llega con `event_id` (deduplica con CAPI server).

### Checkpoint Fase 5 — FINAL
Reportar todo, además de:
- Lista de **TODOs Ricardo** acumulados en todo el repo (grep `TODO Ricardo:`).
- Sugerencia de **commit message** unificado (Ricardo decide si commitea todo junto o lo divide).
- Métricas del build final (tamaño bundle, páginas estáticas generadas, warnings).
- Archivos legacy candidatos a eliminar (`public/gracias.html` después de validar redirect, etc.) — NO eliminarlos sin orden de Ricardo.

---

## CIERRE

Al terminar Fase 5, espera instrucción de Ricardo para:
1. Hacer commit (mensaje sugerido por ti).
2. Eliminar legacy files candidatos.
3. Push y deploy a Vercel preview branch.
4. Validación post-deploy en staging URL.

**No deployes a producción tú.** Eso es decisión de Ricardo después de revisar el preview.

---

**Fin del prompt.** Si tienes cualquier ambigüedad antes de empezar, pregunta a Ricardo. **No improvises.**
