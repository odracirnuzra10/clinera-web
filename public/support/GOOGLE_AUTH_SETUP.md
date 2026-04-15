# Configuración de Google Sign-In

## Autenticación Exclusiva con Google

La aplicación de soporte de Clinera utiliza **exclusivamente** Google Sign-In para la autenticación de usuarios. Esto garantiza:

- ✅ Mayor seguridad mediante OAuth 2.0
- ✅ Sesión persistente automática
- ✅ No requiere gestión de contraseñas
- ✅ Acceso rápido con cuentas de Gmail

## Pasos para configurar Google Sign-In

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Identity

### 2. Configurar OAuth 2.0

1. En el menú lateral, ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **OAuth client ID**
3. Si es la primera vez, configura la pantalla de consentimiento:
   - Tipo de usuario: **Externo**
   - Nombre de la aplicación: **Clinera Support App**
   - Correo de soporte: tu correo
   - Dominios autorizados: (opcional, puedes dejarlo vacío para desarrollo)
4. Vuelve a **Credentials** y crea el OAuth client ID:
   - Tipo de aplicación: **Web application**
   - Nombre: **Clinera Support Web Client**
   - Orígenes de JavaScript autorizados:
     - `http://localhost` (para desarrollo local)
     - `http://localhost:8000` (si usas un servidor local)
     - Tu dominio de producción cuando lo despliegues
   - URIs de redirección autorizados: (puedes dejarlo vacío para este caso)

### 3. Obtener el Client ID

1. Una vez creado, copia el **Client ID** (será algo como: `123456789-abc123def456.apps.googleusercontent.com`)
2. Abre el archivo `index.html`
3. Busca la línea que dice:
   ```html
   data-client_id="857784309609-ulm3k3kcunrddhmj1j4mjg1fcno5otoq.apps.googleusercontent.com"
   ```
4. Reemplázalo con tu Client ID real si es necesario

### 4. Probar la aplicación

1. Abre la aplicación en un navegador
2. Verás el botón "Acceder con Google"
3. Al hacer clic, se abrirá una ventana de Google para autenticarte
4. Una vez autenticado, la sesión se guardará automáticamente

## Características implementadas

✅ **Inicio de sesión con Google**: Los usuarios se autentican exclusivamente con su cuenta de Gmail
✅ **Sesión persistente**: La sesión se mantiene activa incluso después de cerrar el navegador (30 días)
✅ **Auto-login**: Si hay una sesión activa, el usuario ingresa automáticamente
✅ **Cierre de sesión**: Botón de logout en el dashboard
✅ **Interfaz simplificada**: Solo un botón de autenticación, sin formularios manuales

## Seguridad

- El Client ID es público y puede estar en el código del cliente
- No se almacenan contraseñas en ningún lugar
- La autenticación de Google es manejada completamente por Google
- Solo se guarda información básica del usuario (nombre, email, foto)
