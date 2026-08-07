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

## Lo primero: hay una contradicción publicada sobre dónde viven los datos

**Esto bloquea el mayor diferenciador de la página y hay que resolverlo antes que
cualquier otro pendiente.**

El sitio hoy declara **AWS São Paulo** en seis lugares públicos:

| Archivo | Qué dice |
|---|---|
| `src/app/privacidad/page.tsx:355` | "Proveedores de infraestructura cloud (AWS São Paulo)" |
| `src/content/home-faq.ts:30` | "Servidores en AWS (Sao Paulo), con cifrado en tránsito y reposo" |
| `src/components/interior-v3/FuncionesV3.tsx:353` | "cifrado en AWS Sao Paulo" |
| `src/components/interior-v3/FichasClinicasHubV3.tsx:762` | "almacenamiento cifrado en LATAM (AWS São Paulo o similar)" |
| `src/app/comparativas/[slug]/page.tsx:843,929` | "hosting AWS São Paulo" |
| `src/content/recursos-templates.ts:599` | "hosting AWS São Paulo (datos clínicos cifrados)" |

El proyecto de esta landing, en cambio, asumía **Google Cloud** con región a
confirmar, y `/ley20584` menciona "Cloud KMS", que es nomenclatura de Google.

Son respuestas distintas y sólo una puede ir en un contrato firmado. Además, la
diferencia no es cosmética: **AWS São Paulo está en Brasil**, así que el
argumento de que los datos de pacientes chilenos no salen de Chile no se sostiene
sobre la infraestructura declarada hoy. Por eso la página no lo afirma.

Al cerrarlo hay que actualizar **las seis referencias de arriba y esta página a
la vez**, o el sitio queda contradiciéndose solo.

---

## Inventario de pendientes

| # | Pendiente | Dónde aparece | Responde |
|---|---|---|---|
| 1 | Proveedor de nube y sus certificaciones vigentes (ISO 27001 / 27017 / 27018, SOC 2) | Resumen, tabla de infraestructura, tabla de subencargados | Lopez |
| 2 | Región exacta de alojamiento y si hay transferencia internacional de datos | Resumen, infraestructura, bloque destacado de región, FAQ | Lopez |
| 3 | Proveedor de IA definitivo: OpenRouter con Zero Data Retention frente a Vertex AI | Subencargados, sección de IA, FAQ | Lopez |
| 4 | Qué campos se envían al modelo en cada conversación y cuáles nunca salen | Sección de IA | Lopez + equipo técnico |
| 5 | Ventana de retención del proveedor de IA y si ZDR queda activo en producción | Sección de IA | Lopez |
| 6 | Si la clínica puede desactivar AURA, CAMILA y LIA conservando agenda, fichas y pagos, y si es autoservicio | Sección de IA | Equipo de producto |
| 7 | Proveedor de voz de CAMILA: nombre, región y retención del audio | Subencargados | Lopez |
| 8 | Pasarela de pago activa. `/privacidad` nombra Stripe, MercadoPago y Webpay/Transbank; `package.json` sólo trae `stripe` | Subencargados | Lopez |
| 9 | Roles y permisos dentro de la clínica: cuáles existen, qué ve cada uno, quién los administra | Infraestructura | Equipo de producto |
| 10 | MFA: si existe hoy en `app.clinera.io`, si es opcional u obligatorio, qué segundo factor admite | Infraestructura | Equipo técnico |
| 11 | Gestión de vulnerabilidades: cadencia de parcheo, escaneo de dependencias, pentest, canal de reporte responsable | Infraestructura | Equipo técnico |
| 12 | Si el agendamiento sin RUT ya está en producción | Minimización | Equipo de producto |
| 13 | Plazo comprometido para notificar un incidente a la clínica, y canal del aviso | Incidentes | Lopez |
| 14 | Publicar el anexo DPA como PDF descargable | Hero y cierre | Lopez |

**Nota sobre los pendientes 9, 10 y 11:** no es que falte confirmarlos, es que
*no existe ninguna mención* a roles, permisos, MFA ni gestión de
vulnerabilidades en todo el repositorio ni en el sitio público. Si la
funcionalidad no existe todavía, la fila se elimina de la tabla en vez de
publicarse; si existe, hay que documentarla.

---

## Lo que sí quedó publicado como verificado

Cada fila confirmada de la página cita su evidencia. No entró nada sin ella.

| Afirmación | De dónde sale |
|---|---|
| AES-256-GCM sobre el 100% del contenido clínico, con envelope encryption | Ya publicado en `/ley20584` |
| Una llave de cifrado por clínica, aislamiento criptográfico entre clínicas | Ya publicado en `/ley20584` |
| Llave maestra en KMS gestionado, IAM mínimo, rotación cada 90 días | Ya publicado en `/ley20584` |
| Registro de quién accede a cada ficha clínica | Ya publicado en `/ley20584` |
| Respaldos automáticos con recuperación punto en el tiempo, ventana de 7 días | Ya publicado en `/ley20584` |
| HSTS 2 años + includeSubDomains + preload, upgrade-insecure-requests | `next.config.ts`, verificable con `curl -sI https://www.clinera.io` |
| CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy | `next.config.ts`, verificable con `curl -sI` |
| Los datos no se usan para entrenar modelos | Ya declarado en `/privacidad` |
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
