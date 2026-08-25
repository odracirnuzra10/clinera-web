# /seguridad — pendientes por confirmar

Página pública de seguridad y protección de datos, en `/seguridad`. Está viva y
enlazada desde el footer como **Ley de Datos N° 21.719**.

La regla de la página es que **no se publica ningún dato técnico sin verificar**.
Todo lo que falta se renderiza con el componente `<Pendiente />`, en amarillo
(`#FBF3DB`), a la vista del visitante. Es feo a propósito: una página de
cumplimiento con bloques amarillos incomoda, pero una que inventa la región de
alojamiento de datos clínicos frente a la Ley 21.719 tiene costo real.

Contenido en `src/content/seguridad.ts`. Cuando confirmes un dato, reemplaza el
campo `pendiente` por los campos reales de esa fila y borra la entrada de la
tabla de abajo.

---

## Infraestructura y región — RESUELTO (2026-08-24)

Confirmado por Ricardo: **Google Cloud Platform, región Santiago de Chile
(southamerica-west1)**. Los datos clínicos residen en Chile. Actualizado en
`/privacidad`, FAQ de home, `/funciones`, fichas clínicas, comparativas,
`recursos-templates`, `llms-full.txt` y esta página a la vez.

Inferencia de IA: **Vertex AI (Google Cloud)** desde el 01-08-2026 — modelos
GLM 5.2 y Gemini Flash 3.7. MFA: **activo** desde 2026-08-25 (confirmado por
Ricardo).

---

## Inventario de pendientes

| # | Pendiente | Dónde aparece | Responde | Estado |
|---|---|---|---|---|
| 1 | Proveedor de nube y región | Resumen, tabla de infraestructura, tabla de subencargados, FAQ | Lopez | **Resuelto 2026-08-24** — GCP Santiago |
| 2 | Región exacta / transferencia internacional | Resumen, infraestructura, bloque de región, FAQ | Lopez | **Resuelto 2026-08-24** — southamerica-west1, sin salida en reposo |
| 3 | Proveedor de IA definitivo | Subencargados, sección de IA, FAQ | Lopez | **Resuelto 2026-08-24** — Vertex AI (GLM 5.2 + Gemini Flash 3.7) |
| 4 | Qué campos se envían al modelo en cada conversación y cuáles nunca salen | Sección de IA | Lopez + equipo técnico | Abierto (reescrito sin intermediario; inventario pendiente) |
| 5 | Ventana de retención del proveedor de IA | Sección de IA | Lopez | Abierto (reescrito en términos de Vertex) |
| 6 | Si la clínica puede desactivar AURA, CAMILA y LIA conservando agenda, fichas y pagos, y si es autoservicio | Sección de IA | Equipo de producto | Abierto |
| 7 | Proveedor de voz de CAMILA: nombre, región y retención del audio | Subencargados | Lopez | Abierto |
| 8 | Pasarela de pago activa. `/privacidad` nombra Stripe, MercadoPago y Webpay/Transbank; `package.json` sólo trae `stripe` | Subencargados | Lopez | Abierto |
| 9 | Roles y permisos dentro de la clínica: cuáles existen, qué ve cada uno, quién los administra | Infraestructura | Equipo de producto | Abierto |
| 10 | MFA | Infraestructura | Ricardo | **Resuelto 2026-08-25** — activo en producción |
| 11 | Gestión de vulnerabilidades: cadencia de parcheo, escaneo de dependencias, pentest, canal de reporte responsable | Infraestructura | Equipo técnico | Abierto |
| 12 | Si el agendamiento sin RUT ya está en producción | Minimización | Equipo de producto | Abierto |
| 13 | Plazo comprometido para notificar un incidente a la clínica, y canal del aviso | Incidentes | Lopez | Abierto |
| 14 | Publicar el anexo DPA como PDF descargable | Hero y cierre | Lopez | Abierto |

**Nota sobre los pendientes 9 y 11:** no es que falte confirmarlos, es que
*no existe ninguna mención* a roles, permisos ni gestión de vulnerabilidades en
todo el repositorio ni en el sitio público. Si la funcionalidad no existe
todavía, la fila se elimina de la tabla en vez de publicarse; si existe, hay
que documentarla.

---

## Lo que sí quedó publicado como verificado

Cada fila confirmada de la página cita su evidencia. No entró nada sin ella.

| Afirmación | De dónde sale |
|---|---|
| Google Cloud Platform, región Santiago (southamerica-west1); datos clínicos en Chile | Confirmado por Ricardo 2026-08-24; publicado en `/privacidad` |
| Vertex AI (GLM 5.2 + Gemini Flash 3.7) desde 01-08-2026; sin entrenamiento de modelos fundacionales | Confirmado por Ricardo 2026-08-24; `/privacidad` |
| MFA activo para todas las clínicas | Confirmado por Ricardo 2026-08-25 |
| AES-256-GCM sobre el 100% del contenido clínico, con envelope encryption | Ya publicado en `/ley20584` |
| Una llave de cifrado por clínica, aislamiento criptográfico entre clínicas | Ya publicado en `/ley20584` |
| Llave maestra en KMS gestionado, IAM mínimo, rotación cada 90 días | Ya publicado en `/ley20584` |
| Registro de quién accede a cada ficha clínica | Ya publicado en `/ley20584` |
| Respaldos automáticos con recuperación punto en el tiempo, ventana de 7 días | Ya publicado en `/ley20584` |
| HSTS 2 años + includeSubDomains + preload, upgrade-insecure-requests | `next.config.ts`, verificable con `curl -sI https://www.clinera.io` |
| CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy | `next.config.ts`, verificable con `curl -sI` |
| Los datos no se usan para entrenar modelos | Declarado en `/privacidad` + compromiso contractual de Google Cloud |
| WABA de la clínica vía Meta Embedded Signup, Clinera como Tech Provider | Confirmado en el encargo de esta página |
| Timeline de retención: día 0 / 0-60 / 60 / 95, con avisos al 0, 30 y 55 | Confirmado en el encargo de esta página |
| Plazo interno de 5 días hábiles para entregar datos a la clínica | Confirmado en el encargo de esta página |
| Ficha clínica: 15 años, artículo 11 del Decreto 41 de 2012, obligación del prestador | Confirmado en el encargo de esta página |

Las tres últimas del bloque "confirmado en el encargo" son **compromisos
contractuales** que la página ahora declara en público. Vale la pena que alguien
de operaciones confirme que el runbook real de baja de clínica coincide con el
timeline publicado, sobre todo el día 95 de purga de respaldos frente a la
ventana de PITR de 7 días que declara `/ley20584`: son cosas distintas, pero un
abogado va a preguntar por la diferencia.

---

## Dependencias

**Ninguna.** No hizo falta ningún `pnpm add`. La página usa sólo lo que ya está
en el repo: Next 16, React 19 y CSS Modules.

Dos detalles del stack que conviene saber si alguien la retoma:

- **Tailwind no está activo en el sitio.** `@tailwindcss/postcss` está instalado,
  pero `globals.css` nunca importa `tailwindcss` — el único archivo que lo hace
  es `src/app/26mayo/styles.css`, que es una presentación aparte. Las clases
  utilitarias de Tailwind **no hacen nada** en el resto del sitio. Por eso la
  página usa un CSS Module, que es el patrón de otros 14 archivos del repo.
- **Las fuentes son self-hosted.** Outfit (400 a 800) y JetBrains Mono (400 a
  600) ya están en `src/app/fonts.css`. No se agregó ninguna request externa.

## Estructura de archivos

```
src/app/seguridad/page.tsx                      metadata, JSON-LD, Nav y Footer
src/content/seguridad.ts                        todo el contenido y los pendientes
src/components/seguridad/SeguridadLanding.tsx   las 11 secciones
src/components/seguridad/seguridad.module.css   estilos
src/components/seguridad/Pendiente.tsx          el bloque amarillo
src/components/seguridad/Countdown.tsx          días hasta el 1 de diciembre
src/components/seguridad/Faq.tsx                acordeón accesible
src/components/seguridad/Reveal.tsx             aparición en cascada
src/components/seguridad/RolesDiagram.tsx       diagrama SVG de los cuatro roles
```

El JSON-LD de `FAQPage` sólo incluye las preguntas con respuesta confirmada. Las
que hoy se responden con un `<Pendiente>` quedan fuera de los datos
estructurados a propósito: publicar en schema.org algo sin verificar es
exactamente lo que esta página existe para no hacer.
