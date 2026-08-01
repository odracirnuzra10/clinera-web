# Firma — sistema de firma electrónica simple

`/firma` es la herramienta interna con la que el equipo comercial envía a
firma las cotizaciones generadas en `/cotizacion`. El flujo completo:

1. El closer descarga la cotización como PDF desde `/cotizacion`
   ("Imprimir / guardar PDF").
2. Entra a `/firma` con la clave del equipo, sube ese PDF y completa los
   datos del cliente. **La firma por Clinera es siempre la del CEO
   (Ricardo Oyarzún, representante legal)** y se estampa server-side desde
   `src/lib/firma/firma-ceo.ts`; el closer queda registrado como gestor.
3. Comparte el enlace `/firma/<id>` con el cliente (copiar o WhatsApp).
4. El cliente abre el enlace, revisa el documento, confirma sus datos,
   dibuja su firma y acepta la declaración de firma electrónica simple.
5. El sistema genera el **PDF final**: el original + un pie de verificación
   en cada página + una "Hoja de firmas electrónicas" con ambas firmas
   manuscritas, la evidencia (nombre, email, RUT opcional, fecha/hora
   America/Santiago, IP, dispositivo) y los hashes SHA-256.
6. Ambas partes descargan el documento firmado desde la misma página, que
   además queda como página de verificación permanente del folio.

Es **firma electrónica simple** (Ley N.º 19.799): la validez viene del
consentimiento + la evidencia registrada, no de un certificado avanzado.

La hoja de firmas identifica a la entidad legal al pie: **OACG INC**,
sociedad de Delaware (EE. UU.), EIN 37-2195696 — es quien opera Clinera y
la parte contratante.

## Configuración (variables de entorno)

| Variable | Qué es |
| --- | --- |
| `FIRMA_ACCESS_KEY` | Clave compartida del equipo comercial. Se pide al entrar a `/firma` y viaja en el header `x-firma-clave`; se valida siempre server-side. |
| `BLOB_READ_WRITE_TOKEN` | La inyecta Vercel automáticamente al conectar un **Blob store** al proyecto. Debe ser un store con `access: private`. |
| `STRIPE_SECRET_KEY` | Habilita el pago post-firma. Usar una **clave restringida** (Dashboard → Developers → API keys → Create restricted key) con Write en: Checkout Sessions, Customers, Products, Prices y Coupons. Sin esta variable, la firma funciona igual y el botón de pago avisa que aún no está habilitado. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Habilitan "Continuar con Google" en `/firma`, restringido a cuentas `@oacg.cl` (el dominio se valida server-side; la sesión es una cookie httpOnly firmada con HMAC usando `FIRMA_ACCESS_KEY`, 12 h). Crear en Google Cloud Console → APIs & Services → Credentials → OAuth client ID (Web) con redirect URI `https://www.clinera.io/api/firma/auth/google/callback`. Sin estas variables, el login con clave sigue funcionando igual. |

Sin cualquiera de las dos, los endpoints responden `503` con un mensaje
claro (mismo criterio que `/api/triage`: error visible > herramienta rota
en silencio).

## Almacenamiento

No hay base de datos. Cada solicitud ("sobre") vive en Vercel Blob como
blobs **privados** — nunca hay URL pública del documento; todo se sirve a
través de las rutas API del mismo dominio:

```
firma/<id>/original.pdf   PDF subido por el closer
firma/<id>/meta.json      estado + evidencia de firmas (SobreMeta)
firma/<id>/firmado.pdf    PDF final con hoja de firmas
```

El `<id>` son 32 hex generados con `crypto.randomBytes` y funcionan como
capability URL: quien tiene el enlace puede ver y firmar ese documento
(equivalente a "cualquiera con el enlace" de Drive). No se listan, no se
indexan (robots) y no se pueden adivinar.

## Endpoints

| Método y ruta | Auth | Qué hace |
| --- | --- | --- |
| `POST /api/firma/auth` | — | Valida la clave del equipo (rate limit 10/min por IP). |
| `POST /api/firma` | clave | Crea el sobre: PDF (≤ 4 MB, se valida con pdf-lib) + datos + firma del closer. Devuelve `{ id, url }`. |
| `GET /api/firma` | clave | Lista los sobres más recientes para el panel. |
| `GET /api/firma/[id]` | enlace | Estado público del sobre (sin IPs ni imágenes de firma). |
| `POST /api/firma/[id]` | enlace | Registra la firma del cliente y genera el PDF final. `409` si ya estaba firmado. |
| `DELETE /api/firma/[id]` | clave | Anula un sobre **pendiente** (borra sus blobs). Los firmados no se eliminan: son el respaldo del acuerdo. |
| `GET /api/firma/[id]/pdf` | enlace | Sirve el PDF (`?version=original\|firmado`, `&descargar=1`). Same-origin para pasar el CSP del visor. |
| `GET /api/firma/[id]/pago` | enlace | Crea una Checkout Session de Stripe on-demand (expiran a las 24 h) y redirige. Solo sobres **firmados** con cotización asociada; los errores vuelven a `/firma/<id>?pago=<código>`. |

Todos los endpoints públicos llevan rate limit en memoria por IP (mismo
patrón que `/api/triage`) y `Cache-Control: no-store`.

## Pago post-firma (Stripe)

El botón **"Enviar a firma"** de `/cotizacion` traspasa la _configuración_
de la cotización (plan, modalidad, extras, % de descuento) por
sessionStorage; `/firma` la adjunta al crear el sobre y el servidor
**recalcula todos los montos contra `src/content/pricing`**
(`src/lib/firma/cotizacion.ts`) — nunca se confía en montos del navegador.

Al firmar, la página de éxito muestra "Continuar al pago": una Checkout
Session en modo suscripción con los ítems a precio de lista y un **cupón
por el monto exacto del descuento por período**, con la duración que
eligió el closer:

- *Solo el primer pago* → cupón `once` (en semestral cubre el primer semestre).
- *Por N meses* → cupón `repeating` (en semestral usar múltiplos de 6).
- *Para siempre* → cupón `forever` (personalización perpetua).

Así la personalización temporal expira sola y la suscripción vuelve a
precio de lista sin intervención. La configuración inicial va como cobro
único en el primer pago, ya con su descuento aplicado. El closer también
puede copiar el link de pago desde su panel una vez firmado el sobre.

## Decisiones

- **pdf-lib** para estampar: puro JS, corre en serverless sin binarios.
  La hoja de firmas se agrega al final del PDF original; además cada
  página original recibe un pie con folio + URL de verificación.
- **El closer firma al crear** el sobre; el PDF final se genera una sola
  vez, cuando firma el cliente (una única operación de estampado con las
  dos firmas).
- **Sin correo transaccional**: el closer comparte el enlace por WhatsApp
  o el canal que ya usa con ese cliente. Si más adelante se quiere email
  automático, el hook natural es un webhook n8n al crear/firmar el sobre.
- Límite de subida **4 MB**: las funciones de Vercel cortan el body en
  4.5 MB. La cotización exportada desde `/cotizacion` pesa muy por debajo.

## Pendientes / ideas futuras

- Webhook n8n al firmar (aviso al closer por WhatsApp/Slack + registro en
  Monday).
- Recordatorio automático si el sobre lleva N días pendiente.
- Multi-firmante (más de una persona por el lado cliente).
