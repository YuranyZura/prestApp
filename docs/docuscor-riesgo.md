# Sistema de Scoring y Riesgo — PrestApp

Última actualización: [FECHA]

---

## 1. OBJETIVO

El sistema de scoring de PrestApp evalúa el riesgo crediticio de cada usuario para:

- aprobar o rechazar préstamos,
- definir montos,
- calcular tasas,
- detectar fraude,
- reducir mora,
- y proteger la operación financiera.

---

## 2. FLUJO GENERAL

Usuario → Recolección datos → Validaciones → Score → Clasificación riesgo → Decisión

---

## 3. FUENTES DE DATOS

## Datos del usuario

- nombre
- edad
- ciudad
- documento
- teléfono
- email

---

## Datos financieros

- ingresos
- egresos
- capacidad pago
- extractos bancarios
- historial créditos

---

## Datos de comportamiento

- tiempo sesión
- frecuencia uso
- dispositivos
- IP
- geolocalización
- intentos fallidos

---

## Datos operativos

- mora histórica
- pagos anteriores
- préstamos activos
- comportamiento pagos

---

## 4. VARIABLES DE RIESGO

| Variable | Peso |
|
| ingresos | 25% |
| historial pagos | 25% |
| endeudamiento | 15% |
| estabilidad laboral | 10% |
| fraude | 10% |
| comportamiento app | 10% |
| antigüedad usuario | 5% |

---

## 5. MODELO DE SCORE

## Escala

0 → 1000

---

## Clasificación

| Score | Riesgo | Acción |
|
| 850-1000 | Muy bajo | aprobación inmediata |
| 700-849 | Bajo | aprobación |
| 600-699 | Medio | revisión |
| 450-599 | Alto | restricciones |
| <450 | Muy alto | rechazo |

---

## 6. REGLAS DE NEGOCIO

## Reglas automáticas rechazo

- documento duplicado
- fraude detectado
- mora activa
- ingresos insuficientes
- listas restrictivas

---

## Reglas aprobación

- score > 700
- capacidad pago suficiente
- KYC validado

---

## Reglas revisión manual

- score intermedio
- inconsistencias
- documentos dudosos

---

## 7. CÁLCULO DE CAPACIDAD DE PAGO

## Fórmula

Capacidad = ingresos - gastos - obligaciones

---

## Regla máxima

Cuota préstamo <= 35% ingresos mensuales

---

## 8. DETECCIÓN DE FRAUDE

## Variables analizadas

- múltiples cuentas
- IP sospechosa
- VPN/Proxy
- documentos alterados
- comportamiento automatizado
- dispositivo compartido

---

## Alertas fraude

| Evento | Riesgo |
|
| múltiples registros | alto |
| OTP fallidos | medio |
| cambios IP frecuentes | medio |
| documentos inválidos | crítico |

---

## 9. SCORING COMPORTAMENTAL

## Eventos monitoreados

- velocidad digitación
- navegación
- tiempo formularios
- patrones sospechosos

---

## 10. MOTOR DE DECISIÓN

## Entrada

Datos usuario + score + fraude

## Salida

| Resultado | Acción |
|
| APPROVED | aprobar |
| REJECTED | rechazar |
| REVIEW | revisión manual |

---

## 11. TASAS SEGÚN RIESGO

| Riesgo | Tasa |
|
| Bajo | menor |
| Medio | estándar |
| Alto | mayor |

---

## 12. LÍMITES DE CRÉDITO

## Variables usadas

- score
- ingresos
- historial
- comportamiento

---

## Ejemplo

| Score | Límite |
|
| 850+ | $5.000.000 |
| 700+ | $2.000.000 |
| 600+ | $800.000 |

---

## 13. TABLAS RELACIONADAS

## risk_scores

| Campo | Tipo |
|
| id | integer |
| user_id | integer |
| score | integer |
| level | varchar |
| fraud_score | integer |
| notes | text |
| created_at | timestamp |

---

## fraud_events

| Campo | Tipo |
|
| id | integer |
| user_id | integer |
| event_type | varchar |
| risk_level | varchar |
| metadata | json |
| created_at | timestamp |

---

## 14. ENDPOINTS SCORING

## Generar score

POST /risk/calculate

---

## Obtener score usuario

GET /risk/user/:id

---

## Eventos fraude

POST /risk/fraud-event

---

## Revisión manual

POST /risk/manual-review

---

## 15. LOGS Y AUDITORÍA

Registrar:

- score generado
- cambios score
- aprobaciones
- rechazos
- fraude detectado
- revisiones manuales

---

## 16. MACHINE LEARNING (FUTURO)

## Posibles modelos

- regresión logística
- random forest
- XGBoost
- redes neuronales

---

## Variables futuras

- open banking
- comportamiento financiero
- biometría
- redes transaccionales

---

## 17. KPIs DE RIESGO

## Métricas críticas

- default rate
- tasa mora
- fraude detectado
- aprobación
- falsos positivos
- recuperación cartera

---

## 18. SEGURIDAD

## Requisitos

- cifrado datos sensibles
- acceso restringido
- auditoría completa
- backups
- anonimización parcial

---

## 19. CUMPLIMIENTO

## Validar normativas

- habeas data
- protección datos
- SARLAFT (si aplica)
- KYC
- AML

---

## 20. ROADMAP FUTURO

Pendientes:

- IA antifraude
- scoring dinámico
- open finance
- biometría facial
- score predictivo
- análisis tiempo real
