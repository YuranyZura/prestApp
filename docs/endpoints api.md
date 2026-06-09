# API Documentation — PrestApp

Base URL Producción:
https: //api.prestapp.com

Base URL Staging:
https: //staging-api.prestapp.com

Formato respuesta:
JSON

Autenticación:
Bearer Token JWT

---

## AUTH

## Login

POST /auth/login

### Body

{
  " email": "usuario@email .com ";

  "password": "******"
}

### Response 200

{
  "success": true,
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": 1,
    "name": "Juan"
  }
}

---

## Registro

POST /auth/register

 Body

{
  "name": "Juan",
  "email":"juan@email .com",
  "phone": "3000000000",
  "password": "******"
}

---

## Refresh Token

POST /auth/refresh

 Body

{
  "refreshToken": "token"
}

---

## Logout

POST /auth/logout

Headers:
Authorization: Bearer TOKEN

---

## USERS

## Obtener perfil

GET /users/me

Headers:
Authorization: Bearer TOKEN

---

## Actualizar perfil

PUT /users/me

Body:

{
  "name": "Nuevo Nombre"
}

---

## LOANS

## Crear préstamo

POST /loans/create

Body:

{
  "amount": 500000,
  "term": 30,
  "purpose": "Capital trabajo"
}

---

## Obtener préstamos

GET /loans

---

## Obtener detalle préstamo

GET /loans/:id

---

## Aprobar préstamo

POST /loans/:id/approve

---

## Rechazar préstamo

POST /loans/:id/reject

---

## PAYMENTS

## Registrar pago

POST /payments/create

Body:

{
  "loanId": 1,
  "amount": 100000
}

---

## Historial pagos

GET /payments/history

---

## ADMIN

## Dashboard

GET /admin/dashboard

---

## Usuarios

GET /admin/users

---

## Riesgo

GET /admin/risk

---

## RESPUESTAS ESTÁNDAR

## Success

{
  "success": true,
  "data": {}
}

## Error

{
  "success": false,
  "message": "Error message"
}

---

## STATUS CODES

200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Server Error
