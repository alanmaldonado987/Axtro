# Configuración de OAuth (Google y Facebook)

## Variables de Entorno Necesarias

Agrega las siguientes variables a tu archivo `.env` en el servidor:

```env
# URL del cliente (frontend)
CLIENT_URL=http://localhost:5173

# URL del servidor (necesaria para construir callbacks si no se especifican)
SERVER_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=tu_facebook_app_id
FACEBOOK_APP_SECRET=tu_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback
```

## Configuración de Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Ve a "Credenciales" > "Crear credenciales" > "ID de cliente OAuth"
5. Configura:
   - Tipo de aplicación: Aplicación web
   - Orígenes autorizados: `http://localhost:5173` (o tu URL de producción)
   - URI de redirección autorizados: `http://localhost:3000/api/auth/google/callback` (o tu URL de producción)
6. Copia el Client ID y Client Secret a tu `.env`

## Configuración de Facebook OAuth

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una nueva aplicación
3. Agrega el producto "Facebook Login"
4. Configura:
   - URL del sitio: `http://localhost:5173` (o tu URL de producción)
   - URI de redirección de OAuth válidos: `http://localhost:3000/api/auth/facebook/callback` (o tu URL de producción)
5. En Configuración > Básico, copia el ID de aplicación y el Secreto de aplicación a tu `.env`

## Notas

- Asegúrate de que las URLs de callback coincidan exactamente con las configuradas en las plataformas OAuth
- Para producción, actualiza las URLs en ambos lugares (`.env` y plataformas OAuth)
- Los usuarios que se registren con OAuth no necesitarán contraseña
- Si un usuario intenta hacer login con email/password pero está registrado con OAuth, recibirá un mensaje indicándole que use su proveedor OAuth

