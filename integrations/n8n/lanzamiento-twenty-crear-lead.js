// Nodo Code «Twenty - Crear Lead» — workflow Clinera · Lanzamiento Los Ángeles.
// Crea o refresca persona + clínica + negocio en crm.oacg.cl con la etiqueta
// «lanzamiento los angeles». Dueño del negocio: Jorge Cheul (terreno LA).
//
// Modo: Run Once for All Items. Errores: Continue.

const KEY = $env.TWENTY_API_KEY;
const BASE = 'https://crm.oacg.cl';
const ETIQUETA = 'LANZAMIENTO_LOS_ANGELES';
const JORGE_CHEUL = '11b36cc3-b943-4499-8982-e2d16e2801a2';

if (!KEY) {
  throw new Error('Falta TWENTY_API_KEY en el entorno de n8n');
}

const api = async (method, path, body) => {
  return await this.helpers.httpRequest({
    method,
    url: BASE + path,
    headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
    body,
    json: true,
    timeout: 15000,
  });
};

const primero = (resp, objeto) => {
  const arr = (resp && resp.data && resp.data[objeto]) || [];
  return arr.length ? arr[0] : null;
};

const crear = (resp) => {
  const d = (resp && resp.data) || {};
  const v = Object.values(d)[0];
  return v && v.id ? v.id : null;
};

const PREFIJO = {
  CL: '+56', MX: '+52', AR: '+54', CO: '+57', PE: '+51', VE: '+58', EC: '+593',
  BO: '+591', PY: '+595', UY: '+598', CR: '+506', PA: '+507', GT: '+502',
  SV: '+503', HN: '+504', NI: '+505', ES: '+34', US: '+1', BR: '+55',
};

const PAIS_TWENTY = {
  CL: 'CHILE', MX: 'MEXICO', PE: 'PERU', CO: 'COLOMBIA', PA: 'PANAMA',
  CR: 'COSTA_RICA', AR: 'ARGENTINA', EC: 'ECUADOR', PY: 'PARAGUAY', ES: 'ESPANA',
};

const d = $('Preparar postulación').first().json;
const resultado = { twenty: {} };

try {
  let companyId = null;
  if (d.clinica) {
    const nombre = String(d.clinica).trim();
    const hallada = primero(
      await api('GET', `/rest/companies?filter=name%5Beq%5D:${encodeURIComponent(nombre)}&limit=1`),
      'companies',
    );
    companyId = hallada
      ? hallada.id
      : crear(await api('POST', '/rest/companies?disableDuplicateCheck=true', { name: nombre }));
    resultado.twenty.companyId = companyId;
    resultado.twenty.companyNueva = !hallada;
  }

  let personId = null;
  const email = String(d.email || '').trim().toLowerCase();
  if (email) {
    const hallada = primero(
      await api('GET', `/rest/people?filter=emails.primaryEmail%5Beq%5D:${encodeURIComponent(email)}&limit=1`),
      'people',
    );
    if (hallada) {
      personId = hallada.id;
      resultado.twenty.personaExistia = true;
    }
  }

  if (!personId) {
    const persona = {
      name: { firstName: d.firstName || d.nombre || 'Lead', lastName: d.lastName || '' },
    };
    if (email) persona.emails = { primaryEmail: email };
    const bruto = String(d.whatsappDigitos || d.whatsapp || '').replace(/\D/g, '');
    if (bruto) {
      const cc = PREFIJO[d.country] || d.codigoPais || '+56';
      const nacional = cc && bruto.startsWith(cc.slice(1))
        ? bruto.slice(cc.length - 1)
        : bruto;
      persona.phones = { primaryPhoneCallingCode: cc, primaryPhoneNumber: nacional };
    }
    if (companyId) persona.companyId = companyId;
    try {
      personId = crear(await api('POST', '/rest/people?disableDuplicateCheck=true', persona));
    } catch (e) {
      delete persona.phones;
      personId = crear(await api('POST', '/rest/people?disableDuplicateCheck=true', persona));
      resultado.twenty.sinTelefono = true;
    }
    resultado.twenty.personaNueva = true;
  }
  resultado.twenty.personId = personId;

  const linea = (etiqueta, valor) => (valor ? `- **${etiqueta}:** ${valor}\n` : '');
  const cuerpo =
    `**Postulación · Lanzamiento Los Ángeles** · ${new Date().toISOString().slice(0, 10)}\n` +
    linea('Nombre', d.nombre) +
    linea('Clínica', d.clinica) +
    linea('Especialidad', d.especialidad) +
    linea('WhatsApp', d.whatsapp) +
    linea('Email', d.email) +
    linea('Perfil', d.perfil) +
    linea('Fecha evento', d.fechaEvento) +
    linea('Origen', d.origen) +
    linea('Enviado', d.enviadoEn) +
    '\n_Confirmar asistencia por WhatsApp. El cupo no queda confirmado al postular._';

  const noteId = crear(
    await api('POST', '/rest/notes?disableDuplicateCheck=true', {
      title: '🎟️ Postulación · Lanzamiento Los Ángeles',
      bodyV2: { markdown: cuerpo },
    }),
  );
  resultado.twenty.noteId = noteId;

  if (noteId && personId) {
    await api('POST', '/rest/noteTargets?disableDuplicateCheck=true', {
      noteId,
      targetPersonId: personId,
    });
  }
  if (noteId && companyId) {
    await api('POST', '/rest/noteTargets?disableDuplicateCheck=true', {
      noteId,
      targetCompanyId: companyId,
    });
  }

  const demoIso = (() => {
    const raw = String(d.fechaEvento || '');
    if (!raw) return null;
    const dt = new Date(raw);
    return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
  })();

  const etiquetasActuales = (opp) => {
    const raw = opp && opp.etiquetas;
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === 'string' && raw) return [raw];
    return [];
  };

  if (personId) {
    const abierta = primero(
      await api('GET', `/rest/opportunities?filter=pointOfContactId%5Beq%5D:${personId}&limit=1`),
      'opportunities',
    );

    if (abierta) {
      const tags = new Set(etiquetasActuales(abierta));
      tags.add(ETIQUETA);
      const refresco = {
        ultimoContacto: new Date().toISOString(),
        canalOrigen: 'ORGANICO',
        etiquetas: [...tags],
        ownerId: JORGE_CHEUL,
      };
      if (demoIso) refresco.fechaDemo = demoIso;
      await api('PATCH', `/rest/opportunities/${abierta.id}`, refresco);
      resultado.twenty.opportunityId = abierta.id;
      resultado.twenty.opportunityExistia = true;
      resultado.twenty.opportunityRefrescada = true;
      resultado.twenty.crmUrl = `${BASE}/object/opportunity/${abierta.id}`;
    } else {
      const finDeMes = new Date();
      finDeMes.setUTCMonth(finDeMes.getUTCMonth() + 1, 0);
      const negocio = {
        name: `${d.clinica || d.nombre} · Lanzamiento LA`,
        stage: 'NEW',
        amount: { amountMicros: 279000000, currencyCode: 'USD' },
        planClinera: 'VORTEX',
        closeDate: finDeMes.toISOString().slice(0, 10) + 'T12:00:00.000Z',
        pointOfContactId: personId,
        ultimoContacto: new Date().toISOString(),
        canalOrigen: 'ORGANICO',
        etiquetas: [ETIQUETA],
        ownerId: JORGE_CHEUL,
      };
      const paisTwenty = PAIS_TWENTY[d.country];
      if (paisTwenty) negocio.pais = paisTwenty;
      if (companyId) negocio.companyId = companyId;
      if (demoIso) negocio.fechaDemo = demoIso;
      const oppId = crear(
        await api('POST', '/rest/opportunities?disableDuplicateCheck=true', negocio),
      );
      resultado.twenty.opportunityId = oppId;
      resultado.twenty.opportunityNueva = true;
      resultado.twenty.crmUrl = oppId ? `${BASE}/object/opportunity/${oppId}` : '';
    }
  }

  resultado.twenty.ok = true;
} catch (e) {
  resultado.twenty.ok = false;
  resultado.twenty.error = String(e.message || e).slice(0, 300);
}

const textoChatFinal = d.textoChat + (
  resultado.twenty.crmUrl ? `\n\nVer en CRM: ${resultado.twenty.crmUrl}` : ''
);

return [{ json: { ...d, ...resultado, textoChat: textoChatFinal } }];
