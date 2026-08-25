// Fuente única de contenido de /seguridad.
//
// REGLA DURA: en esta página no se publica ningún dato técnico que no esté
// verificado. Todo lo no confirmado se declara acá como `pendiente: true` y se
// renderiza con <Pendiente />, en amarillo, visible para el visitante. Es feo a
// propósito: así nadie publica un dato falso por accidente frente a la Ley
// 21.719. La lista completa de pendientes y sus responsables vive en
// README-seguridad.md.
//
// Cada afirmación confirmada lleva su `evidencia`: de dónde sale y cómo se
// comprueba. Si una fila no puede citar evidencia, no es una fila confirmada.

export const VIGENCIA_LEY = "2026-12-01";
export const ULTIMA_ACTUALIZACION = "24 de agosto de 2026";
export const CONTACTO_PRIVACIDAD = "privacidad@clinera.io";

/* ============================================================
   Resumen (bento de 4 tarjetas)
   ============================================================ */

export type ResumenCard = {
  kicker: string;
  titulo: string;
  cuerpo?: string;
  pendiente?: string;
};

export const RESUMEN: ResumenCard[] = [
  {
    kicker: "Dónde viven",
    titulo: "Infraestructura y región",
    cuerpo:
      "Google Cloud Platform, región Santiago de Chile (southamerica-west1). Los datos clínicos residen en Chile.",
  },
  {
    kicker: "Quién puede verlos",
    titulo: "Registro de acceso a cada ficha",
    cuerpo:
      "Cada apertura de una ficha clínica queda registrada: quién accedió y cuándo. Es la trazabilidad que exige la Ley 20.584 y está activa hoy para todas las clínicas de la plataforma.",
  },
  {
    kicker: "Cuánto los guardamos",
    titulo: "60 días para exportar, después se eliminan",
    cuerpo:
      "Si tu clínica deja Clinera, tienes 60 días para llevarte todo. Al día 60 eliminamos, al día 95 la eliminación llega a los respaldos. No custodiamos tus datos indefinidamente.",
  },
  {
    kicker: "Con quién los compartimos",
    titulo: "Lista cerrada y pública de subencargados",
    cuerpo:
      "Publicamos con nombre a cada tercero que toca datos, para qué se usa y qué datos alcanza. Si un proveedor no está en esa tabla, no recibe datos de tus pacientes.",
  },
];

/* ============================================================
   Infraestructura (tabla densa)
   ============================================================ */

export type ControlRow = {
  control: string;
  implementacion: string;
  evidencia: string;
  pendiente?: string;
};

export const CONTROLES: ControlRow[] = [
  {
    control: "Proveedor de nube",
    implementacion: "Google Cloud Platform.",
    evidencia: "Publicado en /privacidad (actualización 2026-08).",
  },
  {
    control: "Región de los datos",
    implementacion:
      "southamerica-west1 (Santiago de Chile). Sin salida del país para los datos clínicos en reposo.",
    evidencia: "Publicado en /privacidad (actualización 2026-08).",
  },
  {
    control: "Cifrado en reposo",
    implementacion:
      "AES-256-GCM sobre el 100% del contenido clínico, con envelope encryption. Un volcado de la base de datos entrega texto ilegible.",
    evidencia: "Publicado en /ley20584",
  },
  {
    control: "Aislamiento entre clínicas",
    implementacion:
      "Una llave de cifrado por clínica. Los datos de una clínica no se pueden descifrar con la llave de otra.",
    evidencia: "Publicado en /ley20584",
  },
  {
    control: "Custodia de llaves",
    implementacion:
      "La llave maestra vive en un servicio gestionado de custodia (KMS), con acceso IAM mínimo y rotación cada 90 días. Nunca se expone en la aplicación.",
    evidencia: "Publicado en /ley20584",
  },
  {
    control: "Cifrado en tránsito",
    implementacion:
      "HTTPS obligatorio con HSTS de 2 años, includeSubDomains y preload, más upgrade-insecure-requests. El sitio no acepta tráfico en claro.",
    evidencia: "Verificable: curl -sI https://www.clinera.io",
  },
  {
    control: "Cabeceras de seguridad",
    implementacion:
      "Content-Security-Policy con allowlist explícita de terceros, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin y Permissions-Policy que apaga cámara, micrófono y geolocalización.",
    evidencia: "Verificable: curl -sI https://www.clinera.io",
  },
  {
    control: "Registro de auditoría",
    implementacion:
      "Registro de quién accede a cada ficha clínica y cuándo, en línea con la Ley 20.584.",
    evidencia: "Publicado en /ley20584",
  },
  {
    control: "Respaldos",
    implementacion:
      "Respaldos automáticos con recuperación a un punto en el tiempo dentro de una ventana de 7 días.",
    evidencia: "Publicado en /ley20584",
  },
  {
    control: "Control de acceso por roles",
    implementacion: "",
    evidencia: "",
    pendiente:
      "Qué roles existen dentro de la clínica, qué puede ver cada uno y quién los administra. No hay ninguna descripción de roles ni de permisos en la documentación pública actual.",
  },
  {
    control: "Autenticación multifactor (MFA)",
    implementacion:
      "En despliegue: disponible para todas las clínicas la primera semana de septiembre de 2026.",
    evidencia:
      "Compromiso publicado el 2026-08-24; esta fila se actualizará a 'activo' al completar el despliegue.",
  },
  {
    control: "Gestión de vulnerabilidades",
    implementacion: "",
    evidencia: "",
    pendiente:
      "Cadencia de parcheo, escaneo de dependencias, pruebas de penetración y canal de reporte responsable de vulnerabilidades.",
  },
];

/* ============================================================
   Subencargados
   ============================================================ */

export type Subencargado = {
  nombre: string;
  proposito: string;
  datos: string;
  ubicacion: string;
  contrato: string;
  pendiente?: string;
};

export const SUBENCARGADOS: Subencargado[] = [
  {
    nombre: "Meta Platforms — WhatsApp Business",
    proposito:
      "Transporte de los mensajes entre el paciente y la clínica. Es el canal por el que AURA conversa.",
    datos:
      "Número de teléfono del paciente y contenido de los mensajes que el propio paciente envía por WhatsApp.",
    ubicacion: "Infraestructura global de Meta",
    contrato:
      "La clínica contrata directamente con Meta. Clinera actúa como Tech Provider sobre la cuenta de la clínica.",
  },
  {
    nombre: "Google Cloud Platform",
    proposito: "Alojamiento de la base de datos, la aplicación y los respaldos.",
    datos:
      "Fichas clínicas, agenda, pacientes, historial de conversaciones y respaldos cifrados.",
    ubicacion: "Región Santiago de Chile (southamerica-west1)",
    contrato:
      "Contrato de tratamiento con Google Cloud; datos clínicos en reposo sin salida de Chile.",
  },
  {
    nombre: "Google Cloud Platform — Vertex AI",
    proposito:
      "Procesamiento del texto de las conversaciones para que AURA entienda y responda (GLM 5.2 y Gemini Flash 3.7).",
    datos:
      "Texto de las conversaciones y el contexto operativo necesario para que el agente ejecute (sin usar esos datos para entrenar modelos fundacionales).",
    ubicacion: "Perímetro de Google Cloud (Vertex AI)",
    contrato:
      "Inferencia en Vertex AI desde el 01-08-2026. Compromiso contractual de Google Cloud: los datos de clientes no entrenan los modelos fundacionales.",
  },
  {
    nombre: "Proveedor de voz (CAMILA)",
    proposito: "Síntesis y transcripción de las llamadas telefónicas.",
    datos: "",
    ubicacion: "",
    contrato: "",
    pendiente:
      "Proveedor de voz, región de procesamiento y retención del audio. La fila sólo se publica cuando el contrato con el proveedor de voz esté firmado y documentado.",
  },
  {
    nombre: "Pasarela de pago",
    proposito: "Cobro de la suscripción de la clínica a Clinera.",
    datos: "",
    ubicacion: "",
    contrato: "",
    pendiente:
      "Pasarela definitiva. La política de privacidad nombra hoy Stripe, MercadoPago y Webpay/Transbank. Hay que confirmar cuáles están activas y si alguna toca datos de pacientes o sólo datos de facturación de la clínica.",
  },
];

/* ============================================================
   Retención: qué pasa si la clínica se va
   ============================================================ */

export type HitoRetencion = {
  dia: string;
  titulo: string;
  detalle: string;
};

export const RETENCION: HitoRetencion[] = [
  {
    dia: "Día 0",
    titulo: "Congelamiento",
    detalle:
      "Los agentes dejan de operar y la cuenta pasa a sólo lectura. Nada se borra todavía. Te avisamos por correo que empezó la ventana de exportación.",
  },
  {
    dia: "Día 0 a 60",
    titulo: "Ventana de exportación",
    detalle:
      "Puedes exportar fichas clínicas, pacientes, agenda e historial. Enviamos tres avisos: al día 0, al día 30 y al día 55.",
  },
  {
    dia: "Día 60",
    titulo: "Eliminación certificada",
    detalle:
      "Se eliminan los datos de producción y te entregamos el certificado de eliminación por escrito.",
  },
  {
    dia: "Día 95",
    titulo: "Purga de respaldos",
    detalle:
      "La eliminación alcanza a los respaldos y la información deja de existir en nuestros sistemas.",
  },
];

/* ============================================================
   Derechos del titular
   ============================================================ */

export const DERECHOS: Array<{ nombre: string; que: string }> = [
  {
    nombre: "Acceso",
    que: "Saber qué datos suyos existen y de dónde salieron.",
  },
  {
    nombre: "Rectificación",
    que: "Corregir un dato incompleto, inexacto o desactualizado.",
  },
  {
    nombre: "Supresión",
    que: "Pedir que se eliminen, cuando no exista un deber legal de conservarlos.",
  },
  {
    nombre: "Oposición",
    que: "Oponerse a un tratamiento determinado de sus datos.",
  },
  {
    nombre: "Portabilidad",
    que: "Llevarse sus datos en un formato estructurado y de uso común.",
  },
];

/* ============================================================
   FAQ — sólo entran acá preguntas con respuesta confirmada.
   Las que dependen de un <Pendiente> se responden en la página con el
   pendiente a la vista, no en este arreglo, porque este arreglo alimenta
   el JSON-LD de FAQPage y no puede publicar datos sin confirmar.
   ============================================================ */

export type FaqItem = { q: string; a: string; pendiente?: string };

export const SEGURIDAD_FAQ: FaqItem[] = [
  {
    q: "¿Ofrecen contrato de encargo de tratamiento?",
    a: "Sí. El anexo de tratamiento de datos formaliza que tu clínica es la responsable y Clinera la encargada, y fija qué podemos hacer con los datos, con qué subencargados, por cuánto tiempo y qué pasa al terminar el contrato. Se firma como anexo del contrato de servicio. Puedes pedirlo escribiendo a privacidad@clinera.io antes de contratar: está pensado para que lo revise tu abogado.",
  },
  {
    q: "¿Qué pasa con mis fichas si dejo de usar Clinera?",
    a: "Tienes 60 días para exportarlas, con avisos al día 0, 30 y 55. Al día 60 eliminamos los datos de producción y te entregamos un certificado de eliminación. Al día 95 la eliminación alcanza a los respaldos. La obligación de conservar la ficha clínica por 15 años es de tu clínica como prestador de salud, así que te devolvemos los datos para que puedas cumplirla.",
  },
  {
    q: "¿Cuánto tiempo debo conservar la ficha clínica?",
    a: "Quince años. Lo fija el artículo 11 del Decreto 41 de 2012 y la obligación recae en el prestador de salud, es decir tu clínica, no en el software que uses. Por eso Clinera está diseñado para devolverte la ficha completa y luego eliminarla de sus sistemas, en vez de custodiarla por su cuenta de forma indefinida.",
  },
  {
    q: "¿Quién responde si hay una filtración?",
    a: "Depende de dónde ocurra. Tu clínica es la responsable del tratamiento frente al paciente y frente a la Agencia. Clinera es la encargada: si el incidente ocurre en nuestra infraestructura, tenemos que detectarlo, contenerlo y avisarte con lo que necesitas para notificar. Si el incidente ocurre dentro de la clínica, por ejemplo una credencial compartida, el registro de auditoría permite reconstruir qué se accedió y cuándo.",
  },
  {
    q: "¿Puedo auditarlos?",
    a: "Sí. Respondemos cuestionarios de seguridad de tu abogado o de tu asesor informático, y te entregamos la documentación técnica al activar el plan. Escribe a privacidad@clinera.io con el cuestionario que uses.",
  },
  {
    q: "¿Mi clínica pierde su número de WhatsApp si deja Clinera?",
    a: "No. La cuenta de WhatsApp Business es de tu clínica: se crea a tu nombre mediante Meta Embedded Signup y el vínculo contractual es entre tu clínica y Meta. Clinera figura como Tech Provider sobre esa cuenta. Si te vas, conservas el número y el historial, y basta con desvincularnos como proveedor.",
  },
  {
    q: "¿Dónde están alojados los datos?",
    a: "En Google Cloud Platform, región Santiago de Chile (southamerica-west1). Los datos clínicos residen en Chile, cifrados en tránsito y en reposo, alineados a la Ley 19.628 y la Ley 21.719.",
  },
  {
    q: "¿Los datos de mis pacientes entrenan modelos de IA?",
    a: "No. Desde el 1 de agosto de 2026 la inferencia corre en Vertex AI (Google Cloud). El compromiso contractual de Google Cloud establece que los datos de los clientes no se usan para entrenar los modelos fundacionales.",
  },
];

// Preguntas cuya respuesta honesta hoy es "todavía no está confirmado".
// Se muestran en el acordeón con el pendiente visible y quedan FUERA del
// JSON-LD, para no publicar datos sin confirmar en datos estructurados.
export const SEGURIDAD_FAQ_PENDIENTE: FaqItem[] = [
  {
    q: "¿Puedo agendar sin pedir el RUT?",
    a: "",
    pendiente:
      "Si el agendamiento con sólo nombre y apellidos, dejando el RUT para la llegada del paciente, ya está implementado en producción. Si todavía no lo está, esta pregunta se elimina de la página en vez de prometerse.",
  },
];
