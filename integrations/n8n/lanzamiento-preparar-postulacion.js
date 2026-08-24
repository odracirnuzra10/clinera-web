// Nodo Code «Preparar postulación» — workflow Clinera · Lanzamiento Los Ángeles.
// Normaliza el POST de /lanzamiento y rechaza lo mínimo antes de tocar CRM.
//
// Modo: Run Once for All Items.

const wh = $input.first().json || {};
const body = wh.body || wh;

const trim = (v) => String(v == null ? '' : v).trim();
const email = trim(body.email).toLowerCase();

if (!email || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
  return [{ json: { ok: false, motivo: 'email_invalido' } }];
}

const nombre = trim(body.nombre);
if (nombre.length < 3 || !nombre.includes(' ')) {
  return [{ json: { ok: false, motivo: 'nombre_invalido' } }];
}

const clinica = trim(body.clinica);
if (clinica.length < 2) {
  return [{ json: { ok: false, motivo: 'clinica_invalida' } }];
}

const whatsapp = String(body.whatsapp || '').replace(/\D/g, '');
if (whatsapp.length < 10) {
  return [{ json: { ok: false, motivo: 'whatsapp_invalido' } }];
}

const partes = nombre.split(/\s+/).filter(Boolean);
const firstName = partes[0] || 'Lead';
const lastName = partes.slice(1).join(' ') || '';

const PREFIJO = {
  '+56': 'CL', '+52': 'MX', '+54': 'AR', '+57': 'CO', '+51': 'PE',
  '+593': 'EC', '+591': 'BO', '+595': 'PY', '+598': 'UY', '+1': 'US', '+34': 'ES',
};
const codigoPais = trim(body.codigo_pais || '+56');
const country = PREFIJO[codigoPais] || 'CL';

const linea = (etiqueta, valor) => (valor ? `*${etiqueta}:* ${valor}\n` : '');

const textoChat =
  '🎟️ *Nuevo invitado interesado en asistir al lanzamiento*\n\n' +
  linea('Nombre', nombre) +
  linea('Clínica', clinica) +
  linea('Especialidad', trim(body.especialidad)) +
  linea('WhatsApp', trim(body.whatsapp)) +
  linea('Email', email) +
  linea('Perfil', trim(body.perfil)) +
  linea('Evento', 'Cena de lanzamiento IA · Los Ángeles · 11 sep 2026, 19:00') +
  '\n_Confirmar cupo por WhatsApp en menos de 24 hrs. No queda confirmado en la visita._';

return [{
  json: {
    ok: true,
    evento: trim(body.evento) || 'lanzamiento-los-angeles',
    fechaEvento: trim(body.fecha_evento),
    nombre,
    firstName,
    lastName,
    clinica,
    especialidad: trim(body.especialidad),
    whatsapp: trim(body.whatsapp),
    whatsappDigitos: whatsapp,
    codigoPais,
    country,
    email,
    perfil: trim(body.perfil),
    origen: trim(body.origen) || 'https://clinera.io/lanzamiento',
    enviadoEn: trim(body.enviado_en) || new Date().toISOString(),
    textoChat,
  },
}];
