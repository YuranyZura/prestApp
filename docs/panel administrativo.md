# Panel Administrativo — PrestApp

Última actualización: [FECHA]

---

## 1. OBJETIVO

El panel administrativo de PrestApp permite:

- gestionar usuarios,
- aprobar préstamos,
- monitorear pagos,
- controlar fraude,
- administrar riesgo,
- visualizar métricas,
- y operar la plataforma en tiempo real.

---

## 2. ACCESO ADMINISTRATIVO

## URL

https: //admin.prestapp.com

---

## 3. AUTENTICACIÓN

## Métodos

- email + contraseña
- MFA/OTP
- SSO (futuro)

---

## 4. ROLES Y PERMISOS

| Rol | Acceso |
|
| super_admin | acceso total |
| admin | operación general |
| risk_analyst | scoring/riesgo |
| collections_agent | cobranza |
| support | soporte usuarios |
| finance | pagos/reportes |
| auditor | solo lectura |

---

## 5. DASHBOARD PRINCIPAL

## Métricas visibles

- usuarios activos
- préstamos activos
- mora total
- pagos día
- fraude detectado
- aprobaciones
- rechazos
- ingresos plataforma

---

## 6. MÓDULO USUARIOS

## Funciones

- buscar usuarios
- editar perfil
- bloquear/desbloquear
- ver historial
- validar KYC

---

## Endpoint

GET /admin/users

---

## 7. DETALLE USUARIO

## Información visible

- datos personales
- score riesgo
- préstamos
- pagos
- dispositivos
- eventos fraude
- documentos

---

## 8. MÓDULO PRÉSTAMOS Funciones

- aprobar préstamos
- rechazar préstamos
- revisión manual
- modificar estados
- generar contratos

---

## Estados

| Estado | Descripción |
|
| pending | pendiente |
| approved | aprobado |
| rejected | rechazado |
| disbursed | desembolsado |
| overdue | mora |
| closed | cerrado |

---

## 9. MÓDULO PAGOS

 Funciones

- ver pagos
- validar transacciones
- reversar pagos
- registrar pagos manuales
- exportar reportes

---

## 10. MÓDULO COBRANZA

 Funciones

- cartera vencida
- usuarios mora
- acuerdos pago
- seguimiento cobranza

---

## Clasificación mora

| Nivel | Días |
|
| soft | 1-15 |
| medium | 16-30 |
| hard | 30+ |

---

## 11. MÓDULO RIESGO

 Funciones

- revisar scoring
- validar fraude
- revisión manual
- bloquear solicitudes
- ajustar reglas

---

## 12. MÓDULO ANTIFRAUDE

 Funciones

- alertas fraude
- IP sospechosas
- multi-cuentas
- takeover detection
- eventos riesgo

---

## 13. MÓDULO REPORTES

## Reportes disponibles

- cartera
- mora
- pagos
- ingresos
- fraude
- usuarios
- riesgo

---

## Exportaciones

- CSV
- Excel
- PDF

---

## 14. MÓDULO NOTIFICACIONES

 Funciones

- envío emails
- SMS
- WhatsApp
- push notifications

---

## 15. AUDITORÍA

## Registrar

- accesos admin
- cambios críticos
- aprobaciones
- rechazos
- reversos
- bloqueos usuarios

---

## 16. LOGS ADMINISTRATIVOS

## Eventos registrados

- login admin
- cambios permisos
- modificaciones datos
- cambios scoring
- pagos manuales

---

## 17. CONFIGURACIONES

## Parámetros editables

- tasas interés
- límites crédito
- reglas scoring
- reglas antifraude
- notificaciones

---

## 18. SEGURIDAD PANEL

## Requisitos

- MFA obligatorio
- rate limiting
- IP whitelist
- sesiones seguras
- expiración sesiones
- logs auditoría

---

## 19. TABLAS IMPORTANTES

## admin_users

| Campo | Tipo |
|
| id | integer |
| email | varchar |
| role | varchar |
| status | varchar |
| created_at | timestamp |

---

## admin_logs

| Campo | Tipo |
|
| id | integer |
| admin_id | integer |
| action | varchar |
| entity | varchar |
| metadata | json |
| created_at | timestamp |

---

## 20. ENDPOINTS ADMIN

## Dashboard

GET /admin/dashboard

---

## Usuarios

GET /admin/users

---

## Préstamos

GET /admin/loans

---

## Riesgo

GET /admin/risk

---

## Fraude

GET /admin/fraud

---

## Reportes

GET /admin/reports

---

## 21. KPIs ADMINISTRATIVOS

## Métricas principales

- aprobación créditos
- mora
- fraude
- tiempo aprobación
- recuperación cartera
- pagos exitosos

---

## 22. ESCALABILIDAD

## Recomendaciones

- paginación
- cache
- filtros optimizados
- consultas async

---

## 23. UX ADMIN

 Requisitos

- búsqueda rápida
- filtros avanzados
- dark mode
- responsive
- accesos rápidos

---

## 24. ROADMAP FUTURO

Pendientes:

- BI dashboards
- IA operacional
- workflows automáticos
- analytics avanzados
- monitoreo tiempo real
- multiempresa
