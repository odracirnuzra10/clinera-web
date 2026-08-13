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

### Contrato con el sitio

`src/components/ventas/VentasLanding.tsx` (constantes `N8N_AGENDA_*`) asume
las tres rutas de arriba. Si se renombran los paths de los webhooks hay que
actualizar esas constantes.
