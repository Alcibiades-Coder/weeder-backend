# Weeder - Trabajo Realizado por Alcibiades Oyarzun

En Auth0 resgitrarse y crear una aplicación y una API
en la Aplicación los parametros de Allowed Callback URLs, Allowed Logout URLs y Allowed Web Origins deben llevar el parametro: http://localhost:5173, https://[TU DIRECCIÓN DE RENDER O NETLIFY]
En la API el Identifier es parametro para AUDIENCE

# Variables de Entorno para Backend

## LOS SIGUIENTES VALORES SON ESPACIOS RESERVADOS COMO EJEMPLO. PARA USAR:

- Copia este archivo y renómbralo como .env

- Llena los espacios reservados con los valores apropiados para cada servicio después de registrarte

# Cadena de conexión para MongoDB

MONGODB_CONNECTION_STRING=mongodb+srv://xxx:xxx@xxx.mongodb.net/?retryWrites=true&w=majority

# Configuración de Auth0

AUTH0_AUDIENCE=xxx-xxxx-api # El identificador del público (audiencia) de Auth0
AUTH0_ISSUER_BASE_URL=https://xxx.us.auth0.com/ # URL base del emisor de Auth0

# Configuración de Cloudinary

CLOUDINARY_CLOUD_NAME=dr55xxx # Nombre del Cloud en Cloudinary
CLOUDINARY_API_KEY=14122xxx # Clave de API de Cloudinary
CLOUDINARY_API_SECRET=h3iPa_nR-xxx # Secreto de API de Cloudinary

# Configuración de Stripe

FRONTEND_URL=http://localhost:5173 # URL del frontend para Stripe
STRIPE_API_KEY=sk_test_xxx # Clave de API de Stripe (modo prueba)
STRIPE_WEBHOOK_SECRET=whsec_xxx # Secreto del webhook de Stripe

# Variables de Entorno para Frontend

## LOS SIGUIENTES VALORES SON MARCAS DE LUGAR DESTINADAS COMO EJEMPLO. PARA USAR:

- Copia este archivo y renómbralo a .env

- Completa los valores de los marcadores de lugar con los valores apropiados para el servicio dado después de registrarte

VITE_API_BASE_URL=http://localhost:7000
VITE_AUTH0_DOMAIN=dev-xxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=Cn88qxxx
VITE_AUTH0_CALLBACK_URL=http://localhost:5173
VITE_AUTH0_AUDIENCE=xx-xxxx-xxx-api

-Recuerda que las variables de entorno con valores : http://localhost:7000 y http://localhost:5173 por https://[TU DIRECCION DE BACKEND EN RENDER O NETLIFY] y https://[TU DIRECCION DE FRONTEND EN RENDER O NETLIFY] respectivamente.

Trabajo realizado por Alcibiades Oyarzún
