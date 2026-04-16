/* ======================================================
   CÓDIGO ÚNICO: IA GEMINI (AUTO-DESCUBRIMIENTO) + REPORTES
   ====================================================== */

// 1. CONFIGURACIÓN (TUS LLAVES YA INTEGRADAS)
const OPENROUTER_API_KEY = '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';
const SHEET_ID = '1o5OCjmfbP26Yrhpj6Qt92zjmWVSu4FDmqWDu0nd7qpE';
const DRIVE_FOLDER_ID = '12Y-bBBRHYyO79tdzRNKpt3vA5X0IXwKA';
const SECURITY_TOKEN = "Clinera_Internal_Secure_Key_2026";

/* 2. TU MANUAL */
const MANUAL_CONTEXTO = `
MANUAL MAESTRO INTEGRAL: OPERACIÓN Y CONFIGURACIÓN DE CLINERA.IO

Este documento es la base de conocimiento definitiva que contiene cada clic y proceso del sistema.
1. ONBOARDING Y CONFIGURACIÓN ESTRUCTURAL
1.1 Registro de Cuenta y Creación de Clínica

    Registro Inicial: Ingresa a https://app.clinera.io/auth/login y haz clic en “Registrarte”.

    Formulario: Completa el registro, presiona “Crear cuenta” y revisa el correo de bienvenida para obtener tus credenciales.

    Crear Clínica: Dentro del sistema, presiona “Crear clínica”, elige un plan de suscripción y completa el nombre, descripción, dirección y logo (opcional).

    Acceso y Cambio de Clínica: Confirma la creación y accede al panel. Para cambiar entre clínicas, haz clic en el ícono superior izquierdo (donde aparece el nombre de tu plan).

1.2 Configuración de Sucursales (Paso Obligatorio)

    Importante: Sin al menos una sucursal creada no se puede continuar con otras configuraciones como profesionales o agendas.

    Pasos:

        Ingresa al panel de la clínica y ve a Configuración (menú izquierdo).

        Entra en la opción Clínica y luego en la pestaña Sucursales.

        Presiona el botón “Nueva Sucursal”.

        Completa todos los campos obligatorios y presiona “Crear”.

2. PERSONAL, SERVICIOS Y EQUIPO (Configuración > Clínica)
2.1 Tratamientos y Especialidades

    Crear Tratamiento: Ve a Configuración > Clínica > Tratamientos y presiona “Nuevo Tratamiento”.

    Detalles: Completa el Nombre, la Duración (obligatoria) y una descripción opcional; luego presiona “Crear”.

    Crear Especialidad: En el menú de Tratamientos, abre la pestaña Especialidades. Presiona “Nueva Especialidad”, ingresa el nombre y presiona Guardar.

2.2 Gestión de Profesionales

    Pasos: Ve a Configuración > Clínica > Profesionales. Presiona el botón “Nuevo Profesional”.

    Detalles: Completa Nombre, Apellido, Email, Teléfono, Especialidad, Tratamientos asociados, Sucursal y Horarios. Presiona “Crear”.

    Aclaraciones: El profesional recibirá automáticamente un email con sus credenciales. Si trabaja en más de una sucursal, los horarios deben configurarse por separado para cada una. Cantidad sujeta al plan (3 o 5), con opción a contratar adicionales.

2.3 Usuarios Administrativos (Secretaría)

    Pasos: Ve a Configuración > Clínica > Usuarios > “Nuevo Usuario”.

    Detalles: Completa nombre, email, selecciona el Rol y configura los permisos específicos; presiona “Crear”.

    Gestión: Para editar permisos, usa el ícono de candado; para eliminar, usa el de papelera. Los profesionales no se crean desde esta sección.

2.4 Estados de Turnos y Consentimientos (NUEVO)

    Estados de Turnos: Ve a Configuración > Clínica > Estados de turnos. Puedes crear estados personalizados (ej: "Confirmado", "En Sala") definiendo nombre y color.

    Consentimiento: Ve a Configuración > Clínica > Consentimiento. Crea plantillas de documentos legales para enviárselos a los pacientes para firma digital.

3. GESTIÓN DE PACIENTES Y FICHAS
3.1 Registro Individual y Edición

    Creación: Ve al módulo de Marketing > Contactos (para prospectos) o usa el buscador general para Pacientes.

    Ficha Clínica: Presiona “Ver ficha” para abrir la ventana flotante donde puedes editar o crear evoluciones personalizadas.

3.2 Importación Masiva (Excel/CSV)

    Pasos: Prepara un archivo (.xlsx, .csv). Ve a Marketing > Contactos > “Importar CSV”. Arrastra el archivo.

    Mapeo: Asegúrate de que las columnas coincidan (Origen vs Destino). Revisa e importa.

4. OPERACIÓN DE AGENDA Y TURNOS (Menú Agenda)
4.1 Creación y Gestión de Citas

    Agendar: Haz clic en Agenda (menú izquierdo). Elige un profesional y haz clic en un horario disponible.

    Pasos: Selecciona al paciente, elige el tratamiento e ingresa el ID de venta o marca “sin cargo”; presiona “Crear cita”. El paciente recibirá email automático.

    Estados: Se pueden cambiar manualmente (Pendiente, Confirmado, Completado, etc.).

    Ver Detalles: Haz clic en una cita y presiona el botón verde “Ver detalles” para ver contacto, sucursal y motivo.

    Reprogramar/Eliminar: Opciones disponibles dentro del detalle del turno.

4.2 Control de Calendario Avanzado (Superior Derecha)

    Vista por Doctor: Presiona el botón “Agenda” (arriba derecha) para ver tarjetas verticales por profesional.

    Bloqueo de Días: En el botón “Agenda” (arriba derecha) > “Bloquear día completo”. Selecciona fecha, escribe el motivo y presiona Aceptar para bloquear a todos o profesionales específicos.

5. VENTAS Y GESTIÓN COMERCIAL (Menú Ventas)

    Registro: Ve a Ventas > “Nueva venta”. Completa: Paciente, Sucursal, Origen, Tratamientos, Estado, Medio de pago y Descuento; presiona “Crear venta”.

    ID: Cada venta genera un ID único para autocompletar datos en la cita.

    Exportación: Puedes exportar el listado a Excel desde el panel de Ventas.

6. MENSAJERÍA, CRM Y CHATBOT

    Control del Chatbot: En Mensajería, ubica el botón azul/violeta "Chatbot ON" (arriba derecha). Presiónalo para cambiar a "Chatbot OFF" para modo manual.

    Herramientas de Envío: Ícono de adjuntar (archivos), ícono de Plantillas (Meta) e ícono de Fragmentos Rápidos (Snippets) para respuestas rápidas con variables.

    Filtros: Usa los colores de la columna izquierda para filtrar por etapa del embudo.

7. MARKETING Y AUTOMATIZACIONES (Configuración > Marketing)
7.1 Métricas y Audiencias

    KPIs: Ve a Configuración > Marketing > Índices. Revisa ventas, promedios y estados de citas.

    Tags (Etiquetas): Ve a Marketing > Tags. Escribe el nombre, elige color y presiona “Crear Tag”.

    Audiencias: Ve a Marketing > Audiencia y presiona “Nueva audiencia” para segmentar.

7.2 Difusiones y Automatizaciones

    Difusión Masiva: Ve a Marketing > Difusiones > “Nueva difusión”. Ingresa título, selecciona Plantilla, Audiencia y programa fecha/hora.

    Configurar Automatización (PASO A PASO):

        Ve a Configuración > Marketing > Automatizaciones > “Nueva automatización”.

        Trigger (Disparador): Clic en el engranaje del nodo Trigger para elegir el evento (ej: Cita Agendada) y Guardar.

        Lógica (Espera): Presiona "Agregar nodo" > Lógica Esperar (botón amarillo). Clic en su engranaje para definir minutos, horas o días.

        Acción (WhatsApp): Presiona "Agregar nodo" > WhatsApp y selecciona la plantilla.

        Conexión: Arrastra desde el círculo de origen al de destino para unir los nodos.

        Activar: Presiona Guardar y activa mediante el switch azul. (Usa la rueda del ratón para zoom).

7.3 Formulario Mágico, Agente IA y API

    Formulario Mágico: Genera un script/iframe para insertar en tu web y capturar leads directamente al embudo.

    Agente IA ✨: Configura Identidad, Entrenamiento (Negocio, Ubicación, Staff) e Instrucciones (Prompt). Presiona “Guardar configuración”.

    Token APIs: Genera tokens para integrar con Zapier, Make o N8N.

8. CONFIGURACIÓN VISUAL Y SEGURIDAD

    Identidad de Marca: En Configuración > Clínica, cambia logo, colores y URL (Slug).

    Seguridad: Clic en Avatar (Usuario) > Configuración > Cambiar contraseña.

    Suscripción: Gestiona plan y tarjetas desde el menú de Usuario.

    Cambio de Idioma: Clic en la bandera (abajo izquierda).


9. Si te preguntan por herramientas o funciones de las que no tienes conocimiento, señala que no existe esa funcionalidad aun, pero si deseas conocer el Roadmap de Clinera ingresa al siguiente enlace: https://clinera.io/roadmap.html

10. Si alguien pregunta como crear un link de pago (desambiguación para la duda acerca de agregar un medio de pago en un tratamiento)
Para crear un link de pago, usa plataformas como Mercado Pago, PayPal, Flow y cualquier otra de tu país. En esa plataforma debes crear un link de pago, definiendo el monto y la descripción del servicio. Finalmente ese el enlace que puedes usar para cobrar los tratamientos o evaluaciones.

11. Como se hace la conexión del Whatsapp API y Clinera para que el agente IA responda: Para conocer como es el proceso ingresa a este sitio paso a paso sobre como realizar el proceso de registro del Whataspp API y su vinculación con Clinera. link: https://clinera.io/register-api/




`;

function doPost(e) {
    try {
        const params = JSON.parse(e.postData.contents);

        // VALIDACIÓN DE SEGURIDAD
        if (params.token !== SECURITY_TOKEN) {
            return ContentService.createTextOutput(JSON.stringify({
                success: false,
                message: "Acceso denegado: Token inválido."
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // DETECTOR DE INTENCIÓN
        if (params.type === 'incident') {
            return handleIncident(params);
        } else {
            return handleChat(params);
        }

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            error: true,
            message: "Error crítico en servidor: " + error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

/* --- FUNCIÓN PARA GUARDAR INCIDENTES --- */
function handleIncident(data) {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        let sheet = ss.getSheetByName('Reportes');

        if (!sheet) {
            sheet = ss.insertSheet('Reportes');
            sheet.appendRow(['Fecha', 'Ticket ID', 'Clínica', 'Asunto', 'Categoría', 'Prioridad', 'Descripción', 'Link Archivo', 'Estado']);
        }

        let fileUrl = "Sin archivo";

        // Guardar archivo si existe
        if (data.fileData && data.fileName) {
            const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
            const decoded = Utilities.base64Decode(data.fileData.split(',')[1]);
            const blob = Utilities.newBlob(decoded, data.mimeType, "Ticket_" + data.ticketId + "_" + data.fileName);
            const file = folder.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            fileUrl = file.getUrl();
        }

        sheet.appendRow([
            new Date(),
            data.ticketId,
            data.clinicName || "Desconocida", // NUEVO CAMPO
            data.subject,
            data.category,
            data.priority,
            data.description,
            fileUrl,
            "Pendiente"
        ]);

        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            ticketId: data.ticketId,
            message: "Guardado exitosamente."
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: "Error Apps Script: " + err.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

/* --- NUEVAS FUNCIONES PARA ADMIN Y SEGURIDAD --- */

/* --- UTILERÍA PARA FECHAS DE SHEETS --- */
function formatSheetsDuration(value) {
    if (!value) return "";
    if (value instanceof Date) {
        // En Sheets, las duraciones se leen como fechas referenciadas a 1899-12-30
        const hours = value.getHours();
        const minutes = value.getMinutes();
        const seconds = value.getSeconds();

        let result = "";
        if (hours > 0) result += hours + ":";
        result += (minutes < 10 && hours > 0 ? "0" + minutes : minutes) + ":";
        result += (seconds < 10 ? "0" + seconds : seconds);
        return result;
    }
    return String(value);
}

function handleGetTutorials() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        // Usamos el GID 1566735120 que estaba en el app.js, 
        // pero buscamos por nombre de hoja para mayor claridad.
        // Si no sabes el nombre, podemos usar ss.getSheets()[0] o similar.
        // Asumiremos que la hoja se llama "Tutoriales" o usaremos el índice.
        let sheet = ss.getSheetByName('Tutoriales');
        if (!sheet) sheet = ss.getSheets()[0]; // Fallback a la primera hoja

        const data = sheet.getDataRange().getValues();
        const rows = data.slice(1); // Omitir cabecera

        const tutorials = rows.map((row, index) => {
            return {
                id: String(row[0] || index),
                title: String(row[1] || 'Sin Título'),
                category: String(row[2] || 'General'),
                duration: formatSheetsDuration(row[3]),
                thumbnail: String(row[4] || ''),
                videoUrl: String(row[5] || '')
            };
        });

        return ContentService.createTextOutput(JSON.stringify(tutorials))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return errorJson("Error obteniendo tutoriales: " + err.toString());
    }
}


function handleGetFaqs() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        // IMPORTANTE: Tu pestaña en el Excel deberá llamarse "FAQs"
        let sheet = ss.getSheetByName('FAQs');

        // Si la hoja no existe aún, devuelve array vacío para que no falle la web
        if (!sheet) return ContentService.createTextOutput(JSON.stringify([]))
            .setMimeType(ContentService.MimeType.JSON);

        const data = sheet.getDataRange().getValues();
        const rows = data.slice(1); // Omitir cabecera

        const faqs = rows.map((row) => {
            return {
                icon: String(row[0] || '💡'),
                title: String(row[1] || ''),
                content: String(row[2] || ''),
                keywords: String(row[3] || '')
            };
        }).filter(faq => faq.title !== ''); // Filtra filas vacías

        return ContentService.createTextOutput(JSON.stringify(faqs))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return errorJson("Error obteniendo FAQs: " + err.toString());
    }
}

/* --- VERSION MEJORADA (Sin iframe) --- */
function handleGetBlogs() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        let sheet = ss.getSheetByName('Blogs');
        if (!sheet) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);

        const data = sheet.getDataRange().getValues();
        const rows = data.slice(1);

        const blogs = rows.map((row) => {
            // Tomamos el contenido de la COLUMNA G (índice 6) de forma pura
            let content = String(row[6] || '');

            return {
                category: String(row[0] || 'GENERAL'),
                title: String(row[1] || ''),
                excerpt: String(row[2] || ''),
                url: String(row[3] || '#'),
                image: String(row[4] || ''),
                keywords: String(row[5] || ''),
                full_content: content // Enviamos el texto/HTML puro para que la web lo estilice
            };
        }).filter(blog => blog.title !== '');

        return ContentService.createTextOutput(JSON.stringify(blogs))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        // Manejo de error simple
    }
}




function handleGetIncidents() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheetByName('Reportes');
        if (!sheet) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);

        const data = sheet.getDataRange().getValues();
        const headers = ["Fecha", "Ticket ID", "Clínica", "Asunto", "Categoría", "Prioridad", "Descripción", "Link Archivo", "Estado"];
        const rows = data.slice(1);

        const incidents = rows.map((row, index) => {
            const obj = {};
            headers.forEach((header, i) => {
                obj[header.toLowerCase().replace(/ /g, '_')] = row[i];
            });
            obj.rowIndex = index + 2;
            return obj;
        });

        return ContentService.createTextOutput(JSON.stringify(incidents.reverse()))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return errorJson("Error obteniendo incidentes: " + err.toString());
    }
}

function handleUpdateIncident(data) {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheetByName('Reportes');
        if (!sheet) throw new Error("No se encontró la hoja de reportes");

        const rowIndex = data.rowIndex;
        const newStatus = data.status;

        sheet.getRange(rowIndex, 9).setValue(newStatus);

        return ContentService.createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return errorJson("Error actualizando incidente: " + err.toString());
    }
}

/* --- FUNCIÓN MAESTRA PARA CARGA RÁPIDA (TODO EN UNO) --- */
function handleGetAllHelpData() {
    try {
        const tutorials = fetchTutorialsData();
        const faqs = fetchFaqsData();
        const blogs = fetchBlogsData();

        return ContentService.createTextOutput(JSON.stringify({
            tutorials: tutorials,
            faqs: faqs,
            blogs: blogs
        })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return errorJson("Error en carga masiva: " + err.toString());
    }
}

// Helpers para reutilizar lógica
function fetchTutorialsData() {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName('Tutoriales') || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    return data.slice(1).map((row, index) => ({
        id: String(row[0] || index),
        title: String(row[1] || 'Sin Título'),
        category: String(row[2] || 'General'),
        duration: formatSheetsDuration(row[3]),
        thumbnail: String(row[4] || ''),
        videoUrl: String(row[5] || '')
    }));
}

function fetchFaqsData() {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName('FAQs');
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    return data.slice(1).map(row => ({
        icon: String(row[0] || '💡'),
        title: String(row[1] || ''),
        content: String(row[2] || ''),
        keywords: String(row[3] || '')
    })).filter(faq => faq.title !== '');
}

function fetchBlogsData() {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName('Blogs');
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    return data.slice(1).map(row => ({
        category: String(row[0] || 'GENERAL'),
        title: String(row[1] || ''),
        excerpt: String(row[2] || ''),
        url: String(row[3] || '#'),
        image: String(row[4] || ''),
        keywords: String(row[5] || ''),
        full_content: String(row[6] || '')
    })).filter(blog => blog.title !== '');
}

/* --- FUNCIÓN AUXILIAR PARA OBTENER VIDEOS --- */
function getTutorialsContext() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        let sheet = ss.getSheetByName('Tutoriales');
        if (!sheet) sheet = ss.getSheets()[0];

        const data = sheet.getDataRange().getValues();
        const rows = data.slice(1);

        if (rows.length === 0) return "No hay videos tutoriales registrados.";

        return rows.map(row => {
            const titulo = String(row[1] || 'Sin Título');
            const url = String(row[5] || '');
            const thumb = String(row[4] || '');
            if (!url || url.toLowerCase() === 'sin enlace') return null;
            return `[[VIDEO:${url}|${titulo}|${thumb}]]`;
        }).filter(item => item !== null).join('\n');
    } catch (err) {
        console.error("Error cargando tutoriales para contexto: " + err.toString());
        return "No se pudo cargar la lista de videos.";
    }
}

/* --- FUNCIÓN DEL CHAT (Integración con OpenRouter Gratis) --- */
function handleChat(params) {
    // RUTAS DE SEGURIDAD Y ADMIN
    if (params.type === 'get_incidents') return handleGetIncidents();
    if (params.type === 'update_incident') return handleUpdateIncident(params);
    if (params.type === 'get_tutorials') return handleGetTutorials();
    if (params.type === 'get_faqs') return handleGetFaqs();
    if (params.type === 'get_blogs') return handleGetBlogs();
    if (params.type === 'get_all_help_data') return handleGetAllHelpData();

    const userMessage = params.message;

    // 1. OBTENER CONTEXTO DE VIDEOS
    const videosContext = getTutorialsContext();

    // 2. CONFIGURAR EL PROMPT MAESTRO
    const systemPrompt = `Eres Cuky, el Asistente de Clinera y mascota oficial del soporte técnico. 
Tu misión es ayudar a los usuarios de forma amable y experta, basándote en el MANUAL DE CONTEXTO y la LISTA DE VIDEO TUTORIALES.

REGLAS DE RESPUESTA:
1. Usa el MANUAL DE CONTEXTO para explicar los procesos paso a paso.
2. SI EXISTE UN VIDEO TUTORIAL que ayude a resolver la duda del usuario, DEBES incluirlo utilizando el formato exacto: [[VIDEO:URL|TITULO|THUMBNAIL]] al final de tu respuesta de forma amable. No lo ocultes en un texto, ponlo como un bloque separado.
3. Si no hay un video específico, no inventes el enlace.
4. Si el usuario pregunta por algo que no está en el manual ni en los videos, indícale que no tienes esa información y que puede reportar un incidente.
5. Mantén un tono profesional, amable y directo.

MANUAL DE CONTEXTO:
${MANUAL_CONTEXTO}

LISTA DE VIDEO TUTORIALES (SI APLICAN):
${videosContext}`;

    // 3. PREPARAR PAYLOAD (Formato OpenAI compatible con OpenRouter)
    const payload = {
        "model": "google/gemini-3-flash-preview", // Gemini 3 Flash Preview - Modelo más reciente y potente
        "messages": [
            {
                "role": "system",
                "content": systemPrompt + "\n\nCRITICAL: You MUST follow the manual exactly. NEVER hallucinate video URLs. Only use the ones provided in the list. The format [[VIDEO:URL|TITLE|THUMB]] is mandatory for videos."
            },
            { "role": "user", "content": userMessage }
        ],
        "temperature": 0.1
    };

    // 4. LLAMADA A OPENROUTER
    const response = UrlFetchApp.fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'post',
        contentType: 'application/json',
        headers: {
            "Authorization": "Bearer " + OPENROUTER_API_KEY,
            "HTTP-Referer": "https://clinera.io", // Opcional para OpenRouter
            "X-Title": "Clinera IA Support"      // Opcional para OpenRouter
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
        return errorJson("Error OpenRouter: " + response.getContentText());
    }

    const result = JSON.parse(response.getContentText());
    const aiText = result.choices[0].message.content;

    return ContentService.createTextOutput(JSON.stringify({ response: aiText }))
        .setMimeType(ContentService.MimeType.JSON);
}

function errorJson(msg) {
    return ContentService.createTextOutput(JSON.stringify({ response: msg }))
        .setMimeType(ContentService.MimeType.JSON);
}

function FORZAR_PERMISOS() {
    // Esto obligará a Google a pedirte permiso de ESCRITURA total en Drive
    DriveApp.createFile("Archivo_Prueba_Permisos.txt", "Si lees esto, funcionó");
}
