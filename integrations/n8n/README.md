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
| `…/clinera-agenda-disponibilidad?desde=YYYY-MM-DD&dias=21` | GET | Resumen: `{ dias: { "YYYY-MM-DD": nº de horas } }`. La página lo pide una vez al abrir el paso 4 para **no ofrecer días vacíos**; pedirlos uno por uno serían diez requests desde el navegador. Cuenta horas únicas (la API devuelve una entrada por profesional) y salta sábados y domingos. Un día que no se pudo consultar vuelve como `-1`, y ese se ofrece igual: mejor mostrar un día vacío que esconder uno que sí tenía horas. |
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

### El día en curso no se ofrece

Para **hoy**, la API de Clinera arma la grilla desde la hora **UTC** actual en
vez del horario de atención del profesional. Chile va cuatro horas atrás, así
que a las 16:30 de la tarde el servidor ya está en 20:30 y devuelve cero horas
aunque queden bloques libres; más temprano devuelve horas que no corresponden.
Por eso el picker parte en mañana. Cuando Clinera lo corrija se puede volver a
incluir el día en curso.

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

### Dónde queda guardado el evento

Al crear el Meet, el workflow busca el lead en Baserow por email y guarda la
referencia del evento en la columna `🔖 Cal Booking UID`, con el formato
`clinera#<eventId>@<calendarId>`. Va colgado de la creación, en paralelo a la
respuesta: si Baserow falla, el Meet ya está hecho y el navegador no se entera.

Sirve para **mover** el evento cuando el paciente reagende. Mover conserva el
link del Meet y el evento que el paciente ya tiene en su calendario; borrar y
recrear cambia el link y deja al paciente con una invitación muerta.

El prefijo `clinera#` distingue esta referencia de un uid de Cal.com, porque la
columna se comparte entre los dos agendadores.

> [!NOTE]
> El token de Baserow del workspace no tiene permiso para crear columnas, así
> que se reusó una existente. Si algún día se agrega una columna propia
> (p. ej. `Meet eventId`), conviene mover esto ahí.

## Por qué falló la llamada (en "OACG TECH | Vapi Outbound Trigger")

Ese workflow tampoco vive acá — lleva credenciales y es anterior a `/agenda` —
pero el 14 de agosto se le cambió el manejo de errores y conviene que quede
escrito.

**Lo que pasó:** la cuenta de Vapi se quedó sin saldo el 13 de agosto. Durante
dos días, cada llamada devolvió `400 — "Your Wallet Balance is -0.09"`, y el
workflow marcaba **todas** las filas como `Error / Número inválido`. Once leads
reales quedaron sin contacto —dos de ellos con demo agendada— y el tablero
decía que la base estaba sucia. Nadie se enteró hasta que se revisaron las
ejecuciones a mano.

Dos cosas lo hacían invisible: el motivo era mentira, y `Error` es un estado
del que nadie vuelve — el cron solo toma las filas en `🕐 En cola`.

**Lo que hace ahora** el nodo Code «Clasificar Fallo», colgado de la salida de
error de «Vapi Trigger Call»:

| Motivo | Cómo se detecta | Qué le pasa al lead | Avisa |
|---|---|---|---|
| `sin_saldo` | el mensaje menciona wallet balance / credits | vuelve a `🕐 En cola`, se le devuelve el intento gastado y se pone `📅 Próxima llamada` a +20 min | sí |
| `numero_invalido` | `customer.number must be a valid phone…` | `Error / Número inválido` (como antes) | no |
| `error_api` | cualquier otro rechazo | `Error / Error técnico`, con el mensaje real en el resumen | sí |

Los +20 minutos usan una regla que el cron ya respetaba: así no reintenta cada
diez minutos mientras el problema sigue sin resolverse, pero se recupera solo
apenas hay crédito, sin que nadie reencole nada.

El aviso va al mismo espacio de Google Chat, **una vez cada media hora por
motivo**, con la cuenta de leads afectados en la ventana. Seis llamadas que
fallan en la misma tanda son un mensaje, no seis.

## camila-tool-solicitar-reagenda.workflow.json

Tool de Vapi para **Camila**, la IA que llama a confirmar la reunión agendada.
Si el lead no puede y quiere moverla, Camila pregunta cuándo le acomoda, llama
a este tool y cierra la llamada.

Webhook: `POST https://n8n.oacg.cl/webhook/camila-solicitar-reagenda`

**No mueve la cita.** Clinera no expone endpoint para reagendar (ver más
abajo), así que el tool deja constancia y le pasa el caso a una persona:

1. Avisa a **Google Chat** con nombre, clínica, teléfono, email, la demo
   agendada, lo que el lead dijo textualmente sobre cuándo le acomoda, y el
   link a la fila de Baserow.
2. Marca la fila de Baserow con `Reunión: Reagendar`.
3. Le devuelve a Camila la instrucción de cerrar con *"Perfecto, déjame
   confirmar bien el horario y le escribo de vuelta, ¿está bien?"*, sin
   prometer fecha ni ofrecer horarios.

La preferencia del lead va **sin interpretar** ("la próxima semana en la
mañana"): quien devuelva la llamada necesita saber qué pidió, no una fecha que
adivinó un modelo.

Placeholders de secretos: `__GOOGLE_CHAT_WEBHOOK__` y `__BASEROW_TOKEN__`.

### Lo que falta en la API de Clinera para automatizarlo entero

Verificado contra `app.clinera.io` (agosto 2026): `POST …/citas` crea, y
`PATCH` / `PUT` / `DELETE` sobre `/citas` responden **405**; `/citas/{id}` ni
siquiera existe (**404**). Para que Camila reagende sola hacen falta:

| Endpoint | Para qué |
|---|---|
| `GET /citas?telefono=…` | Saber qué cita tiene quien llama |
| `PATCH /citas/{id}` | Mover fecha/hora validando disponibilidad en el servidor (409 si se la ganaron) |
| `DELETE /citas/{id}` | Cancelar y liberar el bloque |
| API key por header | Hoy son públicos sin llave: listar citas de pacientes así no corresponde |

Con eso, el tool pasa a mover la cita en Clinera y a **mover** el evento de
Google con `sendUpdates: all`, y el paciente recibe el correo con la hora nueva
sobre el mismo Meet.

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
