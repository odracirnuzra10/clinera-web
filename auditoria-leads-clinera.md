# Auditoría de calidad de leads — Clinera.io

Fecha: 2026-08-21. Alcance: wizard de `/agenda` y `/ventas` (workflow n8n `OACG TECH | Wizard`,
`A3wOPmhQjit8VswM`), Meta Pixel/CAPI, Baserow tabla 152 (Leads), Twenty CRM.

**Nota de contexto**: en paralelo a esta auditoría hay una propuesta OpenSpec en curso
(PR #380, `baserow`) que extiende la detección de SQL/SQL+ que YA existe para Meta hacia
Google Ads (producto Data Manager). No es parte de este informe — se menciona para que no
se dupliquen esfuerzos.

---

## 1. Veredicto

**La causa raíz dominante NO es spam masivo de bots externos.** Tres fuentes de datos
independientes lo confirman: (a) en la muestra en vivo de los últimos 50 envíos reales al
webhook — con IP y User-Agent reales, no inferidos — el 94% trae `Origin`/`Referer` de
`www.clinera.io` y user-agents de teléfonos/navegadores genuinos; el único tráfico "raro"
es `HeadlessChrome` desde `localhost`, es decir, los propios tests E2E del equipo pegándole
al webhook en producción (riesgo ya documentado en `CLAUDE.md`, no un atacante); (b) del
flujo orgánico real de Baserow 152 (323 leads, últimos 49 días — ver §3), solo 5,6% no
tiene ninguna huella de campaña; (c) no hay dominios de correo desechables ni patrones de
nombre gibberish en ninguna de las muestras revisadas.

La causa real es **estructural, no un ataque en curso**: el endpoint del wizard es público,
sin token, sin CORS restrictivo posible (el navegador le habla directo a n8n, no hay proxy
intermedio) y el único filtro del lado servidor en todo el pipeline es una condición —
`email no está vacío` — confirmada bajando el nodo `Tiene contacto?` del workflow vivo por
la API de n8n. Es una vulnerabilidad latente: hoy no se ve explotada a escala, pero nada
del lado servidor la impediría si empezara mañana. A esto se suma un problema real y
presente pero de otra naturaleza: **contaminación operativa propia** — 11 a 13% de una
muestra de 100 registros recientes en Twenty son pruebas internas del equipo (nombres de
juguete, marcadores `PRUEBA...BORRAR` sin limpiar), no leads externos de ningún tipo.

---

## 2. Tabla de hallazgos

| # | Hallazgo | Severidad | Evidencia | Impacto en calidad de lead | Esfuerzo |
|---|---|---|---|---|---|
| 1 | El wizard postea **directo desde el navegador** a n8n, sin proxy, sin token compartido | **Crítico** | `src/components/ventas/VentasLanding.tsx:224` (URL hardcodeada en el bundle) y `:1253` (`fetch(WEBHOOK_URL,...)` sin header de auth). Contraste: `src/app/api/triage/route.ts:1-17,39-62,83-95,139-141` — mismo repo, mismo patrón de riesgo, ya resuelto ahí con proxy server-side + `X-Triage-Token` + rate limit + chequeo de origen | Cualquiera puede mandar leads con `curl`, sin pasar por el sitio ni por un navegador. CORS es irrelevante para ese ataque: un script no lo respeta | Medio |
| 2 | El único filtro server-side de todo el pipeline es `email no vacío` | **Crítico** | Nodo `Tiene contacto?` del workflow vivo `A3wOPmhQjit8VswM` (bajado por `GET /api/v1/workflows/`, no del repo): `{"leftValue":"={{ $json.email }}","operator":{"operation":"notEmpty"}}` | Nada valida formato de email, teléfono, ni contenido antes de crear el lead en Twenty + Baserow + aviso de Chat | Medio (mismo arreglo que #1) |
| 3 | `/gracias` dispara conversión de Pixel (`CompleteRegistration`) con solo un query param, sin verificación server-side | Alto | `src/app/gracias/ThanksContent.tsx:48-57` (dispara si `eventId` está en la URL); `src/app/gracias/page.tsx:9` (`robots: noindex` — no bloquea acceso, solo indexación) | Cualquiera con la URL `/gracias?event_id=x` infla el Pixel con conversiones falsas, sin pasar por el formulario. Contamina la señal de optimización de Meta | Medio |
| 4 | Contaminación por pruebas internas del equipo en el CRM en vivo | Alto | Muestra real de Twenty (100 personas más recientes, 2026-08-04 a 2026-08-21): 11-13 registros identificables como prueba (`kiki@cl.cl`, `cuky@l.cl`, `PRUEBA CRM CLAUDE BORRAR`, `PRUEBA E2E BORRAR`, `John Doe`, `Chequeo visual`, un registro 100% vacío) | Los closers pierden tiempo revisando filas que no son leads; ensucia cualquier métrica de conversión sobre el CRM | Bajo |
| 5 | `evaluateQualification()` es un stub que siempre califica | Medio | `VentasLanding.tsx:192-198`: `return { califica: true, ... }` sin mirar `size.profile`. `src/lib/metaEvents.ts:2-8` describe esta función como la "fuente de verdad" de qué califica | El filtro de calidad que la arquitectura dice tener no filtra nada — MQL se dispara igual para calificados y no calificados, siempre que agenden | Bajo |
| 6 | Validación de email/teléfono existe, pero es 100% client-side | Medio (corrige, no confirma, la hipótesis original de "sin validación") | Reglas por 10 países en `VentasLanding.tsx:28-39` + regex de email en `:2079`. Ninguna se repite en el nodo `Prepare Sales Lead Data` del workflow vivo (confirmado igual al repo en este punto) ni en `Tiene contacto?` | La validación protege al usuario real de un typo; no protege al sistema de un envío directo malformado | Medio |
| 7 | `Origen` en Baserow 152 es texto libre, no un valor controlado | Medio | Esquema de la tabla (campo `id 1417`, `type: text`). En la tabla completa (1.657 filas) conviven 14 grafías distintas para ~4 categorías: `"META ADS - WIZARD"`, `"Meta Ads - Facebook"`, `"meta-ads"`, `"wizard - meta ads"`, etc. | Cualquier reporte que agrupe por `Origen` sin normalizar primero da números incorrectos (ver §3) | Bajo |
| 8 | Valor de conversión SQL+ en el código vivo no coincide con lo documentado | Medio | `baserow/sales/n8n/crm-sqlplus-prepare-capi.js:39-43`: `VALOR = Number($env.META_CAPI_VALUE_SQL_PLUS \|\| 150)`, comentario dice "fijado por Ricardo el 2026-08-13". `AGENTS.md` (www.clinera.io) documenta SQL+ = US$300, y así lo confirmaste hoy | Si la variable de entorno en n8n no está en 300, Meta optimiza campañas con el valor de conversión más importante 50% más bajo del real. No pude verificar el valor real de la variable desde acá | Bajo (una vez verificado) |
| 9 | Tabla 152 de Baserow no tiene historia antes del 2026-07-03 | Informativo | Fila más antigua = `2026-07-03T01:09:11Z` (paginé la tabla completa, 1.657 filas, `next:false` en la última página). 1.334 de 1.657 (80%) se crearon en una ventana de 20 segundos ese mismo minuto — confirmaste que es probablemente una restauración | No afecta calidad del lead. Cualquier auditoría futura de "últimos N días" sobre esta tabla debe saber que el techo real es ~49 días, no más | Cero (dejar constancia en CLAUDE.md, si quieres) |
| 10 | Monday.com: descartado como destino de leads — solo queda código muerto | Informativo | El workflow vivo (31 nodos, bajado por API) tiene **cero** nodos que hablen con Monday. Las 54 menciones de "monday" en el JSON completo del workflow están en 3 nodos de código, todas nombres de variable muertos o un comentario viejo — nunca una llamada HTTP a `api.monday.com` | Ninguno. Se documenta para que nadie vuelva a investigarlo desde cero | Opcional — limpiar `mondayColumnsCreate`/`mondayColumnsUpdate` del nodo `Prepare Sales Lead Data` si se toca ese archivo por otra razón |

---

## 3. Cuantificación

**Límite de partida, dicho explícitamente**: la tabla 152 de Baserow no tiene 60 días de
historia — tiene 49 (desde el 2026-07-03). Los números de abajo usan esa ventana real, no
una ficticia de 60 días.

### 3.1 Split obligatorio: restauración vs. flujo orgánico

De las 1.657 filas totales, 1.334 (80%) se crearon en una ventana de 20 segundos el
2026-07-03 — la restauración que confirmaste. Inspeccioné una muestra: nombres y teléfonos
de clínica reales, países coherentes con el mercado (México 555, Chile 515, Perú 67...),
solo 11 emails en blanco sobre 1.334. **No es spam** — el 69% sin huella de campaña en ese
bloque se explica porque una parte importante trae `Origen` con formato "Meta Ads -
Facebook/Instagram" (leads de formulario nativo de Meta, que estructuralmente no traen
`fbclid` porque el usuario nunca visita el sitio). Por eso excluyo ese bloque del cálculo
de "basura del período" — es historia restaurada, no señal del funnel actual.

**El número que importa es el flujo orgánico: 323 leads, 2026-07-03 (17:30) a 2026-08-21.**

| Métrica | Valor | Lectura |
|---|---|---|
| Sin ninguna huella de campaña (GCLID/fbc/fbp/fbclid/utm en URL) | 5,6% (18/323) | Bajo. Pesa en contra de "spam masivo" como causa dominante |
| Email en blanco | 1,2% (4/323) | Bajo |
| Teléfono en blanco | 1,5% (5/323) | Bajo |
| Origen: Meta Ads | 79% (255/323) | Coherente con el gasto de campaña que describes |
| Origen: Orgánico | 17% (55/323) | — |
| Origen: Google Ads | 1,9% (6/323) | — |

### 3.2 Tráfico real al webhook (últimos 50 envíos, con IP/User-Agent — no Baserow, sino el log de ejecuciones de n8n)

| Métrica | Valor |
|---|---|
| Éxito / error | 47 / 50 (los 3 errores: una caída transitoria de conexión a Baserow de 27 segundos, sin relación con validación) |
| IPs distintas | 21 sobre 49 hits con datos — no hay una sola IP martillando el endpoint |
| `Origin: https://www.clinera.io` + `Referer` coincidente | 94% (46/49) |
| User-Agent de navegador/app real (iPhone, Android, Instagram in-app, Chrome/Safari desktop) | 94% (47/49... la superposición no es exacta pero la lectura es la misma) |
| Tráfico "raro" | 6% (3/49) — y los 3 son `HeadlessChrome` u orígenes `localhost`/`127.0.0.1`: los propios tests E2E del equipo contra el webhook en vivo, no un tercero |

### 3.3 Contaminación por pruebas internas (Twenty, 100 personas más recientes)

**11-13%** son identificables como pruebas del propio equipo (no leads externos, ni buenos
ni basura): nombres de juguete con dominios inventados, marcadores explícitos `PRUEBA...
BORRAR` nunca limpiados, un registro completamente vacío.

### 3.4 Lo que NO puedo cuantificar, y por qué

- **"% total de leads basura"** como un solo número: no lo doy, porque mezcla al menos tres
  categorías con causas y arreglos distintos (pruebas internas ~12%, tráfico sin
  atribución completa ~5,6% — que no es sinónimo de spam —, y bot spam externo: 0%
  observado en las ventanas disponibles).
- **Spam que nunca llega a Twenty/Baserow**: el nodo `Tiene contacto?` descarta cualquier
  envío sin email, y esos envíos no quedan registrados en ningún lugar al que yo tenga
  acceso. Mi muestra de 50 ejecuciones no mostró ninguno así, pero 50 eventos en ~24 horas
  no alcanza para descartarlo con certeza — es el hueco más grande de esta cuantificación.
- **Comparación con el gasto real de campaña** (CPL, volumen por creativo): sin acceso a
  Meta Ads Manager no puedo cruzar esto contra presupuesto.

---

## 4. Plan de acción, priorizado por impacto sobre esfuerzo

### Se arregla hoy (minutos, cero riesgo de bajar conversión)
- Verificar la variable de entorno `META_CAPI_VALUE_SQL_PLUS` en el contenedor de n8n
  (¿150 o 300?) y corregirla si hace falta — hallazgo #8, puede estar sub-optimizando
  campañas ahora mismo.
- Limpiar los 11-13 registros de prueba interna en Twenty (hallazgo #4) y adoptar una
  convención (correo de prueba con sufijo fijo, o ambiente separado) para que QA futuro no
  vuelva a ensuciar el CRM en vivo.
- Dejar constancia en `CLAUDE.md`/`AGENTS.md` de la restauración del 2026-07-03 en la tabla
  152 (hallazgo #9), con el detalle que tú tengas, para que nadie más lo re-investigue.

### Esta semana (esfuerzo medio, cierra el riesgo estructural principal)
- Mover el wizard al mismo patrón que ya usa `/api/triage` (hallazgo #1 y #2): proxy
  server-side con token compartido en vez de que el navegador le hable directo a n8n. No
  agrega fricción visible — el formulario no cambia, solo cambia dónde se valida.
- Repetir del lado servidor la validación de email/teléfono que ya existe en el cliente
  (hallazgo #6), antes de crear el lead.
- Decidir el destino de `evaluateQualification()` (hallazgo #5): o se restaura la lógica
  real, o se documenta explícitamente que MQL = "agendó" sin importar calificación, y se
  borra el código muerto y el comentario que hoy dice lo contrario.
- Exigir un token de corta duración (emitido por el propio flujo de confirmación) para que
  `/gracias` dispare `CompleteRegistration` (hallazgo #3), en vez de un query param abierto.

### Este mes (esfuerzo mayor o depende de una decisión tuya)
- Normalizar el campo `Origen` en Baserow 152 a valores controlados (hallazgo #7), sin
  tocar el histórico.
- Rate limiting real en el proxy nuevo del wizard, mismo patrón que `/api/triage` (5/min
  por IP).
- Evaluar un honeypot invisible como capa adicional — de menor prioridad que cerrar el
  endpoint público, porque sin autenticación un honeypot no detiene un `curl` directo, solo
  bots que rellenan formularios HTML de verdad.

---

## 5. Qué cambiar en Meta Ads (para que tú lo apliques — no lo ejecuto yo)

Con la evidencia que tengo (sin acceso a Meta Ads Manager, así que esto es lo que el código
sugiere, no una auditoría de la cuenta):

- **Confirmar que la campaña optimiza por el evento de mayor valor real (SQL o SQL+), no
  solo por MQL/Lead.** El funnel completo ya le llega a Meta vía CAPI (MQL → Schedule → SQL
  → SQL+, hallazgo refutado de "falta señal downstream" — ver más abajo). Si hoy la campaña
  optimiza solo por MQL, el algoritmo aprende a maximizar volumen de agendamientos, no
  calidad de cierre, aunque la señal de calidad ya exista.
- **Una vez corregido el hallazgo #8**, confirmar en Eventos de Conversión de Meta que el
  valor de SQL+ que ve el algoritmo es el real (US$300, no US$150).
- **No hay evidencia de que el segmento esté mal dirigido**: el flujo orgánico reciente es
  79% Meta Ads con solo 5,6% sin atribución, y el copy del wizard (software actual,
  volumen de pacientes, tipo de clínica) es consistentemente B2B en las landings que
  revisé. Esto no descarta un problema de creativo/mensaje — no tengo acceso a los
  anuncios en sí para comparar — pero si la hipótesis era "el segmento está atrayendo
  pacientes en vez de dueños de clínica", los datos de conversión no la sostienen hoy.

---

## Hipótesis del encargo original — qué quedó confirmado, refutado o matizado

| Hipótesis | Estado | Evidencia |
|---|---|---|
| 1. Spam directo al formulario | **Parcialmente refutada** | 94% de tráfico real verificado (IP/UA/Origin) en la muestra más reciente; 5,6% sin huella en el flujo orgánico. El riesgo estructural (endpoint sin validación) sigue siendo real — ver hallazgos #1 y #2 |
| 2. Pixel dispara antes de validar | **Matizada** | El evento del wizard es `MQL`, no `Lead`, y requiere `booking_confirmed` (agendamiento real) — más conservador de lo asumido. Pero `/gracias` sí es vulnerable a spoofing por URL directa (hallazgo #3) |
| 3. No hay señal downstream por CAPI | **Refutada** | Meta ya recibe MQL, Schedule, SQL y SQL+ vía CAPI, con ledger de deduplicación bien construido. Extender esto a Google Ads es exactamente lo que la propuesta paralela (PR #380) está armando |
| 4. Validación débil en el formulario | **Corregida, no confirmada tal cual** | Sí hay validación real (regex de teléfono por 10 países + email) — pero 100% client-side, nunca repetida en el servidor (hallazgo #6) |
| 5. Atribución rota | **Refutada** | `clasificarLeadSource()`/`classifyOrigin()` están bien diseñados, coinciden en los 3 lugares que tienen que coincidir, y están cubiertos por tests (`tests/lead-source.spec.ts`) que prueban justo los casos que ya costaron errores (gbraid/wbraid, click guardado en segunda página) |
| 6. Público equivocado (B2C vs B2B) | **Sin evidencia de esto en el funnel** | El copy del wizard es consistentemente B2B. No pude comparar contra los creativos de Meta (sin acceso a Ads Manager) |
