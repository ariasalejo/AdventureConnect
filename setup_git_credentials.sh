#!/bin/bash
echo "Esta es una herramienta para configurar tus credenciales de GitHub."
echo "Necesitarás tu nombre de usuario de GitHub y un token de acceso personal."
echo ""
read -p "Introduce tu nombre de usuario de GitHub: " username
read -p "Introduce tu token de acceso personal: " token
echo ""

git config --global credential.helper store
echo "https://$username:$token@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

echo "Credenciales configuradas. Ahora puedes intentar hacer push a GitHub."