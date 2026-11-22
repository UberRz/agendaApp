# AgendaApp

## Recuperación de contraseña

El backend envía enlaces de recuperación al correo guardado en la cuenta. Para probar localmente, ejecuta `podman compose up --build`, solicita la recuperación para una cuenta existente y abre Mailpit en `http://localhost:8025`. El enlace del mensaje abre `/restablecer?token=...` en el frontend `http://localhost:3000`; el frontend local ya sirve la SPA para esa ruta.

Los correos `juan123@hotmail.cmo` y `profeingles@hotmai.com` del respaldo SQL tienen dominios mal escritos. Registra un usuario nuevo desde la pantalla de registro con un correo de un dominio que tenga MX válido (la validación DNS está activa) y solicita la recuperación para esa dirección.

Configura estas variables en el servicio backend; `.env.example` contiene valores locales y no incluye credenciales:

| Variable | Uso |
| --- | --- |
| `SPRING_MAIL_HOST` | Host SMTP; localmente `mailpit` para el servicio de Mailpit. |
| `SPRING_MAIL_PORT` | Puerto SMTP; localmente `1025`. |
| `SPRING_MAIL_USERNAME` | Usuario SMTP; vacío para Mailpit local. |
| `SPRING_MAIL_PASSWORD` | Contraseña SMTP; vacía para Mailpit local. |
| `SPRING_MAIL_SMTP_AUTH` | Habilita autenticación SMTP; `false` localmente. |
| `SPRING_MAIL_STARTTLS` | Habilita STARTTLS; `false` localmente. |
| `APP_MAIL_FROM` | Dirección remitente del correo. |
| `APP_FRONTEND_URL` | URL base para formar el enlace; localmente `http://localhost:3000`. |
| `CORS_ALLOWED_ORIGINS` | Orígenes del frontend autorizados por el API; localmente `http://localhost:3000`. |

En un entorno real, cambia el host, puerto, usuario, contraseña y opciones SMTP según el proveedor, usa un remitente permitido por ese proveedor y configura `APP_FRONTEND_URL` y `CORS_ALLOWED_ORIGINS` con la URL pública del frontend.
