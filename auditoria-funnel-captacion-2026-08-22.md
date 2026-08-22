# Auditoría de calidad de leads — Clinera.io (funnel completo)

Fecha: 2026-08-22. Encargo de Ricardo: auditar el funnel completo de captación
en 6 áreas (formulario, conversiones Google Ads, audiencias, UX de `/agenda`,
creatividades, wizard/landing intermedia), identificar dónde se cuela un lead
malo (falso, delincuente, o alguien que no es dueño/administrador de clínica)
y qué cambio concreto lo bloquea. **Alcance ampliado por Ricardo durante la
sesión: auditoría completa — los errores críticos que aparecieron se
corrigieron en el momento, no solo se documentan.**

Relación con trabajo previo: hay una auditoría anterior
(`auditoria-leads-clinera.md`, 2026-08-21, PR #170) enfocada en spam/
validación del wizard. **Esta auditoría no la repite** — la da por leída,
reconoce lo que ya resolvió (PR #172), y cubre las 6 áreas nuevas que pidió
Ricardo (conversiones, audiencias, UX, creatividades, wizard v2), que son
alcance distinto.

---

## 0. Incidente encontrado y cerrado durante esta auditoría

Al arrancar la auditoría, dos leads reportados por Ricardo (2 MQL en Meta,
campaña Latam) no aparecían ni en `crm.oacg.cl` ni en `tech.oacg.cl/leads`.
Diagnóstico: **`/api/wizard` llevaba 23 horas devolviendo 503** a todo envío
(desde el deploy de PR #172, 2026-08-21 17:52 hora Chile) — confirmado con la
brecha exacta en las ejecuciones de n8n (21-08 19:47 → 22-08 19:09 UTC, ni una
sola). Causa: las variables de entorno (`WIZARD_N8N_URL`, `WIZARD_FORM_SECRET`)
se cargaron en el proyecto correcto de Vercel (`clinera-website`) **después**
de que ese deployment se construyera, y Vercel hornea las variables en el
build — no las relee en caliente. El formulario no mostraba ningún error (los
envíos son fire-and-forget desde el navegador) y Meta seguía contando MQL y
agendando reuniones reales, mientras nada llegaba al CRM ni a Baserow.

**Resuelto en la sesión, con autorización explícita de Ricardo para cada paso
que tocaba producción:**
1. Los 2 leads reales se recuperaron a mano desde las ejecuciones de n8n de
   la reserva (nombre, correo, teléfono, profesional, Meet) y quedaron
   cargados en Twenty (persona + negocio SCREENING + nota) y en Baserow 152
   (en cola de Camila para confirmar la demo). Se confirmó que no hubo más
   víctimas (barrido completo de reservas desde la caída; cero en orgánico o
   Google Ads).
2. Redeploy de `clinera-website` a Production — verificado con la primera
   ejecución sana en n8n después de 23h de silencio, y con un healthcheck de
   extremo a extremo (limpiado íntegro: no quedó ningún registro de prueba en
   Baserow ni Twenty).
3. Se aplicó al nodo vivo de n8n (`Prepare Sales Lead Data`, workflow
   `A3wOPmhQjit8VswM`) el clasificador de origen corregido que ya estaba
   escrito y probado en el repo (`sales/n8n/wizard-classify-origin.js`) pero
   nunca se había aplicado: `gbraid`/`wbraid` ahora cuentan como clic de
   Google Ads (antes se perdían como orgánico), y el identificador de clic
   gana sobre el `utm`. Con respaldo automático y verificación en verde.

**Pendiente a propósito, no se tocó hoy:** exigir el header `X-Wizard-Token`
en el webhook crudo de n8n (tarea 7.2b del OpenSpec `alinear-embudo-google-
ads-meta`). Es la misma clase de falla que causó este incidente («webhook mal
configurado = wizard completo sin recibir ningún lead, silencioso») y hoy no
existe monitoreo del camino de ingesta — se hace en una sesión con Ricardo
presente para verificar en el momento, no desatendido.

**Esto ya es, en sí mismo, el hallazgo más caro de la auditoría**: un lead
pagado que no llega a ningún sistema es peor que un lead malo que sí llega —
es gasto puro sin ningún dato a cambio, y nadie lo habría notado sin esta
revisión porque no hay alerta activa sobre el camino de ingesta. Ver fix
propuesto en Área 1.

---

## 1. Filtrado del formulario

**Estado actual.** El wizard de `/agenda` (landing de los ads) tiene 4 pasos:
(1) «¿Te interesa implementarlo?» — no captura ningún dato; (2) tamaño de
operación, 3 opciones desde 200-500 pacientes/mes, ninguna descalifica; (3)
nombre, nombre de clínica, tipo de clínica, teléfono (con regla de formato por
país), email (solo formato); (4) agendamiento. `/ventas` y `/hablar-con-
ventas` agregan un paso de «software actual» y muestran el precio (US$279)
antes de agendar — `/agenda` nunca lo muestra. PR #172 (2026-08-21, ya en
producción) cerró el hueco más grave que tenía: antes el navegador le hablaba
directo a n8n sin proxy ni validación server-side; ahora pasa por `/api/wizard`
con token, valida formato de email/teléfono en el servidor, y tiene rate limit
de 5 envíos/min por IP.

**Falla específica.**
- **La calificación es decorativa.** `evaluateQualification()` devuelve
  `califica: true` siempre, sin mirar la respuesta del paso 2 — no existe
  ninguna respuesta que descalifique a nadie. El menor tramo (200-500
  pacientes/mes) ya califica.
- **No se pide nada verificable de la clínica.** Ni sitio web, ni Instagram,
  ni cargo del contacto — nada que un closer pueda chequear antes de la
  llamada para confirmar que la clínica existe y que quien contesta manda.
- **No hay filtro de correo gratuito vs. corporativo**, ni honeypot, ni
  captcha. El único freno anti-bot es el rate limit de PR #172, y no cubre
  los 3 webhooks de agendamiento nativo de `/agenda` (llaman directo a n8n
  desde el navegador, sin proxy ni token — mismo patrón de riesgo que tenía
  `/api/wizard` antes de PR #172, sin cerrar todavía).
- **El incidente del punto 0**: hoy no hay alerta si el camino de ingesta se
  cae. Un formulario perfecto no sirve de nada si el envío nunca llega.

**Fix priorizado.**
1. *(Alto impacto / bajo esfuerzo)* Agregar un **umbral real de
   descalificación** en el paso 2: bajo cierto tamaño de operación, la
   respuesta no bloquea el agendamiento pero sí baja la prioridad interna
   (ya existe `lead_priority`/`prioridad_alta` — falta usarlo también como
   filtro, no solo como orden). Cero fricción visible.
2. *(Alto impacto / medio esfuerzo)* Agregar **cargo** y **sitio web de la
   clínica** al paso 3 — exactamente lo que propone el wizard v2 (Área 6).
3. *(Medio impacto / bajo esfuerzo)* **Cerrar los 3 webhooks de `/agenda`**
   que hoy hablan directo con n8n sin proxy (mismo patrón que ya se aplicó en
   PR #172 al webhook principal).
4. *(Alto impacto / bajo esfuerzo, ya identificado hoy)* **Monitoreo del
   camino de ingesta**: una alerta simple (cron que compara «MQL nuevos en
   Meta» vs. «filas nuevas en 152» y avisa si diverge, o más simple: un
   healthcheck cada N minutos a `/api/wizard`) para que un 503 como el de hoy
   se note en minutos, no en 23 horas.

---

## 2. Conversiones en Google Ads

**Reconciliación necesaria primero.** El encargo asume que la conversión
primaria es *"generate_lead desde Cal.com en clinera.io/hablar-con-ventas"* —
eso no es lo que está construido. La realidad verificada en código:

- **No existe ningún snippet de Google Ads en el sitio** (cero `gtag`, cero
  id `AW-`). Google Ads no recibe nada por el navegador.
- Cal.com **sí** está embebido en `/ventas` y `/hablar-con-ventas`, pero
  **no en `/agenda`** (que usa agendamiento nativo de Clinera, no Cal.com).
- Google Ads recibe conversiones por **dos feeds CSV** que lee desde Baserow
  152 y sirve por HTTPS a Google Ads Data Manager (diseño 2026-08-21,
  `sales/HANDOFF.md` en el repo `baserow`):
  - **MQL** (US$10): dispara cuando el lead **agenda una demo** (`Fecha
    demo` seteada), emparejado por `GCLID` — no es un evento de página, ya
    filtra por intención real de agendar.
  - **SQL** (US$100) / **SQL+** (US$300): cuando el closer avanza al negocio
    en Twenty, vía Data Manager con email/teléfono hasheado (enhanced
    conversions for leads).

**Falla específica.**
- **No hay conversión de baja intención contando como lead** — al contrario
  del riesgo que describe el encargo, el diseño actual ya es conservador
  (MQL = agendó, no = envió el paso 1). Esto se refuta, no se confirma.
- **Tarea pendiente de Ricardo (bloqueante):** conectar Data Manager en la
  cuenta de Google Ads y crear las acciones de conversión SQL/SQL+ — sin eso,
  hoy Google Ads probablemente solo ve el MQL de US$10, y el algoritmo no
  tiene señal de qué lead realmente cerró.
- **No verificable desde código**: si la campaña de Search optimiza hacia el
  evento correcto, si hay keywords negativas (paciente/estudiante/empleo), y
  si «enhanced conversions» está realmente activo para el feed MQL (el MQL
  usa gclid plano, no requiere enhanced conversions; el SQL/SQL+ sí, y
  depende de la tarea pendiente arriba).

**Fix priorizado.**
1. *(Crítico, ya identificado, esfuerzo: 15 min en la UI)* Terminar la
   tarea pendiente: conectar Data Manager y crear las acciones `SQL`/`SQL+`.
   Sin esto, media escalera de valor (100/300 USD) es invisible para Google.
2. *(Checklist para Ricardo — ver abajo)* Confirmar en la cuenta: nombre
   exacto de la acción `MQL` (debe calzar carácter por carácter con el feed),
   qué evento optimiza la campaña de Search, y la lista de keywords
   negativas.

**Checklist de cuenta (Google Ads, verificar en la UI):**
- [ ] Herramientas → Conversiones: ¿existe la acción `MQL`? ¿Recuento "Una"?
- [ ] Herramientas → Data Manager: ¿conectada la fuente HTTP del feed
      SQL/SQL+? ¿Creadas las acciones `SQL` (100 USD) y `SQL+` (300 USD)?
- [ ] La campaña de Search, ¿tiene fijado "Objetivo de conversión" = MQL (o
      SQL una vez conectado), no solo clics/impresiones?
- [ ] Lista de keywords negativas: ¿incluye "trabajo", "empleo", "curso",
      "paciente", "estudiante", "gratis", nombres de competidores como
      términos de exclusión donde corresponda?

---

## 3. Audiencias

**Estado actual.** No verificable desde código — Google Ads Manager no está
conectado a esta sesión. Lo que sí se puede afirmar: existe una fuente de
datos limpia para un Customer Match real — la tabla 940 «Clientes» en
Baserow tiene `Email` y `Celular` tipados, filtrable por `ESTADO=Activo` y
`empresa=clinera` (contrato ya documentado en `CLAUDE.md` del repo
`baserow`: `movPaga() && movEmpresa()==='clinera'`, con AND).

**Falla específica.** Sin acceso a la cuenta no se puede confirmar si existe
la lista de Customer Match, si el targeting excluye convertidos/descartados,
ni si Optimized Targeting está activo. Riesgo genérico conocido de esa
combinación: sin una lista de clientes reales subida, el "similar audience"
de la plataforma se entrena sobre **leads** (incluidos los malos), no sobre
**clientes que pagan** — reforzando el mismo perfil que hoy causa el problema.

**Fix priorizado.**
1. *(Alto impacto / esfuerzo medio)* Exportar clientes activos de Clinera
   desde la 940 (el filtro ya existe y está probado) y subir como lista de
   clientes en Google Ads → crear público similar sobre **esa** lista, no
   sobre leads.
2. *(Checklist)* Verificar exclusión de convertidos/descartados y estado de
   Optimized Targeting en cada campaña.

**Checklist de cuenta:**
- [ ] Audiencias → Gestor de audiencias → Tus fuentes de datos: ¿hay una
      lista de clientes subida? ¿De cuándo es la última actualización?
- [ ] ¿Existe un público similar creado sobre esa lista (no sobre leads)?
- [ ] Cada conjunto de anuncios, ¿excluye a convertidos (clientes actuales)
      y a leads marcados como descartados?
- [ ] Optimized Targeting: ¿activado o desactivado, y a propósito?

---

## 4. UX de clinera.io/agenda

**Estado actual (verificado en vivo, y de nuevo tras el redeploy de hoy —
sano).** La página no tiene nada más que el wizard: sin logos, sin video, sin
testimonios visibles en el primer tramo (el carrusel de testimonios aparece
recién desde el paso 3), sin FAQ, sin footer. El formulario no compite con
nada porque no hay nada más — coincide con el criterio "una sola acción clara
por pantalla" que pide el encargo. Camino: 1 tap → 1 tap (auto-avanza) → 5
campos → agendar ≈ 4 pantallas.

**Falla específica.**
- **La página no califica antes de agendar** — es la misma falla del Área 1,
  vista desde UX: cualquiera llega al agendamiento real.
- **El badge "SOLO DUEÑOS Y GERENTES DE CLÍNICAS" está oculto en móvil**
  (`display:none`) — justo donde entra la mayoría del tráfico de Instagram/
  Meta in-app. El único texto que pre-califica por rol desaparece en el
  dispositivo que más importa.
- **Nunca se muestra el precio.** A diferencia de `/ventas`, en `/agenda` los
  dos flags de precio están apagados — se pierde el filtro de autoselección
  por presupuesto que si tiene la variante hermana.

**Fix priorizado.**
1. *(Alto impacto / esfuerzo bajo)* Sacar el `display:none` del badge en
   móvil — una línea de CSS, cero riesgo.
2. *(Alto impacto / esfuerzo medio, ya lo pide Ricardo en el Área 6)*
   Rediseño completo del wizard con landing intermedia — ver abajo.
3. *(Medio impacto / esfuerzo bajo)* Mostrar el precio también en `/agenda`,
   como ya hace `/ventas`.

---

## 5. Creatividades

**Estado actual.** Sin acceso a Meta Ads Manager desde esta sesión (conector
`Meta_ads` no autorizado) no se pueden inspeccionar los anuncios activos ni
su copy real — este punto se entrega como checklist para que Ricardo lo
audite él mismo. **Pero la cuantificación de hoy (§8) sí da evidencia dura,
indirecta pero contundente: 45% de los leads de Meta terminan NQL (No
Califica), el doble que orgánico (27%).** La auditoría previa (PR #170) había
medido *atribución* (79% del tráfico trae huella real de campaña de Meta, sin
señal de bots) y concluyó que no había evidencia de "público equivocado" — esa
lectura sigue siendo cierta a nivel de tráfico, pero la de hoy mide
*resultado*, y ahí sí aparece la diferencia: el tráfico es real, pero
Meta trae casi el doble de leads que no califican que el orgánico.

**Falla específica.** No verificable sin acceso a la cuenta. El ángulo
"esto podrías lograr con un sistema con IA" y el pre-calificador de precio en
el copy (mencionar "$279 dólares", "decisión de negocio") son evaluables solo
mirando los anuncios reales.

**Señal dura observada en la captura compartida por Ricardo** (Ads Manager,
nivel Conjuntos de anuncios, filtro "Hoy: 22 ago. 2026"): dos conjuntos con el
mismo presupuesto diario (US$75.000) — **Latam**: US$38.128 gastados, 2 MQL,
US$19.064 por MQL; **Chile**: US$41.177 gastados, **0 MQL** (columna en
blanco). No se puede confirmar desde acá si esa ventana es de hoy o
acumulada, pero el patrón — gasto real sin ningún MQL registrado en el
conjunto Chile — amerita revisión inmediata del propio conjunto (creativo,
audiencia o algo roto en el tracking de ESE conjunto específico), antes de
cualquier otro cambio de esta auditoría.

**Fix priorizado — checklist de cuenta:**
- [ ] **Prioridad 0**: revisar el conjunto **Chile** (US$41.177 gastados, 0
      MQL en la captura) — confirmar si es un problema real de calidad de
      audiencia/creativo o un problema de tracking específico de ese
      conjunto (ej. landing distinta, país mal targeteado). No esperar al
      resto del checklist para mirar esto.
- [ ] Revisar cada conjunto de anuncios activo: ¿el copy menciona
      explícitamente "clínica" / "dueño de clínica" en las primeras 2 líneas,
      o es genérico ("agenda con IA") y podría atraer a cualquiera?
- [ ] ¿Aparece el precio (desde US$279) o alguna señal de "decisión de
      negocio" en el primary text, headline o el propio wizard?
- [ ] Identificar, por conjunto de anuncios, cuál tiene el mayor % de leads
      marcados NQL/Número inválido en Baserow 152 en las últimas 2 semanas
      (cruzando por UTM/campaign id) — es la forma más directa de encontrar
      "qué creativo trae la basura", y hoy es posible porque el `Origen`
      guarda el link completo con UTMs.
- Hay una skill especializada (`clinera-ads-copy`) con ángulos y copy
  pre-calificador ya diseñados para este caso exacto — vale la pena correrla
  sobre los conjuntos de anuncios de peor conversión una vez identificados.

---

## 5.1 Meta Ads — activar "Maximizar el número de clientes potenciales cualificados"

Pedido explícito de Ricardo durante la sesión (evidencia: capturas del
Administrador de anuncios y del Administrador de eventos de Meta).

**Estado actual.** En la pantalla de creación/edición de conjunto de
anuncios, "Objetivo de rendimiento" → "Objetivos de clientes potenciales"
muestra 3 opciones: *Maximizar el valor de las conversiones*, *Maximizar el
número de clientes potenciales* (la que está activa hoy) y **"Maximizar el
número de clientes potenciales cualificados"** — esta última aparece
**deshabilitada**. En el Administrador de eventos, el conjunto de datos
"[2026] OACG TECH" (pixel `1104567405156111`) tiene la Conversions API activa
y trae 50,2 mil eventos en 28 días, pero el diálogo "¿Cómo quieres conectar
tu CRM?" sigue sin completarse — es exactamente el paso que desbloquea el
objetivo "cualificados".

**Falla específica.** Hoy la campaña optimiza por **volumen** de clientes
potenciales (cualquiera que comparta contacto), no por **calidad** — es el
mismo problema raíz que motivó toda esta auditoría, visto desde el lado de
Meta. El objetivo que sí filtra por calidad está a un solo paso de activarse:
declarar el embudo de CRM en Events Manager sobre los eventos que **ya
existen** (el funnel MQL → SQL → SQL+ ya viaja completo por CAPI con contacto
hasheado, construido para el hallazgo refutado de "no hay señal downstream"
de la auditoría anterior — ver `sales/HANDOFF.md` del repo `baserow`).

**Fix priorizado.**
1. *(Alto impacto, esfuerzo bajo — 10 minutos en la UI)* En el diálogo "¿Cómo
   quieres conectar tu CRM?", elegir **"Crea el código manualmente"** (ya
   marcada como recomendada) — es declarar el mapeo de etapas sobre el CAPI
   que ya corre, no construir nada nuevo.
2. Mapeo de etapas propuesto: **MQL** (entrada) → **SQL** (calificado) →
   **SQL+/Contrata** (cierre) — mismo vocabulario que ya usa el pixel.
3. **Prerrequisito duro, ya resuelto hoy**: este objetivo depende de que el
   CRM esté recibiendo leads de verdad — si el incidente del punto 0 hubiera
   seguido activo, conectar esto habría optimizado sobre datos vacíos.
4. Una vez conectado, cambiar el "Objetivo de rendimiento" del conjunto de
   anuncios a "cualificados" y esperar la fase de aprendizaje (Meta necesita
   volumen mínimo de conversiones SQL/SQL+ por semana — a verificar contra el
   volumen real una vez conectado).

**Checklist de cuenta (Meta Ads Manager):**
- [ ] Administrador de eventos → completar "¿Cómo quieres conectar tu CRM?"
      → Crea el código manualmente.
- [ ] Confirmar que el mapeo de etapas calza con los nombres reales de
      evento (`MQL`, `SQL`, `SQL_Plus` — mayúsculas y guion bajo exactos).
- [ ] Conjunto de anuncios → Objetivo de rendimiento → cambiar a "Maximizar
      el número de clientes potenciales cualificados" una vez desbloqueado.
- [ ] Monitorear costo por resultado la primera semana — el objetivo nuevo
      cambia contra qué optimiza el algoritmo, puede subir el CPL mientras
      aprende aunque baje el costo por SQL real.

---

## 6. Wizard y landing intermedia — propuesta completa

Esto es lo que Ricardo pidió diseñar de cero, con spec propia. Se entrega
como **propuesta lista para maquetar en MagicPath antes de tocar producción**
(orden explícita de Ricardo) — no se implementa en el sitio sin su OK sobre
el boceto.

### Landing intermedia (antes del wizard)

Base: la página actual `/plataforma`. Breve, una sola pantalla con scroll
corto:
1. Qué ofrece Clinera (una línea por función: agente IA que responde/agenda,
   Clinera Intelligence, fichas clínicas, WhatsApp/FB/IG).
2. Logos o nombres de clínicas grandes que confían en Clinera.
3. El video de CNN.
4. Precio: "desde US$279/mes".
5. **CTA flotante, siempre visible**: «Me interesa agendar» → lleva al
   wizard.

Esta página **es el primer filtro**: quien no le interesa el precio o el
producto no llega al wizard — coincide con el pedido explícito de Ricardo
("la página anterior ya filtró").

### Wizard — 3 pasos, título «Unifica tu clínica con inteligencia artificial»

Diseño: split-screen — color sólido a un lado (verde para Clinera, siguiendo
el patrón que ya usan los wizards de Método Hebe/Protocolo Lumina con su
propio color de marca), preguntas en blanco al otro lado. Simple, sin
distracción visual adicional.

| Paso | Título | Campos |
|---|---|---|
| 1 | Hablemos de tus necesidades | Qué busca / qué espera lograr: agente de voz IA, agente de texto, Clinera Intelligence, conexión Instagram/FB/WhatsApp, fichas clínicas, etc. |
| 2 | Hablemos de tu clínica | Nombre de la clínica, **sitio web**, tamaño de operación, país, ciudad |
| 3 | Hablemos de ti | Nombre, correo, celular, **cargo** |

**El orden es la decisión anti-fake central**: los datos de la clínica (paso
2, con sitio web verificable) van *antes* que los datos personales (paso 3,
con cargo) — exactamente al revés del wizard actual, que pide nombre/clínica/
teléfono/email todo junto en un solo paso sin verificar nada primero.

Cada sección de preguntas lleva un título rotativo con funciones y prueba
social de Clinera: agente IA que responde y agenda, Clinera Intelligence,
fichas clínicas, consentimientos, conexión WhatsApp/FB/IG, agentes de voz con
acento local, odontograma, "mencionados en CNN", "mencionados en Forbes como
el próximo unicornio vertical", "grandes clínicas de Chile y LATAM confían en
Clinera".

**Contrato de datos**: `sitio web`, `cargo`, `ciudad` y la necesidad
estructurada del paso 1 viajan como columnas propias hasta Baserow 152 y como
campos estructurados en Twenty (nota, no solo texto libre) — es lo que pidió
Ricardo explícitamente para que el CRM muestre origen, tamaño de operación y
los campos del wizard con claridad.

### Próximo paso de este punto
Bocetar en MagicPath (Ricardo, con su cuenta) siguiendo esta spec; una vez
aprobado el boceto ahí, se implementa como cambio de código — por el tamaño
(toca `/agenda`, el wizard completo, y el contrato de datos hasta 152/Twenty)
esto califica como cambio grande y pasa por OpenSpec antes de tocar una línea.

---

## 7. Contrato de visibilidad del CRM (pedido transversal de Ricardo)

"Los leads deben verse en crm.oacg.cl claramente por su origen (Meta Ads /
Google Ads / Orgánico), su tamaño de operación y con los campos del wizard
nuevo." Estado y camino:

- **De aquí en adelante**, el `Origen`/`canalOrigen` de cada lead nuevo del
  wizard ya sale bien clasificado (fix aplicado hoy, punto 0.3).
- **El histórico sigue sucio**: 82% de los ~305 negocios en Twenty tienen
  `canalOrigen = ADS` (genérico, ni Google ni Meta) — solo 2 tienen
  `META_ADS` explícito y 0 `GOOGLE_ADS`. Backfill posible cruzando contra el
  `GCLID`/`Meta fbclid`/`Origen` que sí tiene la fila equivalente en Baserow
  152 (no se hizo hoy — es una migración de datos, entra en la categoría
  "grande" de `CLAUDE.md` y necesita spec propia).
- **Tamaño de operación**: hoy es un campo de Twenty que solo se llena si el
  wizard lo manda — con el wizard actual llega, con el v2 (Área 6) llega con
  más contexto (tamaño + necesidad + país + ciudad).
- **Vista sugerida en Twenty**: agrupar Oportunidades por `canalOrigen` ×
  `stage`, con `tamanoOperacion` como columna visible — no se creó hoy, se
  deja como tarea de configuración de UI (no requiere código).

---

## 8. Cuantificación (Baserow 152, flujo real — excluye el bloque restaurado del 2026-07-03)

**Universo**: 1.660 filas totales → **1.334 son el bloque restaurado**
(`Creado` en una ventana de 20 segundos el 2026-07-03, ver auditoría previa)
→ **326 filas de flujo real**, rango 2026-07-03 17:30 UTC a 2026-08-22 18:46
UTC. Excluir el bloque es crítico, no cosmético: sin excluirlo, Meta Ads se
reportaría con 550 leads en vez de los 258 reales (+113%).

| Métrica | Google Ads (n=6) | Meta Ads (n=258) | Orgánico (n=55) |
|---|---|---|---|
| Email de dominio gratuito | 66,7% | 84,5% | 49,1% |
| Clínica vacía | 0,0% | 0,8% | 0,0% |
| **Etapa = NQL (No Califica)** | 0,0% | **45,0%** | **27,3%** |
| Resultado IA = Número inválido | 0,0% | 1,6% | 7,3% |
| Con demo agendada (Fecha demo) | 83,3% | 69,4% | 65,5% |
| Reunión confirmada | 16,7% | 24,4% | 29,1% |
| Tamaño de operación vacío | 100%* | 87,6% | 60,0% |

*Google Ads: n=6, muestra demasiado chica para confiar en ningún porcentaje —
se necesita más volumen antes de sacar conclusiones de ese canal.

**Sobre toda la población de flujo real (326 filas, cualquier canal):**
email completamente vacío 1,2%, teléfono vacío o menor a 8 dígitos 1,8%.

### La lectura que importa

**Casi la mitad de los leads de Meta (45%) terminan NQL — el doble que
orgánico (27%).** Esto es el número que más pesa de toda la auditoría:
confirma con datos, no con intuición, que el problema de calidad SÍ está
concentrado en el canal pagado de Meta, no distribuido parejo. Contrasta
directo con el hallazgo de la auditoría anterior ("no hay evidencia de
público equivocado a nivel agregado") — esa medía atribución (79% Meta trae
huella de campaña), esta mide **resultado** (qué pasa con el lead después). Las
dos cosas pueden ser ciertas a la vez: el tráfico SÍ es de campañas de Meta
reales (no bots), pero casi la mitad de esas campañas reales no califica —
es un problema de **targeting/creativo**, no de fraude ni de atribución rota.

**Caveat de datos**: "Tamaño de operación" vacío en 87,6% de Meta es en sí
mismo sospechoso — el paso 2 del wizard pide esa respuesta antes de avanzar,
así que un lead que llegó a `152` debería traerla casi siempre. Vale la pena
una revisión de por qué ese campo se pierde específicamente en el camino de
Meta/`/agenda` (posible gap entre lo que manda el paso 2 y lo que
efectivamente queda escrito en esa columna) — no se investigó a fondo en esta
sesión, queda como pregunta abierta para la próxima.

---

## 9. Resumen final

| # | Área | Veredicto |
|---|---|---|
| 1 | Filtrado del formulario | **Ajustar** — server-side ya cerrado (PR #172); falta calificación real y datos verificables |
| 2 | Conversiones Google Ads | **Ajustar** — diseño conservador y correcto; bloqueado por 1 tarea pendiente en la UI |
| 3 | Audiencias | **Crítico** — sin verificar; con evidencia de que probablemente no existe Customer Match real |
| 4 | UX de /agenda | **Ajustar** — buena base (sin distracción), pierde el único filtro de rol en móvil |
| 5 | Creatividades | **Crítico** — copy real sin verificar, pero 45% NQL en Meta (vs. 27% orgánico) confirma con datos que el problema está concentrado ahí |
| 5.1 | Meta — objetivo "cualificados" | **Ajustar** — a 1 paso de activarse (conectar CRM en Events Manager), pedido explícito de Ricardo |
| 6 | Wizard y landing intermedia | **Crítico → propuesta completa entregada**, pendiente maquetar y aprobar |

### Los 3 fixes de mayor impacto para esta semana

1. **Investigar por qué Meta tiene 45% de NQL contra 27% de orgánico — empezar
   por el conjunto Chile** (Área 5): US$41.177 gastados con 0 MQL en la
   captura de hoy es el caso más extremo y el punto de partida más rápido
   para encontrar la causa (creativo, audiencia, o algo roto en ese conjunto
   puntual). Es el hallazgo con más evidencia dura de toda la auditoría.
2. **Conectar el CRM en Meta Events Manager y activar "Maximizar clientes
   potenciales cualificados"** (Área 5.1) — 10 minutos en la UI, no requiere
   construir nada (el CAPI con MQL/SQL/SQL+ ya corre); ataca el mismo
   problema del punto 1 cambiando qué optimiza el algoritmo, de volumen a
   calidad.
3. **Sacar el `display:none` del badge "SOLO DUEÑOS Y GERENTES" en móvil**
   (Área 4) — una línea de CSS, restaura la única señal de pre-calificación
   por rol justo donde entra la mayoría del tráfico pagado de Meta.

*(Terminar Data Manager en Google Ads (Área 2) y subir la lista de clientes
reales (Área 3) quedan como #4 y #5 — buen impacto, pero Google Ads es hoy
solo 1,9% del flujo orgánico medido por la auditoría anterior, así que el
apalancamiento es menor que arreglar el 79% que es Meta. El fix del incidente
del punto 0 —monitoreo del camino de ingesta— no entra en este top 3 porque
la causa raíz de hoy ya se corrigió; queda como tarea de esta semana igual,
por el costo de que se repita sin que nadie lo note.)*
