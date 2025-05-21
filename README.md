## Ejecutar el backend

1. Clonar el repositorio:
2. Instalar las dependencias:

```
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto y agregar las variables de entorno necesarias. Puedes usar el archivo `.env.template` como referencia.
4. Ejecutar el servidor:

```
npm run start:dev
```

5. Acceder a la API en `http://localhost:3000/api`.

## Obtener credenciales Gmail

1. Ir a la consola de Google Cloud: [Google Cloud Console](https://console.cloud.google.com/).
2. Crear un nuevo proyecto.
3. Habilitar la API de Gmail para el proyecto.
4. Crear credenciales de tipo "OAuth 2.0 Client ID".
5. Configurar la pantalla de consentimiento OAuth.
6. Crear el tipo de aplicación "Web application".
7. Agregar las URL de redirección autorizadas (por ejemplo, `https://developers.google.com/oauthplayground`).
8. Añadir su EMAIL_CLIENT_ID y su EMAIL_CLIENT_SECRET al archivo `.env`.
9. Ir a [OAuth 2.0 Playground](https://developers.google.com/oauthplayground) y autorizar el acceso a la API de Gmail.
10. Copiar el `refresh_token` y añadirlo al archivo `.env` como `EMAIL_REFRESH_TOKEN`.
11. Asegurarse de que el `redirect_uri` en el archivo `.env` coincida con el que se configuró en la consola de Google Cloud.
