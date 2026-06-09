# Roles y Permisos — PrestApp

Última actualización: [FECHA]

---

## 1. OBJETIVO

El sistema de roles y permisos de PrestApp controla:

- acceso a módulos,
- acciones permitidas,
- seguridad operacional,
- segregación de funciones,
- auditoría administrativa,
- y protección de datos críticos.

---

## 2. MODELO DE ACCESO

## Tipo de control

RBAC (Role-Based Access Control)

---

## Flujo

Usuario → Rol → Permisos → Acceso recursos

---

## 3. TIPOS DE USUARIOS

| Tipo | Descripción |
|
| customer | usuario cliente |
| admin | administrador |
| operator | operador |
| analyst | analista |
| support | soporte |
| collections | cobranza |
| finance | financiero |
| auditor | auditor |
| super_admin | acceso total |

---

## 4. ROLES PRINCIPALES

## SUPER ADMIN

## Acceso

Total sobre plataforma.

## Permisos

- gestionar admins
- modificar configuración
- acceso producción
- ver auditoría
- modificar reglas riesgo
- administrar infraestructura

---

## ADMIN

 Acceso

Operación general.

 Permisos

- aprobar préstamos
- gestionar usuarios
- monitorear pagos
- generar reportes

---

## RISK ANALYST

 Acceso

Módulo scoring/riesgo.

 Permisos

- revisar score
- aprobar manualmente
- rechazar solicitudes
- ver fraude

---

## COLLECTIONS AGENT

 Acceso

Cobranza.

 Permisos

- ver mora
- registrar acuerdos
- contactar usuarios
- actualizar estados cobranza

---

## SUPPORT

 Acceso

Soporte clientes.

 Permisos

- ver perfil usuario
- reset contraseña
- responder tickets

---

## FINANCE

 Acceso

Pagos y finanzas.

 Permisos

- validar pagos
- exportar reportes
- conciliaciones
- reversos autorizados

---

## AUDITOR

 Acceso

Solo lectura.

 Permisos

- ver logs
- revisar auditoría
- exportar información

---

## CUSTOMER

 Acceso

Frontend cliente.

 Permisos

- solicitar préstamos
- pagar cuotas
- actualizar perfil
- descargar contratos

---

## 5. MATRIZ DE PERMISOS

| Módulo | Customer | Support | Risk | Finance | Admin | SuperAdmin |
|---|---|---|---|---
| Usuarios | limitado | lectura | lectura | lectura | total | total |
| Préstamos | propios | lectura | gestión | lectura | total | total |
| Pagos | propios | lectura | lectura | gestión | total | total |
| Riesgo | no | no | total | lectura | total | total |
| Fraude | no | lectura | total | lectura | total | total |
| Configuración | no | no | no | no | parcial | total |
| Logs | no | no | parcial | parcial | total | total |

---

## 6. PERMISOS DETALLADOS

## Usuarios

| Permiso | Acción |
|
| users.read | ver usuarios |
| users.write | editar usuarios |
| users.block | bloquear usuarios |
| users.delete | eliminar usuarios |

---

## Préstamos

| Permiso | Acción |
|
| loans.read | ver préstamos |
| loans.create | crear |
| loans.approve | aprobar |
| loans.reject | rechazar |

---

## Pagos

| Permiso | Acción |
|
| payments.read | ver pagos |
| payments.reverse | reversar |
| payments.refund | reembolso |

---

## Riesgo

| Permiso | Acción |
||
| risk.read | ver score |
| risk.review | revisión manual |
| risk.override | modificar decisión |

---

## Fraude

| Permiso | Acción |
|
| fraud.read | ver alertas |
| fraud.block | bloquear |
| fraud.investigate | investigar |

---

## 7. AUTENTICACIÓN

## Métodos

- JWT
- MFA
- OTP
- sesiones seguras

---

## 8. AUTORIZACIÓN

## Flujo backend

1. validar token
2. obtener rol
3. validar permisos
4. permitir/rechazar acción

---

## Ejemplo middleware

```js id="v6j3p8"
authorize(['admin', 'super_admin'])
