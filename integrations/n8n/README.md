# Workflows de n8n que consume el sitio

## clinera-agenda-reserva.workflow.json

Motor del paso final de `/agenda`: reserva nativa contra la agenda real de
Clinera **vía n8n.oacg.cl**, sin iframe. El sitio llama a tres webhooks y n8n
habla con la API pública de app.clinera.io (los mismos endpoints que usa el
widget embebido).

| Webhook (producción)                                   | Método | Rol |
|--------------------------------------------------------|--------|-----|
| `https://n8n.oacg.cl/webhook/clinera-agenda-config`    | GET    | Health-check + parámetros (clínica, sucursal, tratamiento, duración). Si no responde, `/agenda` cae automáticamente al iframe del embed oficial. |
| `https://n8n.oacg.cl/webhook/clinera-agenda-disponibilidad?fecha=YYYY-MM-DD` | GET | Proxy de `GET app.clinera.io/api/public/iframe/disponibilidad` |
| `https://n8n.oacg.cl/webhook/clinera-agenda-turno`     | POST   | Upsert del paciente (`POST …/pacientes`) y creación de la cita (`POST …/citas`), replicando el flujo del widget. Body: `{ nombre, email, telefono, fecha, hora, professionalId, professionalName }` |

### Instalación (una vez)

1. n8n.oacg.cl → **Workflows → Import from File** → este JSON.
2. Revisar el objeto `CONFIG` de los nodos Code y el nodo "Responder Config"
   si algún día cambia la sucursal/tratamiento (están duplicados a propósito:
   cambiar ahí no requiere deploy del sitio).
3. **Activar** el workflow. Desde ese momento `/agenda` muestra el paso nativo
   con los datos precargados; mientras esté inactivo, `/agenda` sigue
   funcionando con el embed (el cliente re-tipea sus datos, como hoy).

### Tracking de conversión (Meta CAPI + GA4)

El embudo tiene dos eventos, y cada uno se dispara desde donde realmente
ocurre:

| Evento | Cuándo | Dónde vive | Valor |
|---|---|---|---|
| **MQL** | alguien agenda en `www.clinera.io/agenda` | este workflow | — |
| **SQL** | el closer lo marca calificado en `crm.oacg.cl` | `crm-sql-twenty.workflow.json` | US$ 100 |

Al crear la cita, el workflow dispara **en paralelo** a la respuesta del
navegador (nunca la demora ni la rompe):

| Nodo | Destino | Evento |
|---|---|---|
| `Meta CAPI - MQL` | Pixel `1104567405156111` | `MQL` |
| `GA4 - MQL` | `G-FB5YV66KKJ` (Measurement Protocol) | `mql` |

**Dedupe con el Pixel del navegador**: `/agenda` genera el `event_id` *antes*
de llamar al webhook, lo manda en el body y usa el mismo en
`fbq('track','Schedule', …, { eventID })`. Meta deduplica por
(`event_name`, `event_id`), así que Pixel + CAPI cuentan **una** conversión.
El navegador también manda `meta_fbp` / `meta_fbc`, el `client_id` de la
cookie `_ga` y la atribución de Google Ads, de modo que el evento
server-side cae en la misma sesión y usuario.

> [!IMPORTANT]
> El JSON de este repo lleva **placeholders**, porque el repositorio es
> público: `__META_CAPI_ACCESS_TOKEN__` y `__GA4_API_SECRET__`. Los valores
> reales viven solo en n8n — son los mismos que ya usan
> "OACG TECH | Reunión Cal.com (Orgánico)" y "OACG TECH | Wizard". Si se
> reimporta este archivo hay que volver a pegarlos en los dos nodos.

### Contrato con el sitio

`src/components/ventas/VentasLanding.tsx` (constantes `N8N_AGENDA_*`) asume
las tres rutas de arriba. Si se renombran los paths de los webhooks hay que
actualizar esas constantes.

## clinera-meet-por-profesional.workflow.json

Crea un **Google Meet en el calendario de la persona con la que se agendó**.
Hoy mapea a Nohe y Rebe; sumar a alguien más es agregar una línea al array
`CALENDARIOS` del nodo "Normalizar Reserva".

| Profesional (match por nombre, sin acentos) | Calendario donde cae el evento |
|---|---|
| contiene `nohe` | `nohelymar.sanchez@oacg.cl` |
| contiene `rebe` | `rebeca@oacg.cl` |

Webhook: `POST https://n8n.oacg.cl/webhook/clinera-meet`

Acepta dos formatos de payload:

1. **El del workflow de reserva de `/agenda`** — ya conectado: el nodo
   "Avisar Meet" lo llama en paralelo cuando la cita se crea, sin tocar la
   respuesta al navegador.
2. **El del webhook de automatizaciones de app.clinera.io** (Marketing →
   Automatizaciones → Configurar webhook → "Enviar payload completo"). El
   nodo "Normalizar Reserva" busca las claves en profundidad
   (`profesional`/`doctor`, `fecha`, `hora`, `nombre`, `email`, `telefono`,
   `duracion`), así que tolera el formato del evento que dispare.

Detalles:

- La hora del turno se interpreta en **hora de la clínica** (`America/Santiago`,
  con su DST) y se manda a Google con offset explícito, de modo que cada quien
  la ve en su huso (Nohe está en `America/Caracas`).
- El cliente va como invitado (`sendUpdates: all`), así recibe la invitación
  con el link del Meet.
- Anti-duplicado por `calendario + inicio + email` durante 10 minutos: si el
  mismo turno se avisa dos veces (workflow de `/agenda` + automatización de
  Clinera), se crea un solo Meet.
- `{"test": true}` en el body crea el evento marcado `[PRUEBA — BORRAR]` y sin
  invitados, para probar sin mandar correos.
- Si el profesional no es Nohe ni Rebe, responde `{"ok":false,"motivo":"sin_match"}`
  y no crea nada. El payload queda en la ejecución de n8n para poder mapearlo.

Credencial usada: **Google Calendar OACG** (la misma del workflow
"OACG TECH | Agendamiento (Meet)"). Requiere que esa cuenta tenga permiso de
**"Hacer cambios en los eventos"** sobre los calendarios de destino.

## crm-sql-twenty.workflow.json

El segundo evento del embudo: **SQL** (US$ 100), cuando el closer marca el
lead como calificado en **crm.oacg.cl** (Twenty).

Webhook: `POST https://n8n.oacg.cl/webhook/crm-sql`

Se configura en Twenty: **Settings → APIs & Webhooks → New webhook**, apuntando
a esa URL y suscrito a `opportunity.updated` / `opportunity.created`.

### Qué cuenta como SQL

Twenty manda en el webhook el **valor** del enum de etapa, no la etiqueta que
se ve en el tablero. El mapa del workspace OACG es:

| Valor en el webhook | Etiqueta en el tablero |
|---|---|
| `NEW` | Nuevo |
| `SCREENING` | **MQL** |
| `PQL` | PQL · No contesta |
| `MEETING` | **SQL** |
| `PROPOSAL` | **SQL+** |
| `CUSTOMER` | Contrata |
| `NQL` | NQL · No califica |

`ETAPAS_SQL` acepta `meeting` y `proposal` (y también las etiquetas `sql` /
`sql+`, por si el webhook llegara desde otra vista).

### Filtros antes de mandar la conversión

1. **Solo oportunidades.** El webhook del CRM está abierto a todos los objetos;
   notas, personas y empresas responden `objeto_no_es_oportunidad`.
2. **Solo si cambió la etapa.** Editar el monto de un negocio que ya está en
   SQL responde `no_cambio_la_etapa` (se mira `updatedFields`).
3. **Solo si lo movió una persona.** El SQL es una calificación humana: si la
   etapa la movió una automatización (`updatedBy.source = API`, que es como
   escribe n8n) responde `etapa_movida_por_automatizacion`. Por eso agendar
   deja el negocio en **MQL** y no lo sube solo a SQL.
4. **Anti-duplicado por negocio durante 90 días**, con el `id` del registro
   como clave. Mover SQL → SQL+ cuenta una sola vez.

### De dónde salen el contacto y los identificadores de Meta

La oportunidad de Twenty no lleva email ni teléfono encima: solo
`pointOfContactId`. El nodo "Validar SQL" resuelve la persona con
`GET crm.oacg.cl/rest/people/{id}` (token en `$env.TWENTY_API_KEY`) y de ahí
saca email, teléfono y nombre para hashearlos.

Es una conversión **offline**: va con `action_source: system_generated` y el
match lo hace Meta por email y teléfono hasheados (SHA-256). El `fbc` / `fbp`
de la landing sube mucho la calidad de ese match, y Twenty no tiene dónde
guardarlos — así que el nodo **"Baserow - Meta ids"** los busca en la tabla 152
(columnas `Meta fbc` / `Meta fbp`), que es donde el Wizard los deja al capturar
el lead. Si no hay fila o vienen vacíos, el evento sale igual sin ellos.

Valor y moneda salen de `VALOR_SQL` / `MONEDA` en el mismo nodo.

Además de los placeholders del workflow de reserva, este archivo lleva
`__BASEROW_TOKEN__` en el nodo "Baserow - Meta ids".

## Cambios en "OACG TECH | Wizard" (no vive en este repo)

El workflow `A3wOPmhQjit8VswM` recibe el formulario de `/ventas` y `/agenda` y
es el que escribe en Baserow y en Twenty. No se versiona acá porque lleva
credenciales inline y sirve a más flujos, pero `/agenda` depende de cuatro
cosas suyas:

- **Un solo MQL.** El nodo "No es booking confirmado?" ahora exige además que
  `landing_url` **no** contenga `/agenda`. En `/agenda` el MQL lo emite el
  workflow de reserva en el momento del agendamiento, con el mismo `event_id`
  que el Pixel; sin este filtro el lead contaba dos MQL con `event_id`
  distintos y Meta no los deduplicaba. `/ventas` sigue igual.
- **Fecha de la demo.** "Prepare Sales Lead Data" ahora deriva `fecha` / `hora`
  de `cal_date` / `cal_start_time` cuando el formulario no las trae. La reserva
  nativa manda la hora local de Chile sin zona (`2026-08-17T13:00:00`) y
  Cal.com la manda en UTC; las dos se normalizan a hora local antes de la
  conversión a UTC que ya existía. Sin esto, "Fecha demo" quedaba vacía en
  Baserow y en Twenty.
- **Responsable = quien atiende.** "Twenty - Crear Lead" toma el profesional de
  `cal_organizer_name` y pone el negocio a su nombre (Rebeca, Nohelymar), en
  vez del sorteo de encargada. Se aplica también cuando el negocio ya existía;
  si no hay profesional, no se reasigna a nadie.
- **Todo lead entra como MQL.** "Twenty - Crear Lead" y "Twenty - Agendó
  (Cal.com)" dejan el negocio en `SCREENING` (MQL), siempre. Subirlo a SQL o
  SQL+ es decisión de ventas (Nohe, Rebe o Cheul) en el CRM: ni el formulario ni
  el agendamiento lo hacen solos. Antes el agendamiento subía a `MEETING` (SQL)
  y el embudo se saltaba el paso del closer.
- **Qué cambia cuando un lead que ya existe agenda.** Solo la fecha de la demo y
  el responsable (el profesional con quien quedó el Meet). La etapa no baja
  nunca y tampoco sube: si ventas ya lo había marcado SQL, ahí se queda.
