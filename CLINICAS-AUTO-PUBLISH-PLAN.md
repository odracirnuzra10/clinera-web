# Auto-publicación de clínicas en `clinera.io/clinicas` — Plan técnico (V1)

> **Audiencia**: equipo de producto + ingeniería de Clinera (app principal) y ops (n8n).
> **Objetivo**: pasar de "Ricardo agrega cada clínica a mano editando `clinics.ts`" a "el cliente firma opt-in en su onboarding y la página queda publicada en ≤24h con un merge humano de 30 segundos".
> **Alcance V1**: flujo end-to-end mínimo viable. Sin dashboard interno, sin foto hero, sin despublicación automática. Esos quedan para V2 (sección 11).
> **Estimado V1**: ~1.5 semanas de 1 persona full-stack (FE + BE) + 0.5 día de ops para el workflow n8n.

---

## 1. Por qué híbrido GitOps y no API runtime

| Criterio | API runtime (DB en vivo) | **GitOps híbrido (esto)** |
|---|---|---|
| SEO (SSG, indexable rápido) | ❌ SSR/ISR — más lento | ✅ Páginas estáticas pre-renderizadas |
| Type-safety | ❌ Runtime checks | ✅ TypeScript falla en build |
| Control editorial | ❌ Spam/copy malo se publica directo | ✅ Review humano de 30s en el PR |
| Auditoría de consentimiento | ⚠️ Solo en DB | ✅ DB **+** commit en git, inmutable |
| Despublicación verificable | ⚠️ Soft delete | ✅ Diff visible: `consentGranted: false` |
| Costo operativo | Alto (DB, panel admin, validaciones) | Bajo (n8n + GitHub API) |
| Friction para cliente | Cero | Cero (espera ≤24h) |

**Veredicto**: GitOps gana en todos los ejes salvo "tiempo a publicación" (24h vs <1min). 24h es aceptable y desbloquea revisión editorial → no se publica nada feo a producción.

---

## 2. Arquitectura

```
┌─────────────────────┐    1. cliente firma opt-in     ┌────────────────────┐
│   App Clinera FE    │ ─────────────────────────────► │  Backend Clinera   │
│   (wizard 8 pasos)  │                                │  (Node/Postgres)   │
└─────────────────────┘                                └─────────┬──────────┘
                                                                 │
                                                  2. POST webhook │
                                                                 ▼
                                                  ┌──────────────────────────┐
                                                  │  n8n workflow            │
                                                  │  "Clinera Directory      │
                                                  │   → Auto PR"             │
                                                  └─────────┬────────────────┘
                                                            │
                                          3. GitHub API     │
                                                            ▼
                            ┌───────────────────────────────────────────────┐
                            │  Repo  odracirnuzra10/clinera-web             │
                            │  - branch: auto/add-clinic-{slug}             │
                            │  - edita: src/content/clinics.ts              │
                            │  - abre PR a main                             │
                            └─────────────────┬─────────────────────────────┘
                                              │
                                   4. review + merge (humano, 30s)
                                              │
                                              ▼
                            ┌───────────────────────────────────────────────┐
                            │  Vercel auto-deploy                           │
                            │  → clinera.io/clinicas/{slug}  LIVE           │
                            └─────────────────┬─────────────────────────────┘
                                              │
                                   5. webhook "PR merged"
                                              ▼
                            ┌───────────────────────────────────────────────┐
                            │  Backend Clinera marca status=published       │
                            │  Loops manda email "tu clínica está live"     │
                            └───────────────────────────────────────────────┘
```

---

## 3. Tarea 1 — Wizard de opt-in en app Clinera (FE)

**Asignable a**: dev frontend de la app Clinera.
**Estimado**: 3-4 días.

### 3.1 Pantalla / pantallas

Ubicación sugerida: **dentro de "Configuración → Perfil público"** (no en onboarding inicial — el cliente no tiene aún data completa para llenar el wizard).

Punto de entrada: card vacía "Aparece en clinera.io/clinicas — captá pacientes desde Google" + botón "Activar perfil público".

### 3.2 Campos del wizard (8 pasos lineales o single-page)

Marcado con ✱ los **requeridos**. El resto opcional pero recomendado.

| Campo | Tipo | Validación | Notas |
|---|---|---|---|
| `nombre` ✱ | text | min 3 chars | Pre-llenado con `clinic.name` del onboarding |
| `slug` ✱ | text | regex `^[a-z0-9-]+$`, único | Auto-sugerido del nombre, editable |
| `ciudad` ✱ | text | min 2 chars | Pre-llenado si lo tienen |
| `region` ✱ | text | min 2 chars | Ej. "Región Metropolitana", "Pichincha" |
| `comuna` | text | — | Solo CL/MX |
| `countryCode` ✱ | select | enum CL/PE/CO/MX/AR/EC/UY/CR/PA | Pre-llenado |
| `direccion` | text | — | Calle, número, oficina, ciudad |
| `telefono` | text | E.164 si no vacío | Validación con `libphonenumber-js` |
| `whatsapp` ✱ | text | E.164 estricto | Es el CTA principal de la página, no puede faltar |
| `webOriginal` | url | https opcional | Sin protocolo se autocompleta `https://` |
| `especialidades` ✱ | multi-select + custom | min 3, max 12 | Catálogo seed (ver 3.3) + libre |
| `profesionales` | repeater | nombre + especialidad por item | Hasta 5 |
| `horario` | text libre | — | Formato sugerido: `"Lunes a viernes 09:00 a 19:00"` |
| `descripcion` ✱ | textarea | min 200, max 600 chars | Contador en vivo |
| `testimonio.quote` | text | max 200 chars | Cita textual del dueño |
| `testimonio.metric` | text | max 80 chars | Ej. `"−71% en costos de marketing"` |
| `consentGranted` ✱ | checkbox | debe estar `true` | Texto legal abajo |

**Texto legal del checkbox** (copy literal):

> Autorizo a Clinera a publicar una página pública con los datos de mi clínica en clinera.io/clinicas/{slug}. Puedo retirar esta autorización en cualquier momento desde Configuración → Perfil público. Acepto que la página puede ser indexada por Google y otros buscadores.

### 3.3 Catálogo seed de especialidades

Para el multi-select, partir de este array (extender después según tracking de "custom" más usados):

```ts
const ESPECIALIDADES_SEED = [
  // Médicas
  "Medicina general", "Medicina interna", "Medicina familiar",
  "Pediatría", "Ginecología", "Dermatología", "Cardiología",
  "Traumatología", "Neurología", "Psiquiatría", "Endocrinología",
  "Oftalmología", "Otorrinolaringología", "Urología",
  // Estética
  "Estética facial", "Estética corporal", "Medicina estética",
  "Tratamientos láser", "Depilación láser", "HIFU facial", "HIFU corporal",
  "Radiofrecuencia", "Criolipólisis", "Lifting facial coreano",
  "Rejuvenecimiento facial", "Tratamiento de flacidez",
  // Dental
  "Odontología general", "Ortodoncia", "Implantología",
  "Endodoncia", "Periodoncia", "Estética dental",
  // Otras
  "Kinesiología", "Fisioterapia", "Nutrición", "Psicología",
  "Telemedicina", "Medicina regenerativa", "PRP", "Tratamiento del dolor",
  "Salud metabólica", "Bienestar integral", "Masajes terapéuticos",
];
```

### 3.4 Estados visibles para el cliente

Mostrar en la UI del wizard / dashboard:

| Estado | Significado para el cliente |
|---|---|
| `draft` | Empezaste el wizard pero no enviaste todavía |
| `pending_review` | "Tu perfil está en revisión. Suele tardar menos de 24h." |
| `published` | "Tu página está en vivo: [link]" |
| `withdrawn` | "Tu perfil público está pausado" |
| `rejected` | "Necesitamos ajustar algunos datos. Revisá tu email." (raro) |

---

## 4. Tarea 2 — Backend Clinera: persistencia + webhook trigger (BE)

**Asignable a**: dev backend de la app Clinera.
**Estimado**: 2 días.

### 4.1 Migración DB nueva

```sql
CREATE TABLE clinic_directory_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  payload JSONB NOT NULL,                  -- snapshot completo de los campos del wizard
  status VARCHAR(20) NOT NULL DEFAULT 'pending_review',
                                            -- draft | pending_review | published | withdrawn | rejected
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pr_url TEXT,                             -- llenado por n8n con la URL del PR
  pr_number INT,                           -- llenado por n8n
  published_url TEXT,                      -- llenado al merge: https://clinera.io/clinicas/<slug>
  published_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  rejected_reason TEXT,
  created_by_user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clinic_directory_consent_clinic_id ON clinic_directory_consent(clinic_id);
CREATE INDEX idx_clinic_directory_consent_status ON clinic_directory_consent(status);
```

### 4.2 Endpoint REST

```
POST /api/clinic-directory/submit
Auth: session del cliente logueado
Body: payload del wizard (todos los campos de la sección 3.2)

Response 200:
{
  "id": "uuid",
  "slug": "metodo-hebe-vitacura",
  "status": "pending_review",
  "estimated_publish_window": "24h"
}

Response 409: { "error": "slug_taken", "suggested": "metodo-hebe-vitacura-2" }
Response 422: { "error": "validation", "fields": { "whatsapp": "must be E.164" } }
```

Validaciones server-side (no confiar solo en FE):
- `whatsapp` cumple regex E.164: `^\+[1-9]\d{7,14}$`
- `slug` único en `clinic_directory_consent` (status != withdrawn) **y** no colisiona con clínicas hardcoded en `src/content/clinics.ts` (mantener una lista en config o env).
- `descripcion.length` entre 200 y 600
- `especialidades.length >= 3`
- `consentGranted === true`

### 4.3 Webhook trigger después del INSERT

Después de persistir, dispara HTTP POST a:

```
POST https://clinerasoftware.app.n8n.cloud/webhook/clinic-directory-auto-pr
Headers: X-Clinera-Token: <secret-shared-with-n8n>
Body:
{
  "consent_id": "<uuid>",
  "slug": "metodo-hebe-vitacura",
  "payload": { ...todos los campos del wizard... },
  "client_email": "owner@clinic.com",
  "submitted_at": "2026-04-25T19:30:00Z"
}
```

Si falla la HTTP request: log + retry con backoff (3 intentos), y si siguen fallando, marcar `status='draft'` con error y notificar Google Chat de ops.

### 4.4 Endpoint para webhook inverso (PR merged)

```
POST /api/clinic-directory/webhook/pr-merged
Auth: shared secret en header `X-GitHub-Webhook-Secret`
Body (de n8n o GitHub Actions):
{
  "consent_id": "<uuid>",
  "pr_number": 142,
  "pr_url": "https://github.com/.../pull/142",
  "merged_at": "2026-04-25T20:00:00Z",
  "published_url": "https://clinera.io/clinicas/metodo-hebe-vitacura"
}
```

Acción: `UPDATE clinic_directory_consent SET status='published', published_url=..., published_at=... WHERE id=<consent_id>`. Dispara Loops event `clinic_directory_published`.

---

## 5. Tarea 3 — n8n workflow: "Clinera Directory → Auto PR"

**Asignable a**: ops / quien mantiene n8n.
**Estimado**: 1-2 días.

### 5.1 Trigger

- Webhook node con path `/webhook/clinic-directory-auto-pr`
- Validar header `X-Clinera-Token` contra credencial guardada en n8n.

### 5.2 Pasos del workflow

```
1. Webhook (recibe payload del backend Clinera)
   │
   ▼
2. Validate (Code node)
   - Re-valida slug regex y E.164
   - Si falla → HTTP back al backend con error → end
   │
   ▼
3. GitHub: GET file (HTTP node)
   GET /repos/odracirnuzra10/clinera-web/contents/src/content/clinics.ts
   Authorization: token <PAT_DEL_BOT>
   Saves: file_sha, current_content (base64)
   │
   ▼
4. Build new content (Code node — ver script abajo)
   - Decode base64 → string
   - Insert nueva entrada antes del cierre `];`
   - Re-encode a base64
   - Output: new_content_b64
   │
   ▼
5. GitHub: Create branch (HTTP node)
   POST /repos/odracirnuzra10/clinera-web/git/refs
   { "ref": "refs/heads/auto/add-clinic-<slug>",
     "sha": "<latest_main_sha>" }
   │
   ▼
6. GitHub: Update file in branch (HTTP node)
   PUT /repos/odracirnuzra10/clinera-web/contents/src/content/clinics.ts
   { "message": "auto: add <nombre> (<ciudad>) to clinics dataset",
     "content": "<new_content_b64>",
     "branch": "auto/add-clinic-<slug>",
     "sha": "<file_sha>" }
   │
   ▼
7. GitHub: Open PR (HTTP node)
   POST /repos/odracirnuzra10/clinera-web/pulls
   { "title": "auto: agrega clínica <nombre> (<ciudad>)",
     "head": "auto/add-clinic-<slug>",
     "base": "main",
     "body": "<plantilla con payload + link al consent record>",
     "labels": ["directory-clinic", "needs-review"] }
   │
   ▼
8. PATCH backend Clinera (HTTP node)
   POST /api/clinic-directory/webhook/pr-opened
   { "consent_id": "<uuid>",
     "pr_url": "<url>",
     "pr_number": <number> }
   │
   ▼
9. Notify Google Chat (HTTP node)
   "Nueva solicitud de directorio: <nombre> (<ciudad>) → <pr_url>"
```

### 5.3 Code node "Build new content" (paso 4)

```js
const fileContent = Buffer.from($json.content, 'base64').toString('utf-8');
const payload = $('Webhook').item.json.payload;

// Genera la nueva entrada como string TS válido
const entry = `  // ========================================
  // ${payload.nombre.toUpperCase()} (${payload.ciudad}, ${payload.countryCode}) — auto-publicado ${new Date().toISOString().slice(0,10)}
  // ========================================
  {
    slug: "${payload.slug}",
    nombre: ${JSON.stringify(payload.nombre)},
    ciudad: ${JSON.stringify(payload.ciudad)},
    region: ${JSON.stringify(payload.region)},
    countryCode: "${payload.countryCode}",${payload.comuna ? `\n    comuna: ${JSON.stringify(payload.comuna)},` : ''}${payload.direccion ? `\n    direccion: ${JSON.stringify(payload.direccion)},` : ''}${payload.telefono ? `\n    telefono: ${JSON.stringify(payload.telefono)},` : ''}
    whatsapp: ${JSON.stringify(payload.whatsapp)},${payload.webOriginal ? `\n    webOriginal: ${JSON.stringify(payload.webOriginal)},` : ''}
    especialidades: ${JSON.stringify(payload.especialidades, null, 2).replace(/\n/g, '\n    ')},${payload.profesionales && payload.profesionales.length ? `\n    profesionales: ${JSON.stringify(payload.profesionales, null, 2).replace(/\n/g, '\n    ')},` : ''}${payload.horario ? `\n    horario: ${JSON.stringify(payload.horario)},` : ''}
    descripcion: ${JSON.stringify(payload.descripcion)},${payload.testimonio ? `\n    testimonio: ${JSON.stringify(payload.testimonio, null, 2).replace(/\n/g, '\n    ')},` : ''}
    publishedAt: "${new Date().toISOString().slice(0,10)}",
    consentGranted: true,
  },
`;

// Insert antes del cierre del array `];` que cierra `allClinics`
const newContent = fileContent.replace(
  /(\n)(\]\;\s*\n\s*\/\/ Slugify helper)/,
  `${entry}$1$2`
);

if (newContent === fileContent) {
  throw new Error('No se pudo insertar la entrada — formato del archivo cambió');
}

return { content: Buffer.from(newContent, 'utf-8').toString('base64') };
```

> ⚠️ El regex de inserción depende del formato actual de `clinics.ts`. Si Ricardo refactoriza ese archivo, hay que actualizar el regex. Solución más robusta a futuro: marcar el punto de inserción con un comentario sentinel `// AUTO_INSERT_HERE` en el TS.

### 5.4 Plantilla del PR body

```markdown
**Auto-PR generado por n8n** — solicitud de publicación en directorio público.

## Datos enviados por el cliente

- **Nombre**: {{nombre}}
- **Slug**: `{{slug}}` → publicará en `https://clinera.io/clinicas/{{slug}}`
- **Ciudad / país**: {{ciudad}}, {{region}}, {{countryCode}}
- **WhatsApp**: {{whatsapp}}
- **Especialidades**: {{especialidades.join(', ')}}
- **Web original**: {{webOriginal}}
- **Solicitado por**: {{client_email}}
- **Consent ID**: `{{consent_id}}`
- **Submitted at**: {{submitted_at}}

## Checklist de review (mergea cuando todo OK)

- [ ] Copy de `descripcion` correcto, sin errores ortográficos ni promesas falsas
- [ ] Foto hero / logo apropiados (si aplica en V2)
- [ ] WhatsApp contestado por la clínica real (probar manualmente)
- [ ] No es spam ni clínica duplicada del mismo dueño
- [ ] Especialidades dentro de scope clínico
- [ ] CI verde (typecheck + lint)

## Si rechazás

1. Cerrá el PR sin merge
2. Backend Clinera marca status `rejected` automáticamente vía webhook
3. Loops manda email al cliente con motivo (editás vos en el dashboard de Loops)
```

### 5.5 PAT del bot user

Crear un GitHub user dedicado (ej. `clinera-directory-bot`):
- Permisos en repo `odracirnuzra10/clinera-web`: `contents: write`, `pull_requests: write`
- Generar PAT con scope `repo`
- Guardar en n8n como credencial encrypted

---

## 6. Tarea 4 — Review humano (proceso, no código)

**Asignable a**: Ricardo o un colaborador con permisos de merge.
**Esfuerzo**: ~30 segundos por PR.

Workflow:
1. Notificación llega a Google Chat (ver paso 9 del workflow n8n)
2. Click al PR → revisar checklist del PR body
3. Diff: solo debería tocar `src/content/clinics.ts` (agregar 1 entrada)
4. CI debe pasar (typecheck + lint corre auto)
5. **Si aprueba**: "Squash and merge"
6. **Si rechaza**: "Close" + comentar el motivo en el PR

**Regla**: si el PR toca cualquier archivo distinto de `src/content/clinics.ts`, **NO mergear** y avisar al equipo de ops — el bot puede haber sido comprometido o el script tiene bug.

---

## 7. Tarea 5 — Notificación post-publish (Loops + dashboard)

**Asignable a**: dev backend Clinera + ops (Loops template).
**Estimado**: 0.5 día.

Cuando el PR se mergea:
- GitHub Action en `clinera-web` (o webhook de GitHub) llama al endpoint de la sección 4.4
- Backend marca `status='published'` y dispara Loops event `clinic_directory_published`
- Loops template manda email al `client_email`:
  ```
  ¡Tu perfil público está en vivo!

  Mirá tu página: https://clinera.io/clinicas/{{slug}}
  Compartila por WhatsApp y redes para empezar a captar pacientes.

  Tip: agregá el link en tu Instagram bio.
  ```
- Dashboard del cliente muestra card "Perfil público — publicado el {{published_at}}" con botón "Editar datos" (V2) y "Pausar" (V2).

### 7.1 GitHub Action mínimo (`.github/workflows/notify-merged-pr.yml`)

```yaml
name: Notify Clinera on directory PR merge
on:
  pull_request:
    types: [closed]
    branches: [main]
jobs:
  notify:
    if: github.event.pull_request.merged == true && contains(github.event.pull_request.labels.*.name, 'directory-clinic')
    runs-on: ubuntu-latest
    steps:
      - name: Extract consent_id from PR body
        id: extract
        run: |
          CONSENT_ID=$(echo "${{ github.event.pull_request.body }}" | grep -oP 'Consent ID:\s*`\K[a-f0-9-]+')
          echo "consent_id=$CONSENT_ID" >> "$GITHUB_OUTPUT"
      - name: Notify Clinera backend
        run: |
          curl -X POST "${{ secrets.CLINERA_WEBHOOK_URL }}/api/clinic-directory/webhook/pr-merged" \
            -H "X-GitHub-Webhook-Secret: ${{ secrets.CLINERA_WEBHOOK_SECRET }}" \
            -H "Content-Type: application/json" \
            -d "{
              \"consent_id\": \"${{ steps.extract.outputs.consent_id }}\",
              \"pr_number\": ${{ github.event.pull_request.number }},
              \"pr_url\": \"${{ github.event.pull_request.html_url }}\",
              \"merged_at\": \"${{ github.event.pull_request.merged_at }}\"
            }"
```

Secretos a configurar en GitHub repo settings:
- `CLINERA_WEBHOOK_URL`: base URL del backend Clinera
- `CLINERA_WEBHOOK_SECRET`: shared secret con backend

---

## 8. Schema actual de `src/content/clinics.ts` (referencia)

El bot debe respetar **exactamente** este shape (copiado del archivo actual):

```ts
export type Clinic = {
  slug: string;
  nombre: string;
  ciudad: string;
  region: string;
  countryCode: "CL" | "PE" | "CO" | "MX" | "AR" | "EC" | "PA";
  comuna?: string;
  direccion?: string;
  telefono?: string;
  whatsapp: string;
  webOriginal?: string;
  especialidades: string[];
  profesionales?: { nombre: string; especialidad: string }[];
  horario?: string;
  descripcion: string;
  testimonio?: { quote: string; metric?: string };
  logoUrl?: string;
  heroImageUrl?: string;
  publishedAt: string;        // ISO date YYYY-MM-DD
  updatedAt?: string;
  consentGranted: boolean;
};
```

Si el equipo de Clinera quiere extender el schema (ej. agregar `hours` granular, agregar `instagramUrl`, etc.), **primero** abrir PR en `clinera-web` que extienda el type, mergearlo, y **después** actualizar el wizard. Nunca al revés.

Países nuevos: si el wizard ofrece un país que no está en el union (ej. `BR`), backend rechaza con `422`. El equipo de Clinera abre PR en `clinera-web` para extender el union antes.

---

## 9. Validación / criterios de aceptación V1

V1 está listo cuando:

1. Cliente prueba el wizard end-to-end y ve `pending_review` al enviar.
2. PR aparece automáticamente en `clinera-web` en menos de 30 segundos.
3. Google Chat recibe la notificación.
4. PR mergeado → `https://clinera.io/clinicas/<slug>` rinde HTTP 200 en ≤2 minutos (Vercel deploy).
5. Cliente recibe email Loops "tu perfil está en vivo" en ≤5 minutos del merge.
6. Backend marca `status='published'` correctamente.
7. Si cliente intenta enviar slug que ya existe, recibe `409 slug_taken` con sugerencia.
8. Si cliente intenta enviar `whatsapp` sin formato E.164, recibe `422` con mensaje claro.
9. Si bot mete entrada con TS inválido (no debería pasar pero), CI falla y PR no se puede mergear.

---

## 10. Edge cases y rollback

### 10.1 Cliente quiere editar datos después de publicado

**V1**: cliente vuelve al wizard, modifica, envía → backend genera **nuevo PR** que pisa la entrada con `slug` igual. n8n debe detectar que el slug ya existe en `consent` con status `published` y usar un script de **update** en lugar de insert.

### 10.2 Cliente cancela su Clinera (deja de pagar)

**V1**: ops abre manualmente un PR que pasa esa entrada a `consentGranted: false`. La página devuelve 404 al siguiente deploy.
**V2**: webhook automático de Stripe `customer.subscription.canceled` → n8n abre PR `withdraw-clinic-{slug}`.

### 10.3 Cliente quiere despublicar (sin cancelar Clinera)

**V1**: endpoint backend `POST /api/clinic-directory/withdraw` → backend marca status `withdrawn` + dispara n8n flow inverso → PR de update con `consentGranted: false`.

### 10.4 PR se queda sin mergear ≥48h

**V1**: cron en n8n cada 24h → si hay PRs label `directory-clinic` abiertos hace >48h → notificar Google Chat con escalation.

### 10.5 Bot PAT comprometido

Si alguien malicioso obtiene el PAT, podría abrir PRs arbitrarios. Mitigación:
- PAT scopeado solo al repo `clinera-web`
- Etiqueta `directory-clinic` requerida — si un PR no la tiene, no se procesa
- Revisión humana obligatoria antes de merge (Branch protection rules en GitHub)

---

## 11. Roadmap V2 (después de validar V1)

- **Foto hero + logo upload**: integración con Cloudinary o similar. URL queda en `heroImageUrl` / `logoUrl` del payload.
- **Despublicación automática** (sección 10.2 y 10.3).
- **Edición desde dashboard** (sección 10.1) con UI de diff antes del envío.
- **Dashboard interno**: panel con todos los `clinic_directory_consent` y filtros por status, ciudad, país.
- **Auto-merge para clínicas trusted**: clientes con +6 meses de antigüedad y sin reportes negativos pueden saltar el review (auto-merge si CI pasa).
- **Multi-idioma**: campo `descripcion_en` opcional. Generar `/clinicas/<slug>` y `/en/clinics/<slug>` con hreflang.
- **Foto del CEO/dueño firma digital del consent** (compliance ++).
- **Métricas para el cliente**: panel en dashboard con "tu página tiene X visitas / Y clicks WhatsApp este mes" (Vercel Analytics + GA4).

---

## 12. Resumen ejecutable

| # | Tarea | Owner | Días | Dep |
|---|---|---|---|---|
| T1 | Wizard FE (8 campos + checkbox legal) | dev FE Clinera | 3-4 | — |
| T2 | Backend: tabla + endpoint + webhook trigger | dev BE Clinera | 2 | — |
| T3 | n8n workflow Clinera Directory → Auto PR | ops | 1-2 | T2 |
| T4 | GitHub Action notify-merged-pr | dev BE | 0.5 | T2 |
| T5 | Loops template "tu clínica está en vivo" | ops/marketing | 0.5 | T2 |
| T6 | Crear bot user GitHub + PAT + branch protection | ops | 0.5 | — |
| T7 | Pruebas end-to-end con 2 clínicas reales | QA / Ricardo | 0.5 | T1-6 |

**Total V1**: ~8-10 días-persona, en paralelo se entrega en ~1.5 semanas calendario.

**Después de V1**: dejar 1 mes de operación con merge manual para detectar edge cases reales antes de meter automatización extra de V2.
