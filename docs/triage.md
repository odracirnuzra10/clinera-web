# Triage — formulario interno de reportes (`/triage`)

Puerta de entrada de los reportes del equipo no técnico de OACG (comercial,
onboarding, capacitación, administración). Cada envío se convierte en una issue
en el buzón de **Triage** de Linear, donde el CTO le pone severidad antes de que
entre al tablero.

- **Página:** [`src/app/triage/page.tsx`](../src/app/triage/page.tsx)
- **Formulario:** [`src/app/triage/TriageForm.tsx`](../src/app/triage/TriageForm.tsx)
- **Validación compartida:** [`src/app/triage/validation.ts`](../src/app/triage/validation.ts)
- **Endpoint server-side:** [`src/app/api/triage/route.ts`](../src/app/api/triage/route.ts)
- **Tests:** [`tests/triage.spec.ts`](../tests/triage.spec.ts)

---

## Por qué hay un endpoint propio y no se llama a n8n desde el navegador

El webhook de n8n está protegido por un token compartido. Si ese token viajara
en el bundle del cliente, cualquiera que abra el inspector podría leerlo e
inundar el buzón de Triage.

```
Navegador  →  POST /api/triage           (sin token)
Servidor   →  POST $TRIAGE_N8N_URL       header: X-Triage-Token: $TRIAGE_FORM_SECRET
```

El token se lee de `process.env` dentro de un Route Handler con
`runtime = "nodejs"`, así que nunca entra al bundle del cliente.

---

## Variables de entorno

Ambas son **requeridas**. Van en `.env.local` en desarrollo y en las variables
de entorno del proceso en producción (`.env*` está en `.gitignore`).

```bash
TRIAGE_N8N_URL=https://n8n.oacg.cl/webhook/triage
TRIAGE_FORM_SECRET=<el mismo valor configurado en n8n>
```

| Variable | Qué es |
|---|---|
| `TRIAGE_N8N_URL` | URL del webhook de n8n que crea la issue en Linear. |
| `TRIAGE_FORM_SECRET` | Secreto compartido. Se manda en el header `X-Triage-Token` y n8n lo compara. |

Si falta cualquiera de las dos, `/api/triage` responde **503** con un mensaje
visible. Es a propósito: un reporte que se pierde en silencio es peor que un
error en pantalla. No hay no-op elegante como en `/api/meta/capi`.

Después de cambiarlas hay que reiniciar el proceso — se leen al cargar el módulo.

---

## Contrato con n8n

`POST` con `Content-Type: application/json`. El body lleva **exactamente** estos
siete campos, ni uno más:

```json
{
  "reportante_nombre": "Rebeca Navarro",
  "reportante_email": "rebeca@oacg.cl",
  "clinica": "Método Hebe Los Ángeles",
  "tipo": "bug",
  "titulo": "La agenda no muestra las horas del martes",
  "descripcion": "Entré a la agenda de la sucursal, cambié a la vista semanal y el martes aparece vacío.",
  "url_captura": "https://drive.google.com/..."
}
```

`tipo` es siempre `bug`, `solicitud` o `consulta`. `url_captura` puede venir
como string vacío.

**Respuesta esperada (200):**

```json
{
  "ok": true,
  "mensaje": "Listo. Tu reporte quedó registrado y el equipo ya fue avisado.",
  "issue": "OAC-57",
  "url": "https://linear.app/oacg/issue/OAC-57/..."
}
```

**Errores de validación (400):** `{ "ok": false, "errores": ["...", "..."] }`.
Cada string del array se muestra tal cual en pantalla.

### Cómo traduce el endpoint las respuestas

| Situación | Respuesta de `/api/triage` |
|---|---|
| n8n responde 200 | Se pasa el JSON de n8n tal cual. |
| n8n responde 400 con `errores` | 400 con los mismos `errores`. |
| n8n responde otro error | 502 con un mensaje genérico. |
| n8n caído o timeout (15 s) | 502 `"No pudimos enviar tu reporte…"`. |
| Falta config | 503. |

---

## Sin prioridad, a propósito

El formulario **no tiene** selector de severidad ni de prioridad. Eso lo decide
el CTO en Linear. Si quien reporta pudiera marcar su propio ticket como urgente,
todo sería urgente.

---

## Bloqueo de datos de pacientes (Ley 21.719)

La Ley 21.719 entra en vigencia el **1 de diciembre de 2026**. Los datos de
salud son categoría sensible y las multas llegan a 20.000 UTM. Un RUT escrito
acá terminaría replicado en Linear, en Gmail y en Google Chat.

`detectarDatosPaciente()` revisa `titulo` + `descripcion` y bloquea el envío si
encuentra lo que parece un RUT, un teléfono chileno o un correo externo a
`@oacg.cl`. Los patrones son deliberadamente amplios: preferimos un falso
positivo (la persona reescribe la frase) a filtrar el RUT de una paciente.

La validación corre **en los dos lados**. La del navegador da feedback rápido;
la del servidor es la que manda, porque la del navegador se salta con un `curl`.

Además hay una nota permanente bajo el campo de descripción, visible siempre y
no sólo cuando la detección se dispara.

---

## El workflow de n8n

`OACG TECH | Triage (Formulario Web) → Linear` (id `0NwF96A4d8iweADN`), activo.

```
Webhook (header auth) → Validar reporte → ¿Válido? ─┬─ sí → Linear issueCreate ─┬─ ok    → Responder OK (200)
                                                    │                           └─ falla → Responder fallo (502)
                                                    └─ no → Responder errores (400)
```

| Nodo | Qué hace |
|---|---|
| **Webhook Triage** | `POST /webhook/triage`. Autenticación por header con la credencial `Triage Form Secret` (`X-Triage-Token`). n8n corta con 403 antes de ejecutar nada si el token no calza. |
| **Validar reporte** | Revalida los siete campos y vuelve a correr los tres patrones de datos de pacientes. Arma el título y la descripción markdown de la issue. |
| **Linear: crear issue** | `issueCreate` por GraphQL contra el equipo OACG, forzando el estado **Triage**. Usa la credencial `Linear API (Triage)`. |
| **Responder fallo Linear** | Rama de error del nodo de Linear. Sin ella, un fallo devolvía **200 con el cuerpo vacío** — lo peor posible, porque el cliente no puede distinguirlo de un éxito. |

La validación está duplicada a propósito: el webhook es una superficie propia y
quien tenga el token se saltaría el endpoint de Clinera por completo.

Las issues entran **sin prioridad** y con el título prefijado por tipo
(`[Bug]`, `[Solicitud]`, `[Consulta]`).

### Credenciales que usa

| Credencial | Tipo | Para qué |
|---|---|---|
| `Triage Form Secret` | `httpHeaderAuth` | Valida el `X-Triage-Token` entrante. Su valor es el mismo `TRIAGE_FORM_SECRET` de Vercel. |
| `Linear API (Triage)` | `httpHeaderAuth` | `Authorization` con una personal API key de Linear (`lin_api_…`), sin prefijo `Bearer`. |

---

## Verificado

Cadena completa en producción, confirmada con el log de ejecución de n8n
(`user-agent: node`, IP de AWS — es decir, la petición vino de la función de
Vercel y no de una terminal):

```
navegador → www.clinera.io/api/triage → n8n (token aceptado) → Linear
```

- Un envío válido crea la issue y devuelve `{ ok: true, issue, url }`. Probado:
  `OACG-105` y `OACG-106`, ambas en el buzón de **Triage**, sin prioridad
  (canceladas después — eran de prueba).
- Un RUT enviado por `curl` saltándose el navegador se corta con 400 y **Linear
  no recibe nada**.
- Un correo fuera de `@oacg.cl` se corta con 400.
- Un `Origin` de otro sitio se corta con 403.
- Sin token o con token incorrecto, el webhook responde 403.
- Un fallo de Linear devuelve 502 con mensaje legible, nunca un 200 vacío.
- `TRIAGE_FORM_SECRET` no aparece en `.next/static` tras `next build`.

Los 12 tests de [`tests/triage.spec.ts`](../tests/triage.spec.ts) pasan:

```bash
npx playwright test tests/triage.spec.ts
```

### Dónde viven las variables

El proyecto de Vercel que sirve `www.clinera.io` es **`clinera-website`** — no
`clinera-web`, que es otro proyecto del mismo equipo. Conviene identificarlo por
dominio y no por nombre antes de tocar variables.

---

## Pendientes

- **`/triage` no está detrás de un login.** El repo no tiene sesiones: el único
  "auth" es [`useAdminAuth`](../src/app/admin/useAdminAuth.ts), una contraseña
  hardcodeada en el cliente contra `sessionStorage`, que no identifica a nadie.
  Por eso los campos de nombre y correo **no se precargan**: no hay de dónde.
  El endpoint mitiga con dominio `@oacg.cl` obligatorio, guard de mismo origen y
  rate limit de 5 envíos por minuto por IP — mitigación, no autenticación. El
  rate limit es en memoria y por instancia: se reinicia en cada deploy.
- **Sugerencias de clínica.** El campo usa un `<datalist>` alimentado por
  [`src/content/clinics.ts`](../src/content/clinics.ts), que es el directorio
  público de marketing, no el listado operativo de clínicas. Por eso el campo
  acepta texto libre: si la clínica no está en la lista, se escribe igual.
- **Doble envío.** Lo bloquea el cliente (ref + botón deshabilitado). Si se
  quiere garantía end-to-end habría que agregar una clave de idempotencia, y eso
  requiere cambiar el contrato con n8n.
- **Un reporte que falla se pierde.** Si Linear está caído, la persona ve un 502
  y puede reintentar, pero nadie más se entera: no hay reintento automático ni
  cola de reproceso. El texto del reporte sólo existe en el navegador de quien
  lo escribió. Si esto pasa seguido, el arreglo es un nodo de aviso a Google
  Chat en la rama de error del workflow.
