#!/bin/bash

# ==========================================================
# SCRIPT DE DESPLIEGUE PARA TU SERVIDOR RÚSTICO UBUNTU
# ==========================================================

# OPCIÓN 1: USANDO RSYNC (RECOMENDADO PARA UBUNTU/LINUX)
# Solo sube los archivos que cambiaron, es más rápido y seguro.
# Completa tus datos:
SERVER_USER="tu_usuario"
SERVER_IP="tu_ip_del_servidor"
SERVER_PORT="22" # Puerto SSH (por defecto 22)
REMOTE_PATH="/var/www/html/clinera/" # Carpeta en el servidor

echo "🚀 Iniciando subida de archivos..."
echo "Sincronizando la carpeta 'web 2.0' con el servidor..."

# El comando rsync (-avz) sincroniza carpetas y comprime durante la transferencia.
# --exclude ignora archivos innecesarios como .git o node_modules si los tuvieras.
rsync -avz -e "ssh -p $SERVER_PORT" \
      --exclude '.git' \
      --exclude '.DS_Store' \
      "./web 2.0/" \
      "$SERVER_USER@$SERVER_IP:$REMOTE_PATH"

echo "✅ ¡Subida completada con éxito!"
echo "Presiona Enter para salir..."
read

# ==========================================================
# OPCIÓN 2: SI SOLO TIENES FTP TRADICIONAL (Sin SSH/Rsync)
# Si tu servidor no soporta rsync/ssh, comenta las líneas de arriba (poniendo # al inicio)
# y usa este bloque (quítale el # a cada línea). Funciona con lftp o el cliente ftp básico.
# ==========================================================
# FTP_HOST="tu_ftp_ip"
# FTP_USER="tu_usuario_ftp"
# FTP_PASS="tu_contraseña"
# FTP_PATH="/public_html/"
# 
# lftp -c "open -u $FTP_USER,$FTP_PASS ftp://$FTP_HOST; mirror -R -v -I '*.html' -I '*.js' -I '*.css' -I '*.png' -I '*.jpg' -I '*.svg' './web 2.0/' $FTP_PATH; quit"
