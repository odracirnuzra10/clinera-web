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

## Modelo de venta en dos reuniones

Deck interno del equipo comercial: `public/presentacion-venta-2-reuniones.html`
(`/nueva-reunion`). No es el deck de ventas al dueño. Titulares grandes,
sin texto chico: se proyecta, no se lee. La URL corta es la que se le
manda al equipo.

El modelo viejo tiraba todo el software en una sola reunión y quemaba el
interés. El nuevo divide: **R1** es la reunión inicial de exploración
(2–3 funciones del dolor); **R2** es la reunión de cierre, idealmente con
el gerente de operaciones. El precio exacto **nunca** sale en R1 — solo el
rango Vortex–Summit (USD 279–479/mes, `pricing.ts`); la implementación se
detalla en R2.

**Por defecto todos van a dos reuniones.** Una sola solo si el cliente lo
pide expresamente. No se recorta por sucursal, ticket ni lead caliente:
esa excepción vieja hacía que se saltara la exploración. Guardián:
`tests/presentacion-venta-2-reuniones.spec.ts`.

## Programa partner: `/partners` (antes `/agencias`)

La URL pública del programa es **`/partners`**. `/agencias` redirige permanente
(308) ahí — no reabrir esa ruta ni volver a publicar el 15% de "descuento
permanente" de agencias: ese modelo se reemplazó en agosto 2026.

Números y copy viven en `src/content/partners-program.ts`: **bono único US$ 150
por referido que cierra** (sin comisión sobre el plan); **10% de descuento por
3 meses para la clínica referida** (lo aplica el closer de Clinera, no el
partner); requisitos de contenido (4 historias/mes con mención, 1 reel/mes en
colaboración, bio de Instagram como partner de clinera.io). No confundir el
10% × 3 meses con el 15% permanente de agencias (muerto) ni con una comisión
del partner. La landing (`src/app/partners/page.tsx` +
`src/components/partners/PartnersLanding.tsx`) los consume. El deck
`public/presentacion-partners/index.html` no puede importar TS: si cambia el
bono, el descuento o los requisitos, hay que tocar esas slides a mano.
`/presentacion-agencia` redirige a ese deck (el archivo viejo quedó huérfano:
no lo actualices pensando que es el vigente).

`public/reseller.html` es un "Programa Reseller" viejo y huérfano (50% de
comisión + 10% de descuento) que **no** está enlazado desde `/partners` ni
desde ningún componente en `src/` — no es el programa vigente, no lo revivas.

Las microlandings individuales (`/partner/{vanity}`, p.ej. `/partner/km`) son
otra cosa: páginas de referido, no el programa. Viven en `src/lib/partners.ts`
+ `src/components/partner/`.

# Embudo de Meta Y Google Ads: qué evento vale cuánto, y dónde vive de verdad

> [!WARNING]
> **Leer solo este repo lleva a conclusiones falsas.** De los tres workflows
> que mandan conversiones al pixel `1104567405156111`, **dos no están
> versionados acá**. En agosto de 2026 se diseñó un cambio entero sobre la
> premisa —falsa— de que SQL+ no generaba ninguna señal, porque el repo no lo
> mostraba. Antes de tocar el embudo, mira la instancia de n8n.
>
> Auditoría Graph API del 2026-08-26 (valores, custom conversions, campañas
> Chile/LATAM, por qué el MQL de WhatsApp no entrena):
> `docs/auditoria-meta-eventos-2026-08-26.md`. Embudo vigente (Ricardo,
> 27-ago): **`Lead` US$ 5 al enviar el Instant Form → `MQL` US$ 10 al agendar
> → SQL 100 → SQL+ 300.** El «MQL US$ 5 para wizard e Instant Form» del
> 26-ago duró un día; si aparece en otro doc, es residuo.
>
> **El MQL se gana agendando, en los tres caminos**, y ninguno lo gana
> cambiando de etapa en Twenty. La versión anterior de esta línea decía «lead
> de formulario: al pasar a PQL en Twenty» y era un error: en ese workspace
> `PQL` está rotulado «PQL · No contesta» y va en rojo, así que ese emisor le
> habría enseñado a Meta a buscar gente que no contesta. Se canceló; el lead
> de formulario gana su MQL en `/reserva-tu-hora`.
>
> Instant Form de Chile se activó el **26-ago noche**. Hasta entonces las
> campañas iban 100 % a `clinera.io/agenda`. La basura histórica (abandono
> en paso 2, `size_captured` sin contacto) es del wizard, no de Lead Ads.
>
> **Intake Instant Form:** el HUB `qOGjfU1AgubcOHvt` (`/webhook/meta-leadads`)
> enruta el page_id Clinera `697874326752777` a Sub A `YmauqyDqrZNKIYlg`.
> Ese sub crea contacto en Clinera (funnel 890), fila Baserow 152, negocio
> Twenty y CAPI `Lead` US$ 5 con `lead_id`. Spec:
> `baserow/openspec/changes/lanzamiento-instant-forms-embudo/`. En anuncios
> no prometer CAMILA/LIA. Graph del form en español usa `correo_electrónico`
> / `nombre_y_apellidos` / `número_de_teléfono` (no los nombres en inglés) —
> el mapeo vive en `baserow/sales/n8n/leadgen-preparar.js`.
>
> **Por qué el HUB está en 0 ejecuciones (2026-08-27):** no es n8n. Un `GET`
> pelado a `/webhook/meta-leadads` devuelve **403**, y eso se leyó como «n8n
> rebota a Meta» — falso, y costó medio día. Un GET sin `hub.verify_token` a un
> webhook de verificación de Meta *tiene* que dar 403; con el token bueno
> devuelve el challenge, y el POST (lo que Meta usa para entregar) siempre dio
> 200. El HUB está completo y no hay que tocarlo.
>
> **Y después falló un segundo diagnóstico, por la misma clase de error.**
> `GET /697874326752777/subscribed_apps` devolvió `{"data":[]}` y se concluyó
> «ningún app suscrito a la página». Falso: esa respuesta está **acotada al app
> dueño del token**, y se preguntó con el de un conector. Con un token del app
> de n8n (`1239051817789232`) las tres páginas —Clinera, Hebe y Lumina—
> aparecen suscritas con `leadgen`. Un `[]` de un token ajeno no es un
> diagnóstico; `verificar_hub_meta.py` ahora se niega a responder si el token
> no es del app auditado.
>
> **Lo que sigue roto (27-ago):** con la suscripción puesta y el webhook sano,
> Meta igual no entrega. De los 6 leads del día, los 6 llegaron al CRM porque
> se inyectaron a mano. El corte está en la otra mitad, la que
> `subscribed_apps` no ve: el **callback a nivel de app** (App Dashboard →
> Webhooks → objeto «Página»). Detalle en `baserow/sales/HANDOFF.md` §27.

| Evento | Cuándo | Valor | Dónde vive |
|---|---|---|---|
| `Lead` | rellenó el Instant Form de Meta | US$ 5 | n8n Sub A (aplicador: `baserow/sales/n8n/aplicar_instant_form_mql.py`) |
| `MQL` | agendó en `/agenda`, **o** la IA agendó por WhatsApp, **o** un lead de formulario agendó en `/reserva-tu-hora` | US$ 10 | wizard: `clinera-agenda-reserva` · IA: `clinera-meet-por-profesional` · formulario: `/reserva-tu-hora` (este repo) |
| `SQL` | el closer lo califica en `crm.oacg.cl` | US$ 100 | `integrations/n8n/crm-sql-twenty.workflow.json` **y** un segundo workflow que lee Baserow 152, sólo en n8n |
| `SQL_Plus` | el closer lo sube a propuesta | US$ 300 | sólo en n8n |

**Desde el 2026-08-21, Google Ads recibe el mismo embudo** (MQL/SQL/SQL+, mismos
montos) — no por CAPI, sino porque los workflows de SQL y
SQL+ (no el de MQL) marcan Baserow 152 y un feed nuevo en `baserow`
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

# `/reserva-tu-hora`: el destino del Instant Form, solo calendario

Creada el 27-ago-2026. Es la URL que el Instant Form de Meta abre sola al
enviarse (destino «Reservar cita» → enlace personalizado). **Antes apuntaba a
`/demo`, que es una página de video sin calendario**: el lead completaba el
formulario y no tenía dónde agendar — el embudo se cortaba ahí.

- **No duplica el calendario**: importa `StepClineraScheduler` de
  `VentasLanding.tsx`, igual que `/agenda`. Sus piezas internas (BackBtn,
  reparto determinista de profesional, doble hora local/Chile) no están
  exportadas; copiar el JSX sería mantener dos calendarios que se
  desincronizan.
- **Dos modos, y el segundo no es raro**: Meta no garantiza prellenar un enlace
  «Personalizado» (sí lo hace con Calendly/HubSpot). Con
  `?nombre=&email=&telefono=` va directo al calendario; sin ellos pide esos tres
  campos, que el webhook del turno necesita sí o sí.
- **`leadgen_id` decide si se da de alta el lead.** Con él, el lead YA existe
  (lo creó n8n al recibir el formulario) y esta página sólo agrega la reserva:
  volver a darlo de alta sería una segunda llamada de la IA al mismo teléfono.
  Sin él, la página lo crea. Ese id viaja en el payload hasta el campo
  `leadgenId` del negocio en Twenty, que es lo que habilita Conversion Leads.
- Al confirmar la hora sale el **`MQL` US$ 10**, el mismo que `/agenda`: el lead
  de formulario gana su MQL agendando, no por cambiar de etapa en el CRM.
- `noindex` en tres capas (metadata, `robots.ts`, fuera del sitemap): es un paso
  de un anuncio, no contenido, y no debe competir con `/agenda`.
- Para que la atribución no salga `organico`, la URL del anuncio debe llevar
  `?lead_source=meta-ads` — `clasificarLeadSource()` le da prioridad a la query,
  y un Instant Form no deja `fbclid`.

Guardián: `tests/reserva-tu-hora.spec.ts`.

# `/agenda`: layout Hebe, agendador de siempre

La página canónica es `AgendaHebeLanding` (50/50, carousel, 5 pasos). El
calendario **no** es Cal.com: reusa `StepClineraScheduler` de
`VentasLanding.tsx` (nativo primero, embed de `app.clinera.io` de respaldo).
`/ventas` sigue con el wizard anterior. `/agenda-hebe` redirige a `/agenda`.

El aviso de Google Chat y Twenty los arma `OACG TECH | Wizard` (`A3wOPmhQjit8VswM`)
en n8n: en `/agenda` ya no se anuncia «Software actual». Van necesidad, cargo,
web/redes, volumen y clínica (ciudad se dejó de pedir en el paso 3 — el
webhook sigue mandando `ciudad: ""`). El Chat del paso 3 sale **al crear el
lead**, inmediato; el del agendamiento lo manda el workflow de Meet cuando
ya existe el evento (no el segundo POST del wizard). El botón «Agenda con tu
ingeniero» abre el calendario **sin esperar** el webhook — si se vuelve a
`await`, se pierden leads.

# `/agenda`: la hora que se guarda es de Chile, siempre

El último paso de `/agenda` (`StepClineraNativo` en
`src/components/ventas/VentasLanding.tsx`) recibe los bloques de la API de
Clinera como texto plano en **hora de Chile** (`"10:00"`), sin zona.

- **Lo que se muestra** es la hora **local de la IP** (`x-vercel-ip-timezone`
  de Vercel), no el reloj del sistema. Un dueño en México con la laptop en
  hora Chile veía "10:00" y creía que era su 10:00. Si el offset no es el de
  Chile, cada bloque muestra las dos: `14:00` tu hora + `17:00 Chile`.
- **Lo que se manda al webhook no se toca**: sigue siendo la hora de Chile.
  Clinera, el turno y el Meet dependen de eso.
- **El offset de Chile sale de `Intl`, nunca de una constante.** Chile pasa a
  GMT−3 el primer domingo de septiembre; un número escrito a mano empieza a
  mentir ese día sin que nadie se entere.

El profesional tampoco lo elige el visitante: se reparte según disponibilidad,
de forma **determinista**. Nada de `Math.random()` ahí — el cálculo corre en un
`useMemo` que se recalcula varias veces, y el azar le cambiaría el profesional
al lead entre que elige la hora y confirma.

**No ofrecer el día UTC en curso.** La API arma esa grilla desde la hora
actual, no desde el horario de atención: de día faltan horas y de noche
aparecen madrugadas (`01:45`, `02:45`…). El picker ya partía en "mañana", pero
"mañana" del visitante (o de Chile) **sigue siendo hoy en UTC después de las
20:00 Chile**. Hay que saltar los dos calendarios (`diasCandidatosAgenda`) y
filtrar bloques fuera de oficina (`esBloqueHabil`).

Guardián: `tests/agenda-scheduler.spec.ts`.

# `/presentacion`: archivo estático, no componente — y el grid de logos ya no tiene número mágico

`/presentacion` (el deck de ventas) no es una ruta de Next.js: `next.config.ts` reescribe
`/presentacion` → `/presentacion/index.html`, un único archivo HTML/CSS/JS de ~4.300 líneas
en `public/presentacion/index.html`. No hay componente React que tocar ahí.

**1 cuenta Clinera = 1 número de WhatsApp, 1 cuenta de Instagram y 1 cuenta de Facebook.**
Es el recorte comercial de canales, no un detalle de onboarding. Si la clínica opera con
más de un número o más de un perfil, son más cuentas (y más planes). Vive en la
diapositiva `#canales` de ese HTML. No diluirlo en un bullet de AURA: tiene slide propio
porque en la demo se asume mal. Guardián: `tests/presentacion-canales.spec.ts`.

**CAMILA y LIA en el deck:** próximamente octubre 2026. AURA es la disponible
hoy. El lead de `#empleados-digitales` no puede volver a decir "Disponibles hoy"
sobre las tres. Visualmente AURA es la tarjeta protagonista (`.ed-agent-now`);
CAMILA y LIA van apagadas (`.ed-agent-soon`, foto en gris). No dejar las tres
al mismo peso: en la demo se lee como que las tres se contratan hoy.
Guardián: `tests/presentacion-empleados.spec.ts`.

**Próximas funciones.** Catálogo en `src/content/proximas-funciones.ts`.
Anunciadas en blog + `llms*.txt` (agosto 2026), **no en `/presentacion`**:
Open Factura (DTE Chile, emisor — no ERP), odontograma y presupuestador,
Instagram Direct + Messenger, email marketing, trigger de cumpleaños.
Fuente pública: `/blog/proximas-funciones-clinera-dte-odontograma-instagram`
(hub) + un artículo por función en `POSTS_POR_FUNCION`
(`src/content/proximas-funciones.ts`). Siguen inéditas: inventario y
liquidaciones de sueldos (Clinera, diciembre 2026).
El deck no debe mencionar Open Factura. Guardián: `tests/proximas-funciones.spec.ts`.

**Citar marcas con link.** En copy público (blog, landings, llms), la primera
mención de un competidor o emisor lleva al sitio oficial y, si existe, a
`/comparativas/{slug}`. El posicionamiento AEO/SEO sale de asociar entidades
(Dentalink, Dentalsoft, Reservo, AgendaPro, SII, Meta), no de dejar el nombre
en texto plano.

La franja "Clínicas que ya operan con Clinera" (`.hero-clients`) vivía con
`grid-template-columns: repeat(7, minmax(0, 1fr))` — un número mágico que sólo cuadraba
porque había exactamente 7 logos (Chile). Agosto 2026: se sumaron 8 clínicas de
México/Perú/Colombia (15 en total) y el grid pasó a
`repeat(auto-fill, minmax(96px, 1fr))`, que se reacomoda solo según cuántos logos haya.
Si alguien vuelve a fijar un número de columnas a mano, se rompe apenas cambie el conteo
de logos otra vez — no hardcodear ese número.

Los logos de clientes **no viven en un solo lugar** — hay tres listas independientes que
no se sincronizan entre sí:
- `public/presentacion/index.html` (`.hero-client-logos`): la completa, 15 logos.
- `src/components/plataforma/PlataformaLanding.tsx` (`CLIENTS`, para `/plataforma`):
  sólo 6, le falta CLC — no se tocó en este cambio, sigue desactualizada.
- `src/components/home-v3/sections.tsx` (`Logos()`, para `/`): nombres de clínicas
  **inventados** ("Hospital del Valle", "Dermaclinic"...), no son clientes reales.

Los archivos de imagen viven en `public/presentacion/clientes/*.{png,svg}`. El filtro
`grayscale(1)` en `.hero-client-logo img` ya los pasa a blanco/negro al vuelo — los PNG
fuente están en color a propósito, igual que los 7 originales; no hay que preprocesarlos.

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

# Vista de Negocios en Twenty: el teléfono no sale de la Persona

La tabla de Opportunities **no puede** mostrar el teléfono de
`pointOfContact` como columna: vive en otro objeto. Por eso el negocio
tiene el campo denormalizado `telefonoContacto` (tipo PHONES, label
«Teléfono del contacto»), pegado al contacto en «Todas las oportunidades».
n8n lo copia al crear o refrescar el lead (Sub A, Wizard y Meet). El SQL
de Meta sigue hasheando el número desde la Persona, no desde esta columna.
Aplicador: `integrations/n8n/aplicar_telefono_contacto.py`.

# Vista de Negocios: la hora exacta no sale de `createdAt`

El campo de sistema `createdAt` de la Opportunity (`6921350c-ee3c-46e9-a541-70130b735229`)
tiene `displayFormat: RELATIVE` («hace 3 horas») y Twenty responde **403**
si se intenta cambiarlo: es de sistema. Por eso el negocio tiene el campo
custom `horaRegistro` (DATE_TIME, label «Hora de registro»,
`ccc038cb-b161-4c94-a625-24289b63d266`, formato `USER_SETTINGS` — el mismo
absoluto que Fecha demo). n8n lo escribe al **crear** y lo **pisa** cuando
el mismo lead vuelve a enviar el formulario (Instant Form o paso 3 del
wizard). Busca a la persona por email y, si no está, por teléfono: un
reenvío con otro correo no debe crear un segundo contacto. Tras el POST
del negocio hace GET; el 28-ago un alta devolvió id y el GET era 404, y
«Leads del día» se quedó en 4 de 5. Un agendamiento (Meet /
`booking_confirmed`) no toca `horaRegistro`.

**«Leads del día» filtra `horaRegistro` IS_TODAY.** Así un lead que cotizó
ayer y reenvía el form hoy reaparece en la vista de hoy, con una nota
`🔁 Ya había cotizado` (envío anterior + este envío, hora Chile). La
columna **Notas** (campo texto `notas`, no la relación Notes de Twenty,
que no se puede renombrar). Web / Instagram, Ciudad y Cargo están ocultas: el Instant Form no las
trae y el wizard ya no pide ciudad. No se filtra por `ultimoContacto`:
ese campo se mueve también al agendar y al tocarlo a mano, y el 28-ago
infló el tablero (10 filas vs 5 de Meta).

Aplicador: `integrations/n8n/aplicar_hora_registro_aviso_chat.py`.

# Google Chat: un aviso al crear el lead y otro al agendar

El espacio es el de siempre (`spaces/AAQAY5jOsuA`). El webhook vive en el
nodo «Notify Google Chat» del Wizard — **no versionar key/token**; el
aplicador lo clona al Sub A y al Meet.

| Cuándo | Quién avisa |
|---|---|
| Instant Form de Meta | Sub A, en paralelo a CAPI, desde `Prepare Lead Data` |
| Paso 3 de `/agenda` o `/ventas` (contacto) | Wizard, desde `Solo etapa de contacto` (**inmediato**; ya no espera 60 s) |
| Agendó (Meet de `/agenda` nativo o agente IA) | Meet, después de `Crear Evento + Meet` (anti-dup 10 min; salta `esPrueba`) |

`Solo etapa de contacto` sigue cortando el `booking_confirmed` del wizard,
así que el segundo POST de `/agenda` no manda otro aviso de «lead». El de
la reserva lo manda Meet cuando el calendario ya existe. El wait de 60 s +
relectura de Baserow **ya no alimenta Chat**; sigue ahí para crear el
contacto Clinera @744 si agendó. El recableo viejo
(`baserow/sales/n8n/recablear_aviso_unico.py`) no hay que reaplicarlo
encima: volvería a colgar Chat del wait y Instant Form / Meet quedarían
mudos otra vez.

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
terminando de agendar. `Solo etapa de contacto` sigue descartando el POST de
`booking_confirmed` para no avisar «lead» dos veces ni recrear el contacto
Clinera. El aviso de **agendamiento** ya no espera esos 60 s: lo manda el
workflow de Meet. Ver la sección de Google Chat arriba.

Si cambiás las claves `lead_stage` / `booking_status`, ese corte deja de
funcionar y el Wizard vuelve a avisar el mismo lead al confirmar la hora.

# Pack AEO agosto 2026 — punteros post-migración

Decisiones consolidadas en la rama `feat/aeo-fase1-contenido` (agosto 2026):

- **Stack IA (desde 01-08-2026):** GLM 5.2, Gemini 3.7 Flash, Claude Opus 4.8 y
  Claude Sonnet 5 vía Vertex AI (Google Cloud). Nombres y orden canónicos:
  `src/content/ia-stack.ts`. OpenRouter y Kimi K2.6 son residuo — solo aparecen
  en `/blog/efectividad` como nota histórica del estudio publicado.
- **Datos clínicos:** GCP región Santiago (`southamerica-west1`). Los datos
  residen en Chile (Ley 21.719).
- **CAMILA y LIA:** en el sitio público siguen listadas en Atlas/Summit. En el
  deck de ventas (`/presentacion`, `#empleados-digitales`) van **próximamente
  octubre 2026**; AURA es la que está disponible hoy. No volver a poner
  "Disponibles hoy" sobre las tres — en la demo se vende lo que aún no opera.
- **MFA:** activo desde 2026-08-25 (fila confirmada en `src/content/seguridad.ts`).
- **Precio máximo publicado:** USD 479/mes (Summit). Plan Corporativo USD 1.900
  eliminado del sitio público.
- **"Empleado digital":** término canónico de Clinera para AURA/CAMILA/LIA.
  Definición en `src/content/empleado-digital-definicion.ts`, artículo en
  `/blog/que-es-un-empleado-digital-para-clinicas`, DefinedTerm en
  `/empleado-digital`. No llamarlos "chatbot" salvo para contrastar.
- **Landings "mejor software":** pilares en `/mejor-software-clinicas` (+ `/chile`,
  `/mexico`, `/colombia`); city-pages siguen en `/recursos/mejor-software-clinicas-*`.
  Data tipada en `src/content/mejor-software.ts`.

# Programa partners (`/partner/{vanity}` y `/p/[slug]`)

Un partner = una entrada en `src/lib/partners.ts`. La landing, el OG, el kit y
el mensaje de WhatsApp se arman solos: no hay que tocar componentes para sumar
al número 2 ni al 50. Si el partner tiene `vanity`, la URL pública es
`/partner/{vanity}` y `next.config.ts` redirige `/p/{slug}` ahí.

Katherine Meza: vanity `km` → `https://www.clinera.io/partner/km`. El kit
(privado, `noindex`) está en `/partner/km/kit`. Yasna Vásquez: vanity `yv` →
`/partner/yv`, ref `YASNA01`.

El CTA público dice **«Coordinar reunión con Clinera»** (`PARTNER_CTA_LABEL` en
`src/lib/partners.ts`): hero, cierre y sticky. Sigue yendo a WhatsApp con el
mensaje de `src/lib/whatsapp.ts` (incluye `ref: KATHE01` / `YASNA01`). El helper
«Te responde una persona, no un bot.» se queda. No volver a «Hablar con Rebeca
por WhatsApp».

El clip de CNN es el mismo de `/plataforma` (`PressCNN`): Vimeo
`1205127087`, src en `PARTNER_CNN_VIMEO_SRC`. Foto del partner:
`public/partners/<slug>.jpg` (ver `public/partners/README.md`); si falta, las
iniciales — nunca un img roto. El círculo recorta el centro del cuadrado: la
cara tiene que ir al medio, no abajo. El primer recorte de Yasna mostró la
frente y el letrero QUALITY/VITALITY.

**El dato de cara al referido es el 10% × 3 meses**, no el bono de US$ 150.
El US$ 150 es lo que cobra el partner; vive en `/partners`. En
`/partner/{vanity}` el titular es el descuento de la clínica (lo aplica el
closer al cierre). Sigue sin publicarse precio de plan (Vortex/Atlas/Summit,
279/379/479/450).

**Por qué el `ref` va dentro del texto de WhatsApp.** El 90% del tráfico llega
desde un sticker de Instagram o un DM. En WhatsApp no sobreviven cookies ni
UTMs. Si se acorta o se “limpia” el mensaje pre-llenado de
`src/lib/whatsapp.ts`, se pierde la atribución y el closer no sabe de quién
viene el prospecto.

La landing pública no muestra precios de plan: eso lo conversa ventas (hoy
Rebeca). El 10% × 3 meses sí se publica: es el beneficio del referido. El kit
es lo que se le manda al partner, no al prospecto.
