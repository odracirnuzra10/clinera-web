<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mantén este archivo al día

Orden permanente de Ricardo (2026-08-19): **cuando aprendas algo significativo
trabajando en este repo, anótalo acá.** Significativo = lo que haría que el
próximo que abra el proyecto se equivoque si no lo sabe: una decisión de
negocio con un número detrás, un contrato entre sistemas, una trampa que ya
costó un error.

Dos reglas para que no se pudra:

1. **Punteros, no copias.** Las tablas y los valores viven en su fuente
   (`pricing.ts`, el README de `integrations/n8n/`, el código). Acá va qué
   existe, por qué, y dónde mirar. Duplicar tablas las desincroniza.
2. **El porqué antes que el qué.** El qué se lee del código; el porqué no.

# Economía de Clinera: créditos, costos y precios

Antes de tocar cualquier número de precio, crédito, consumo o equivalencia en
el sitio, lee esta sección completa. Los números están entrelazados: cambiar
una tarifa sin recalcular las equivalencias deja el sitio contradiciéndose a
sí mismo, que es exactamente el estado del que se salió en agosto 2026.

## Fuente única de verdad

`src/content/pricing.ts` es la fuente canónica de precios de planes y add-ons.
Alimenta `/planes`, `/cotizacion` y **la generación de contratos firmados** en
`src/lib/firma/cotizacion.ts`. Un número mal puesto ahí sale en un contrato,
no solo en una landing.

Las tarifas de consumo por crédito viven duplicadas en las dos calculadoras
(`src/components/cro/ConsumptionCalculator.tsx` y
`src/components/planes-pro/ConsumoCalculator.tsx`). Si cambias una, cambia la
otra.

## Un solo modo de agendamiento: Agentic

Clinera opera **exclusivamente en modo Agentic** sobre **Kimi K2.6**. Los modos
Eficiente y Agentic Pro se eliminaron en agosto 2026 y no deben reaparecer en
copy, FAQs, comparativas ni contenido nuevo.

Clinera **no se integra con agendas de terceros** (Reservo, AgendaPro, Medilink,
Dentalink, Sacmed). Opera sobre su propia agenda, fichas clínicas y módulo de
pagos; la migración de datos se hace en el onboarding. Sí existen y se venden
Webhooks + API pública hacia n8n, Make y Zapier (Atlas y Summit) — esa
capacidad no debe confundirse con integración de agenda.

## La unidad: qué es un crédito

> **1.000 créditos = US$ 1 de costo de modelo.** Es decir, **1 crédito = US$ 0,001**.

El crédito es una envoltura del costo real en OpenRouter, no una unidad
arbitraria. La cadena completa es:

```
tokens  ->  US$ (tarifa del modelo en OpenRouter)  ->  créditos (x 1.000)
```

Dicho al revés, que es como se lee más rápido: **la bolsa de créditos de un plan
es su presupuesto de gasto en OpenRouter, en milésimas de dólar.** Los 28.000
créditos de Vortex son US$ 28 de consumo real; los 46.000 de Summit, US$ 46.

> [!IMPORTANT]
> Equivalencia **confirmada por Ricardo (agosto 2026)**. Es además la única
> escala que hace cuadrar tres cosas a la vez: la política interna de COGS
> 10–20%, los volúmenes de tokens medidos (16,1M tokens por clínica/mes) y los
> precios de plan publicados. La alternativa de 1 crédito = US$ 1 daría un COGS
> de 10.000% y es inviable — si alguien la propone, está mal.
> Si algún día cambia la escala, **hay que recalcular toda esta sección** y las
> dos calculadoras.

## Costo real del modelo (OpenRouter, verificado agosto 2026)

`moonshotai/kimi-k2.6`:

| Concepto | USD / 1M tokens |
|---|---|
| Input | 0,600 |
| Output | 3,410 |
| Cache read | 0,200 |

**Costo efectivo: US$ 0,727 / 1M tokens**, asumiendo 42,9% de cache hit (medido
en el panel de OpenRouter) y un mix agéntico de ~90% input / ~10% output. El
input pesa tanto porque en cada turno se reenvían system prompt, definiciones
de tools e historial.

A esa tarifa, **1 crédito ≈ 1.376 tokens**.

Referencia de otros modelos con el mismo método (para comparar, no en uso):
Gemini 2.5 Flash US$ 0,416/1M (1,00x) · Gemini 3 Flash US$ 0,576/1M (1,39x) ·
Kimi K2.6 US$ 0,727/1M (1,75x).

## Tarifario de cara al cliente

| Concepto | Créditos | Costo interno | ≈ tokens Kimi |
|---|---|---|---|
| Conversación que **no** termina en cita | 30 | US$ 0,030 | 41.265 |
| Conversación que agenda, reagenda o cancela | 195 | US$ 0,195 | 268.226 |
| Minuto de voz (CAMILA) | 25 | US$ 0,025 | 34.388 |
| Fiscalización de LIA | 0 | — | — |
| Informes de LIA | 4.000 / mes | US$ 4,000 | 5.502.063 |

La tarifa de texto fue 10 cr hasta agosto 2026; ese número era la tarifa del
modo Eficiente y quedó obsoleto al pasar todo por el modelo agéntico. **Si ves
"10 créditos por conversación" en algún lado, es residuo — corrígelo a 30.**

## Planes y margen

| Producto | Créditos | Precio | Venta / crédito | Costo | COGS | Margen | Markup |
|---|---|---|---|---|---|---|---|
| Vortex | 28.000 | US$ 279 | 0,00996 | US$ 28,00 | 10,0% | 90,0% | 9,96x |
| Atlas | 37.000 | US$ 379 | 0,01024 | US$ 37,00 | 9,8% | 90,2% | 10,24x |
| Summit | 46.000 | US$ 479 | 0,01041 | US$ 46,00 | 9,6% | 90,4% | 10,41x |
| Recarga | 5.000 | US$ 15 | 0,00300 | US$ 5,00 | **33,3%** | 66,7% | **3,00x** |

Equivalencias de consumo por plan (créditos ÷ tarifa, **siempre redondeando
hacia abajo**), que deben mantenerse sincronizadas en `pricing.ts`, las
calculadoras, `planes-faq.ts`, `/planes-pro` y `public/llms*.txt`:

| Plan | Conversaciones | Agendamientos |
|---|---|---|
| Vortex | ~933 | ~143 |
| Atlas | ~1.233 | ~189 |
| Summit | ~1.533 | ~235 |

La recarga rinde ~166 conversaciones o ~25 agendamientos.

El piso es obligatorio porque las calculadoras recomiendan plan con la regla
`bolsa ≥ créditos necesarios`: un número redondeado hacia arriba (p. ej. los
~190/~236 que se publicaron hasta agosto 2026) no cabe en la bolsa y hace que
la calculadora recomiende el plan siguiente al valor exacto prometido.

## Política de COGS

El techo operativo interno es que **el costo de IA no supere el 10–20% del
valor del plan** (definido en el deck interno `/26mayo`, sección "Política de
límites"). Los tres planes cumplen holgadamente.

**La recarga de US$ 15 es la excepción y está fuera de política**: 33,3% de
COGS, más de 3x peor que los planes. Vende el crédito a US$ 0,003 cuando dentro
del plan vale US$ 0,010. Para alinearla al 10–20% el pack de 5.000 créditos
tendría que costar entre US$ 25 y US$ 50. Es una decisión comercial pendiente,
no un bug — pero si alguien pregunta por qué la recarga tiene mal margen, la
respuesta es esta.

## Implementación y estructura de pago

**Resuelto por Ricardo (agosto 2026): la implementación vale US$ 450** — el
valor de `SETUP_FEE_USD` en `pricing.ts`, el mismo que va a los contratos
firmados. El US$ 750 que existió en `/planes-pro`, FAQ, calculadoras y
`public/llms*.txt` era residuo y ya se corrigió; si reaparece, es un error.

La estructura de pago se comunica en secuencia (estilo Vambe), y así la
renderizan las tarjetas de `<Pricing />` en home, `/planes` y `/planes-pro`:

- **Mes 1:** implementación, US$ 450, pago único.
- **Mes 2 en adelante:** el plan contratado (Vortex US$ 279 / Atlas US$ 379 /
  Summit US$ 479 al mes).

# Embudo de Meta Y Google Ads: qué evento vale cuánto, y dónde vive de verdad

> [!WARNING]
> **Leer solo este repo lleva a conclusiones falsas.** De los tres workflows
> que mandan conversiones al pixel `1104567405156111`, **dos no están
> versionados acá**. En agosto de 2026 se diseñó un cambio entero sobre la
> premisa —falsa— de que SQL+ no generaba ninguna señal, porque el repo no lo
> mostraba. Antes de tocar el embudo, mira la instancia de n8n.

| Evento | Cuándo | Valor | Dónde vive |
|---|---|---|---|
| `MQL` | el lead agenda en `/agenda` | — (Meta) / US$10 (Google Ads) | `integrations/n8n/clinera-agenda-reserva.workflow.json` (Meta) · repo `baserow` (Google, ver abajo) |
| `SQL` | el closer lo califica en `crm.oacg.cl` | US$ 100 | `integrations/n8n/crm-sql-twenty.workflow.json` **y** un segundo workflow que lee Baserow 152, sólo en n8n |
| `SQL_Plus` | el closer lo sube a propuesta | US$ 300 | sólo en n8n |

**Desde el 2026-08-21, Google Ads recibe el mismo embudo** (MQL/SQL/SQL+, mismos
montos salvo MQL en 10 USD) — no por CAPI, sino porque los tres workflows de
arriba marcan Baserow 152 y un feed nuevo en `baserow`
(`sales/n8n/gads-conversiones-sql-csv.js`) se lo sirve a Google Ads Data
Manager por HTTPS. El motivo (Data Manager no acepta push, sólo lee un
archivo) y el diseño completo viven en `baserow/sales/HANDOFF.md` — no se
duplican acá, sólo se apunta.

`SQL` y `SQL_Plus` son eventos **distintos a propósito**: dos peldaños del
embudo, no el mismo hecho contado dos veces. No los unifiques.

**La trampa que ya costó un doble cobro:** los dos workflows que mandan `SQL`
arman el `event_id` con el contacto hasheado, porque es lo único que ambos
sistemas comparten. Meta deduplica por (`event_name`, `event_id`), así que la
normalización tiene que quedar **idéntica** en los dos — un `trim()` de más en
uno rompe la colisión en silencio: los eventos siguen saliendo, Meta los sigue
aceptando, y el mismo lead se cuenta dos veces sin ningún error visible.

Ids, disparos y el detalle completo: `integrations/n8n/README.md`.

# `/agenda`: layout Hebe, agendador de siempre

La página canónica es `AgendaHebeLanding` (50/50, carousel, 5 pasos). El
calendario **no** es Cal.com: reusa `StepClineraScheduler` de
`VentasLanding.tsx` (nativo primero, embed de `app.clinera.io` de respaldo).
`/ventas` sigue con el wizard anterior. `/agenda-hebe` redirige a `/agenda`.

El aviso de Google Chat y Twenty los arma `OACG TECH | Wizard` (`A3wOPmhQjit8VswM`)
en n8n: en `/agenda` ya no se anuncia «Software actual». Van necesidad, cargo,
web/redes, ciudad, volumen y clínica. El botón «Agenda con tu ingeniero» abre
el calendario **sin esperar** el webhook — si se vuelve a `await`, se pierden leads.

# `/agenda`: la hora que se guarda es de Chile, siempre

El último paso de `/agenda` (`StepClineraNativo` en
`src/components/ventas/VentasLanding.tsx`) recibe los bloques de la API de
Clinera como texto plano en **hora de Chile** (`"10:00"`), sin zona.

- **Lo que se muestra** se convierte a la zona del visitante. Un dueño de
  clínica en México veía "10:00" y llegaba a una reunión que para él era a las
  08:00; ya pasó con un lead real.
- **Lo que se manda al webhook no se toca**: sigue siendo la hora de Chile.
  Clinera, el turno y el Meet dependen de eso.
- **El offset de Chile sale de `Intl`, nunca de una constante.** Chile pasa a
  GMT−3 el primer domingo de septiembre; un número escrito a mano empieza a
  mentir ese día sin que nadie se entere.

El profesional tampoco lo elige el visitante: se reparte según disponibilidad,
de forma **determinista**. Nada de `Math.random()` ahí — el cálculo corre en un
`useMemo` que se recalcula varias veces, y el azar le cambiaría el profesional
al lead entre que elige la hora y confirma.

Guardián: `tests/agenda-scheduler.spec.ts`.

# Landings `/software-medico` y `/software-dental`

Dueñas de los clusters de Google Ads "Softwares" (software médico / software
dental). Esqueleto compartido en `src/components/software-vertical/`; el copy
vive solo en `content.ts`. CTA canónico: `/agenda` **preservando la query**
(`Nav`, sticky móvil y CTAs internos): la query sigue mandando sobre todo lo
demás en `clasificarLeadSource()`, así que perderla degrada la atribución aunque
ya no la borre (ver abajo).
`lead_source` de GTM: `software_medico_landing` / `software_dental_landing`.
El wizard de `/agenda` no tiene opción "Dental" a propósito.

Hallazgo fuera de alcance: el JSON-LD del home (`src/app/page.tsx`) publica
`lowPrice:"129"` obsoleto, y `softwareSchema` / `productPlansSchema` en
`src/components/seo/schemas.ts` son exports muertos con precios duplicados.

# De dónde viene el lead: la regla vive en UNA función pura

`clasificarLeadSource()` (`VentasLanding.tsx`) decide entre `google-ads`,
`meta-ads` y `organico`; `detectLeadSource()` solo junta las señales. El orden
es la regla y está explicado ahí mismo, pero lo que hay que saber antes de
tocarlo es **por qué el identificador de click va antes que el `utm`**: un `utm`
lo escribe cualquiera, un `gclid` lo pone Google al hacer clic.

Dos cosas que costaron leads pagados contados como orgánicos, corregidas en
agosto 2026 y que no deben volver:

- **`gbraid` / `wbraid` son identificadores de click de Google**, los de
  YouTube/Demand Gen e iOS, donde no viene `gclid`. `gclid.ts` los guardaba y
  viajaban en el payload desde siempre; la clasificación no los miraba.
- **La segunda página.** Quien entra por un anuncio a `/planes` y llega a
  `/agenda` por el menú ya no trae query. El identificador sigue en la cookie
  `_clinera_gclid` (90 días) y en el sessionStorage de `metaIds.ts`, así que hoy
  se leen de ahí como respaldo — el lead ya no sale `organico` con su propio
  `gclid` al lado en el mismo webhook.

La cookie `_fbp` **no** es señal de origen: la tiene todo visitante que cargue
el Pixel. Guardián: `tests/lead-source.spec.ts`.

Ojo con el alcance: **el `Origen` que se ve en Baserow 152 y en Twenty NO sale
de acá**, sale de `classifyOrigin()` dentro del nodo "Prepare Sales Lead Data"
del workflow `OACG TECH | Wizard` (`A3wOPmhQjit8VswM`), que no vive en este
repo. Ese nodo lee el `lead_source` que le manda el sitio, pero sólo después de
sus propias reglas. El reemplazo revisado está en el repo `baserow`
(`sales/n8n/wizard-classify-origin.js`).

# El wizard manda VARIOS webhooks por lead, no uno

`/agenda` postea al mismo webhook de n8n (`088a2cfe-…`) hasta tres veces con el
mismo correo, y cada uno es una etapa distinta del wizard:

| Cuándo | `lead_stage` | `booking_status` | Qué trae de nuevo |
|---|---|---|---|
| Paso 2, si califica | `size_captured` | `pending` | tamaño; **sin contacto** |
| Paso 3, al enviar | `contact` | `pending` | nombre, correo, teléfono, clínica |
| Al confirmar la hora | `booking_confirmed` | `confirmed` | `cal_date`, `cal_organizer_name` |

El primero no lleva correo y n8n lo descarta en su nodo "Tiene contacto?". Los
otros dos entran los dos, así que **el segundo encuentra la fila que creó el
primero un minuto antes**: eso NO es un lead recurrente, es el mismo lead
terminando de agendar. Hasta agosto 2026 cada uno producía su propio aviso de
Google Chat —y el segundo anunciaba «lead recurrente»—; desde entonces n8n corta
el envío de la reserva y manda **un solo aviso**, después de esperar y releer la
ficha (ver el repo `baserow`, `sales/n8n/recablear_aviso_unico.py`).

Si cambiás las claves `lead_stage` / `booking_status`, ese corte deja de
funcionar y los avisos vuelven a duplicarse sin ningún error visible.

# `/lanzamiento` y `/qr`: cena privada Los Ángeles (sept 2026)

Landing de postulación + invitación digital con QR para la cena de lanzamiento
de las nuevas funciones de IA. Sistema de diseño aislado (Outfit + JetBrains
Mono, light-first) en `src/app/lanzamiento/evento.css` — no mezclar con el
resto del sitio.

| Ruta | Qué es |
|---|---|
| `/lanzamiento` | Landing pública, 12 secciones, formulario de postulación |
| `/qr` | Invitación imprimible con QR → `/lanzamiento` |

**Fuente única de contenido:** `src/config/evento.ts`. Para bajar cupos restantes:
`evento.cupos.restantes`.

**Webhook:** el formulario postea directo desde el cliente a
`NEXT_PUBLIC_EVENT_WEBHOOK_URL` → `https://n8n.oacg.cl/webhook/lanzamiento-los-angeles`
(variable en Vercel). El workflow vive en
`integrations/n8n/lanzamiento-los-angeles.workflow.json`.

**Qué hace el webhook (en orden):**
1. Valida nombre, clínica, email y WhatsApp.
2. Crea o refresca persona + clínica + **negocio** en Twenty (`crm.oacg.cl`) con
   etiqueta **`lanzamiento los angeles`** (`LANZAMIENTO_LOS_ANGELES`), etapa
   `NEW`, dueño **Jorge Cheul**.
3. Avisa a Google Chat: *«Nuevo invitado interesado en asistir al lanzamiento»*.

Antes de importar el workflow, correr una vez
`integrations/n8n/etiqueta-lanzamiento-los-angeles.py --aplicar` (requiere
`TWENTY_API_KEY`) para crear la opción del multi-select `etiquetas`. Detalle de
instalación: `integrations/n8n/README.md`.

**Assets pendientes:** `public/og-evento.png` (OG 1200×630) y
`public/host-ricardo.jpg` (retrato del host; hoy placeholder SVG en
`Host.tsx`).

**QR:** path SVG pregenerado en `src/app/qr/QrCode.tsx`. Si cambia la URL de
destino, regenerar con segno (script en el README del proyecto evento).
