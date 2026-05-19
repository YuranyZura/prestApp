# Flujo de Préstamos — PrestApp

Última actualización: [FECHA]

---

## 1. OBJETIVO

El flujo de préstamos de PrestApp permite:

1. Registrar usuarios
2. Validar identidad
3. Solicitar crédito
4. Evaluar riesgo
5. Aprobar/rechazar
6. Desembolsar
7. Gestionar pagos
8. Controlar mora

---

## 2. FLUJO GENERAL

Usuario → Solicitud → Validación → Score → Decisión → Contrato → Desembolso → Cobranza → Cierre

---

## 3. REGISTRO DE USUARIO

## Endpoint

POST /auth/register

## Datos requeridos

- nombre completo
- email
- teléfono
- documento identidad
- contraseña

## Validaciones

- email único
- teléfono válido
- contraseña segura
- documento único

## Resultado

Usuario creado con estado:

PENDING_VERIFICATION

---

## 4. VERIFICACIÓN DE IDENTIDAD (KYC)

## Objetivo

Validar identidad del usuario antes de otorgar crédito.

## Información requerida

- cédula
- selfie
- comprobante ingresos
- extractos
- referencias

## Estados posibles

| Estado | Descripción |

| pending | pendiente |
| verified | validado |
| rejected | rechazado |

 Endpoint

POST /kyc/upload

---

## 5. CREACIÓN DE SOLICITUD

 Endpoint

POST /loans/create

## Body

{
  "amount": 500000,
  "term": 30,
  "purpose": "Capital de trabajo"
}

---

## 6. VALIDACIONES DE NEGOCIO

Antes de evaluar:

 Validaciones

- usuario verificado
- sin mora activa
- límite disponible
- edad válida
- documentos completos

## Reglas ejemplo

- mínimo préstamo: $50.000
- máximo préstamo: $5.000.000
- plazo máximo: 24 meses

---

## 7. MOTOR DE SCORING

## Variables evaluadas

- ingresos
- historial pagos
- comportamiento
- antigüedad
- riesgo fraude
- ubicación
- score interno

## Resultado score

| Score | Riesgo |
|
| 800-1000 | bajo |
| 600-799 | medio |
| <600 | alto |

---

## 8. DECISIÓN CREDITICIA

 Estados posibles

| Estado | Descripción |
|
| pending | pendiente |
| approved | aprobado |
| rejected | rechazado |
| manual_review | revisión manual |

---

## 9. APROBACIÓN

 Endpoint

POST /loans/:id/approve

## Backend realiza

1. cálculo intereses
2. generación cronograma
3. contrato
4. actualización estado

## Estado final

APPROVED

---

## 10. RECHAZO

 Endpoint

POST /loans/:id/reject

## Razones posibles

- score bajo
- fraude
- documentos inválidos
- ingresos insuficientes

---

## 11. GENERACIÓN DE CONTRATO

 Generar:

- PDF contrato
- pagaré
- consentimiento habeas data

## Firma

- OTP
- firma digital
- aceptación checkbox

---

## 12. DESEMBOLSO

 Endpoint

POST /disbursements/create

## Métodos

- transferencia bancaria
- billetera digital
- ACH

## Estados

| Estado | Descripción |
|
| pending | pendiente |
| processing | procesando |
| completed | desembolsado |
| failed | error |

---

## 13. CRONOGRAMA DE PAGOS

## Generar automáticamente

- capital
- intereses
- fechas vencimiento
- mora

## Tabla ejemplo

| Cuota | Fecha | Valor |
|
| 1 | 2026-06-01 | 120000 |
| 2 | 2026-07-01 | 120000 |

---

## 14. PAGOS

 Endpoint

POST /payments/create

## Métodos permitidos

- PSE
- tarjeta
- transferencia
- efectivo
 Validaciones

- cuota válida
- préstamo activo
- monto correcto

---

## 15. MORA

## Reglas

Después de fecha vencimiento:

- aplicar interés mora
- notificaciones
- bloqueo nuevos créditos

## Estados mora

| Estado | Días |
|
| soft | 1-15 |
| medium | 16-30 |
| hard | 30+ |

---

## 16. COBRANZA

## Acciones automáticas

- email
- SMS
- WhatsApp
- llamadas

## Escalamiento

1. recordatorio
2. cobranza preventiva
3. cobranza jurídica

---

## 17. CIERRE DEL PRÉSTAMO

## Condiciones

- saldo = 0
- cuotas pagadas
- sin mora

 Estado final

CLOSED

---

## 18. EVENTOS IMPORTANTES (LOGS)

Registrar:

- login
- creación préstamo
- aprobación
- rechazo
- pagos
- mora
- fraude
- cambios estado

---

## 19. SEGURIDAD

## Implementar

- rate limiting
- antifraude
- auditoría
- logs
- validación backend
- cifrado documentos

---

## 20. MÉTRICAS IMPORTANTES

## KPIs

- tasa aprobación
- mora
- default
- CAC
- tiempo aprobación
- ticket promedio
- pagos exitosos
- abandono solicitud

---

## 21. FLUJO FUTURO

Pendientes:

- IA scoring
- Open Banking
- biometría
- antifraude avanzado
- underwriting automático
- marketplace financiero
