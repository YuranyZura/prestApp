# Arquitectura Técnica — PrestApp

Última actualización: [FECHA]

---

## 1. RESUMEN GENERAL

PrestApp es una plataforma fintech orientada a [microcréditos / préstamos / adelantos / BNPL / etc].

Arquitectura general:

Usuario → Frontend → API Backend → Base de Datos → Servicios externos

---

## 2. FRONTEND

## Framework principal

- React / Next.js / Vue / Flutter / React Native
- Versión:
- TypeScript: Sí/No

## Arquitectura Frontend

Ejemplo:

/src
/components
/pages
/hooks
/services
/store
/utils

## Hosting Frontend

- Vercel
- Netlify
- AWS S3
- Cloudflare Pages

URL producción:

https: //app.prestapp.com

URL staging:

https: //staging.prestapp.com

---

## Variables de entorno Frontend

Variables utilizadas:

NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_FIREBASE_KEY=
NEXT_PUBLIC_ENV=

IMPORTANTE:
-Nunca exponer secretos privados.
-Solo variables públicas en frontend.

---

## Manejo de estado

- Redux
- Zustand
- Context API
- MobX
- Riverpod

Estado global utilizado para:

- autenticación
- usuario
- préstamos
- notificaciones

---

## Librerías críticas

| Librería | Uso |
|
| axios | HTTP requests |
| react-query | cache y fetching |
| redux-toolkit | estado global |
| formik | formularios |
| yup | validaciones |
| socket.io | realtime |

---

## Seguridad Frontend

- Protección XSS
- CSP headers
- Tokens almacenados en:
  - cookies httpOnly
  - localStorage
  - sessionStorage

---

## 3. BACKEND

## Lenguaje

- Node.js
- Python
- Go
- Java

Versión:
vXX

---

## Framework

- Express
- NestJS
- Fastify
- Django
- Spring Boot

---

## Arquitectura Backend

Ejemplo:

/modules
/auth
/users
/loans
/payments
/scoring

/shared
/config
/middlewares

---

## Patrón arquitectónico

- Monolito modular
- Microservicios
- Clean Architecture
- Hexagonal
- MVC

---

## APIs

### API principal

Base URL:
https: //api.prestapp.com

### Endpoints principales

| Método | Endpoint | Descripción |
|
| POST | /auth/login | Login |
| POST | /loans/create | Crear préstamo |
| GET | /users/me | Perfil usuario |

---

## Autenticación

- JWT
- OAuth
- Firebase Auth
- Session-based

### Seguridad

- Access Token
- Refresh Token
- Expiración tokens
- Rate limiting

---

## Middlewares

| Middleware | Función |
|
| authMiddleware | validar JWT |
| errorHandler | manejo errores |
| cors | seguridad CORS |
| logger | logs |
| validator | validaciones |

---

## Servicios externos

| Servicio | Uso |
|
| Twilio | SMS/OTP |
| SendGrid | correos |
| Stripe | pagos |
| Firebase | push notifications |
| AWS S3 | archivos |

---

## Logs y monitoreo

- Winston / Pino
- Sentry
- Datadog
- CloudWatch

---

## 4. BASE DE DATOS

## Motor DB

- PostgreSQL
- MySQL
- MongoDB

Versión:
XX

---

## Hosting DB

- RDS AWS
- Railway
- Supabase
- DigitalOcean

---

## Tablas principales

| Tabla | Descripción |
|
| users | usuarios |
| loans | préstamos |
| payments | pagos |
| transactions | movimientos |

---

## Relaciones

users → loans (1:N)

loans → payments (1:N)

users → documents (1:N)

---

## Índices importantes

| Tabla | Índice |
|
| users | email |
| loans | user_id |
| payments | loan_id |

---

## Tamaño actual

- Usuarios:
- Préstamos:
- Tamaño DB:
- Crecimiento mensual:

---

## Backups

- Frecuencia:
- Retención:
- Restauración probada: Sí/No

---

## 5. INFRAESTRUCTURA

## Cloud / VPS

- AWS
- DigitalOcean
- Railway
- Render
- GCP

---

## Servicios utilizados

| Servicio | Uso |
|
| EC2 | backend |
| RDS | base datos |
| S3 | archivos |
| CloudFront | CDN |

---

## Docker

Servicios dockerizados:

- frontend
- backend
- postgres
- redis

docker-compose:
Sí/No

---

## CI/CD

Herramientas:

- GitHub Actions
- GitLab CI
- Jenkins

Flujo:

1. Push
2. Tests
3. Build
4. Deploy staging
5. Deploy producción
