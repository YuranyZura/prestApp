# Flujo de Autenticación — PrestApp

---

## 1. REGISTRO

Usuario completa:

- nombre
- email
- teléfono
- contraseña

Frontend → POST /auth/register

Backend:

1. valida datos
2. verifica email único
3. hashea contraseña
4. crea usuario
5. envía OTP/email verificación

---

## 2. VERIFICACIÓN

Usuario ingresa OTP.

POST /auth/verify

Backend:

1. valida código
2. activa cuenta

---

## 3. LOGIN

POST /auth/login

Backend:

1. valida credenciales
2. genera accessToken
3. genera refreshToken
4. registra sesión

Response:

{
  accessToken,
  refreshToken
}

---

## 4. SESIÓN

Frontend almacena:

- accessToken
- refreshToken

Recomendado:

- cookies httpOnly
- secure
- sameSite strict

---

## 5. PETICIONES PRIVADAS

Frontend envía:

Authorization: Bearer TOKEN

Middleware backend:

1. valida JWT
2. valida expiración
3. obtiene usuario
4. permite acceso

---

## 6. REFRESH TOKEN

Cuando accessToken expira:

POST /auth/refresh

Backend:

1. valida refresh token
2. genera nuevo accessToken

---

## 7. LOGOUT

POST /auth/logout

Backend:

1. invalida refresh token
2. cierra sesión

---

## 8. SEGURIDAD

Implementar:

- bcrypt
- rate limiting
- bloqueo intentos login
- expiración JWT
- detección IP sospechosa
- auditoría sesiones
- logs auth

---

## 9. RECOVERY PASSWORD

POST /auth/forgot-password

Flujo:

1. usuario solicita recuperación
2. backend genera token temporal
3. email recuperación
4. usuario cambia password

---

## 10. MFA FUTURO

Recomendado:

OTP SMS
Google Authenticator

biometría
