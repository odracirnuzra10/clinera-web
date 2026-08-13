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

Al crear la cita, el workflow dispara **en paralelo** a la respuesta del
navegador (nunca la demora ni la rompe):

| Nodo | Destino | Evento |
|---|---|---|
| `Meta CAPI - Schedule` | Pixel `1104567405156111` | `Schedule` |
| `GA4 - Schedule` | `G-FB5YV66KKJ` (Measurement Protocol) | `schedule` |

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
