// ===========================================================================
// Banco de pruebas de la escalera SQL / SQL+ del nodo "Validar SQL".
//
// Carga el jsCode REAL desde crm-sql-twenty.workflow.json y lo corre con los
// mismos stubs que le da n8n ($json, $getWorkflowStaticData, $env). Si alguien
// edita el nodo en el JSON, esta batería lo prueba sin tener que importar el
// workflow ni mandarle un evento a Meta.
//
//   node tests/n8n/crm-sql-escalera.check.js
// ===========================================================================
const fs = require('fs');
const path = require('path');

const WF = path.join(__dirname, '..', '..', 'integrations', 'n8n', 'crm-sql-twenty.workflow.json');
const jsCode = JSON.parse(fs.readFileSync(WF, 'utf8'))
  .nodes.find((n) => n.name === 'Validar SQL').parameters.jsCode;

// n8n envuelve el código del nodo en una función async, por eso el `await` de
// la búsqueda del contacto es legal ahí y no lo sería en un script suelto.
// `require` va como parámetro: new Function no hereda el scope del módulo, y el
// nodo usa require('crypto') para hashear.
const ejecutar = new Function(
  'require', '$json', '$getWorkflowStaticData', '$env',
  'return (async function () {\n' + jsCode + '\n}).call({ helpers: { httpRequest: async () => ({}) } });',
).bind(null, require);

// --- utilidades ------------------------------------------------------------
function webhook(stage, recordId, extra) {
  return Object.assign({
    body: {
      eventName: 'opportunity.updated',
      objectMetadata: { nameSingular: 'opportunity' },
      updatedFields: ['stage'],
      record: {
        id: recordId,
        stage: stage,
        updatedBy: { source: 'MANUAL' },
        pointOfContactId: '',
        emails: { primaryEmail: 'closer.test@clinica.cl' },
        phones: { primaryPhoneNumber: '912345678', primaryPhoneCallingCode: '+56' },
      },
    },
    headers: { 'user-agent': 'test' },
  }, extra || {});
}

let fallos = 0;
function chequear(titulo, real, esperado) {
  const ok = JSON.stringify(real) === JSON.stringify(esperado);
  if (!ok) fallos++;
  console.log((ok ? '  ok   ' : '  FALLA') + '  ' + titulo +
    (ok ? '' : '\n         esperado ' + JSON.stringify(esperado) + '\n         real     ' + JSON.stringify(real)));
}

// Cada escenario arranca con su propio estado estático, como un workflow limpio.
function corrida(estadoInicial) {
  const estado = { sql: Object.assign({}, estadoInicial || {}) };
  return {
    estado,
    async mover(stage, recordId) {
      const r = await ejecutar(webhook(stage, recordId), () => estado, {});
      return r[0].json;
    },
  };
}

(async function () {
  console.log('\nEscalera SQL (US$100) / SQL+ (US$300) — nodo "Validar SQL"\n');

  // 1) El camino normal: el closer sube el negocio peldaño por peldaño.
  {
    const c = corrida();
    const sql = await c.mover('MEETING', 'neg-1');
    const plus = await c.mover('PROPOSAL', 'neg-1');
    chequear('SQL manda US$100', [sql.ok, sql.value, sql.escalon], [true, 100, 'sql']);
    chequear('SQL+ manda el delta de US$200', [plus.ok, plus.value, plus.escalon], [true, 200, 'sql_plus']);
    chequear('el lead suma US$300 en total', sql.value + plus.value, 300);
    chequear('cada peldaño lleva su propio event_id',
      [sql.event_id, plus.event_id], ['sql_neg-1', 'sqlplus_neg-1']);
  }

  // 2) El closer salta directo de MQL a SQL+: mismo total, un solo evento.
  {
    const c = corrida();
    const plus = await c.mover('PROPOSAL', 'neg-2');
    chequear('salto directo a SQL+ manda los US$300 completos',
      [plus.ok, plus.value], [true, 300]);
  }

  // 3) Volver a tocar el mismo peldaño no vuelve a cobrar.
  {
    const c = corrida();
    await c.mover('MEETING', 'neg-3');
    const otra = await c.mover('MEETING', 'neg-3');
    chequear('repetir SQL responde sql_ya_enviado', [otra.ok, otra.motivo], [false, 'sql_ya_enviado']);
  }

  // 4) La escalera no baja: un retroceso en el tablero no cobra de nuevo.
  {
    const c = corrida();
    await c.mover('PROPOSAL', 'neg-4');
    const bajada = await c.mover('MEETING', 'neg-4');
    chequear('bajar de SQL+ a SQL no manda nada',
      [bajada.ok, bajada.motivo], [false, 'escalon_ya_superado']);
  }

  // 5) Migración de la clave vieja (negocio pelado, sin peldaño). Ese negocio
  //    YA mandó su SQL antes del cambio: su salto a SQL+ debe cobrar 200.
  {
    const c = corrida({ 'neg-5': Date.now() });
    const plus = await c.mover('PROPOSAL', 'neg-5');
    chequear('un SQL viejo hace que el SQL+ cobre el delta, no los 300',
      [plus.ok, plus.value], [true, 200]);
    chequear('la clave vieja quedó renombrada a <negocio>:sql',
      [Object.prototype.hasOwnProperty.call(c.estado.sql, 'neg-5'), c.estado.sql['neg-5:sql'] > 0],
      [false, true]);
  }
  {
    const c = corrida({ 'neg-6': Date.now() });
    const otra = await c.mover('MEETING', 'neg-6');
    chequear('un SQL viejo tampoco se puede reenviar como SQL',
      [otra.ok, otra.motivo], [false, 'sql_ya_enviado']);
  }

  // 6) Los filtros que ya existían siguen en pie.
  {
    const c = corrida();
    const auto = await ejecutar(
      webhook('PROPOSAL', 'neg-7', { body: Object.assign(webhook('PROPOSAL', 'neg-7').body, {
        record: Object.assign(webhook('PROPOSAL', 'neg-7').body.record, { updatedBy: { source: 'API' } }),
      }) }), () => c.estado, {});
    chequear('una automatización no genera SQL+',
      [auto[0].json.ok, auto[0].json.motivo], [false, 'etapa_movida_por_automatizacion']);

    const nql = await c.mover('NQL', 'neg-8');
    chequear('una etapa fuera de la escalera no manda nada',
      [nql.ok, nql.motivo], [false, 'etapa_no_sql']);

    const cliente = await c.mover('CUSTOMER', 'neg-9');
    chequear('Contrata (CUSTOMER) sigue fuera de la escalera',
      [cliente.ok, cliente.motivo], [false, 'etapa_no_sql']);
  }

  // 7) GA4 espeja el mismo valor y distingue el peldaño.
  {
    const c = corrida();
    await c.mover('MEETING', 'neg-10');
    const plus = await c.mover('PROPOSAL', 'neg-10');
    const p = plus.ga4Body.events[0].params;
    chequear('GA4 manda el mismo delta que Meta', [p.value, p.items[0].price], [200, 200]);
    chequear('GA4 identifica el peldaño',
      [p.crm_escalon, p.items[0].item_id], ['sql_plus', 'clinera_sql_plus_calificado']);
  }

  console.log('\n' + (fallos ? fallos + ' CHEQUEO(S) EN ROJO\n' : 'todo en verde\n'));
  process.exit(fallos ? 1 : 0);
})();
