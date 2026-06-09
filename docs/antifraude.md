# Sistema Antifraude — PrestApp

Última actualización: [FECHA]

---

## 1. OBJETIVO

El sistema antifraude de PrestApp tiene como objetivo:

- prevenir fraudes financieros,
- detectar comportamientos sospechosos,
- proteger usuarios,
- evitar pérdidas económicas,
- y asegurar la integridad de la plataforma.

---

## 2. FLUJO GENERAL

Usuario → Validaciones → Análisis riesgo → Detección fraude → Acción automática/manual

---

## 3. TIPOS DE FRAUDE MONITOREADOS

| Tipo | Descripción |
|
| identidad falsa | documentos alterados |
| multi-cuenta | múltiples registros |
| robo identidad | uso datos terceros |
| fraude pagos | transacciones sospechosas |
| bots | automatización |
| abuso promociones | explotación sistema |
| lavado activos | operaciones sospechosas |
| takeover | robo cuentas |

---

## 4. VALIDACIONES DE IDENTIDAD

## Requerimientos

- documento identidad
- selfie
- validación facial
- correo verificado
- teléfono verificado

---

## 5. VALIDACIONES DOCUMENTALES

## Revisar

- calidad imagen
- coincidencia datos
- edición digital
- OCR documento
- duplicados

---

## 6. DETECCIÓN DE DISPOSITIVOS

## Variables monitoreadas

- device_id
- navegador
- sistema operativo
- resolución pantalla
- idioma
- timezone

---

## Alertas

| Evento | Riesgo |
|
| múltiples cuentas mismo dispositivo | alto |
| cambio dispositivo brusco | medio |
| emuladores | crítico |

---

## 7. VALIDACIÓN IP Y GEOLOCALIZACIÓN

## Validar

- IP sospechosa
- VPN
- Proxy
- TOR
- geolocalización inconsistente

---

## Casos riesgo

| Caso | Acción |
|
| IP blacklist | bloquear |
| país restringido | revisión |
| cambios ubicación extremos | alerta |

---

## 8. DETECCIÓN COMPORTAMENTAL

## Eventos monitoreados

- velocidad digitación
- tiempo formularios
- patrones navegación
- clics automatizados
- comportamiento repetitivo

---

## 9. MOTOR DE FRAUDE

## Variables analizadas

- identidad
- score riesgo
- comportamiento
- pagos
- dispositivos
- historial

---

## Resultado fraude

| Fraud Score | Riesgo |
|
| 0-30 | bajo |
| 31-60 | medio |
| 61-80 | alto |
| 81-100 | crítico |

---

## 10. REGLAS AUTOMÁTICAS

## Bloqueo automático

- documentos duplicados
- bots detectados
- fraude confirmado
- listas negras

---

## Revisión manual

- score medio
- inconsistencias leves
- cambios sospechosos

---

## 11. LISTAS RESTRICTIVAS

## Validar contra

- listas AML
- listas OFAC
- listas internas
- usuarios bloqueados

---

## 12. AUTENTICACIÓN SEGURA

## Implementar

- MFA
- OTP
- expiración sesiones
- detección takeover

---

## 13. PROTECCIÓN LOGIN

## Medidas

- rate limiting
- bloqueo temporal
- captcha
- detección fuerza bruta

---

## 14. MONITOREO TRANSACCIONAL

 Revisar

- montos anormales
- pagos repetidos
- frecuencia alta
- cambios método pago

---

## 15. DETECCIÓN MULTICUENTA

## Variables usadas

- teléfono
- email
- IP
- device fingerprint
- documento

---

## 16. EVENTOS ANTIFRAUDE

## Registrar

- login sospechoso
- OTP fallidos
- intentos fraude
- pagos riesgosos
- cambios datos críticos

---

## 17. TABLAS PRINCIPALES

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

## blocked_entities

| Campo | Tipo |
|
| id | integer |
| type | varchar |
| value | varchar |
| reason | text |
| created_at | timestamp |

---

## 18. ENDPOINTS ANTIFRAUDE

## Registrar evento

POST /fraud/event

---

## Obtener score fraude

GET /fraud/score/:userId

---

## Bloquear usuario

POST /fraud/block-user

---

 Revisión manual

POST /fraud/manual-review

---

## 19. ALERTAS AUTOMÁTICAS

## Alertas críticas

- múltiples préstamos rápidos
- IP sospechosa
- pagos anormales
- takeover cuenta

---

## 20. MONITOREO EN TIEMPO REAL

## Herramientas recomendadas

- :contentReference[oaicite:0]{index=0}
- :contentReference[oaicite:1]{index=1}
- :contentReference[oaicite:2]{index=2}

---

## 21. AUDITORÍA Y TRAZABILIDAD

Registrar:

- cambios usuario
- decisiones fraude
- bloqueos
- accesos admin
- cambios score

---

## 22. SEGURIDAD

## Requisitos

- cifrado datos
- acceso restringido
- logs inmutables
- backups
- monitoreo continuo

---

## 23. KPIs ANTIFRAUDE

## Métricas importantes

- fraude detectado
- fraude evitado
- falsos positivos
- cuentas bloqueadas
- chargebacks
- takeover rate

---

## 24. MACHINE LEARNING (FUTURO)

## Modelos futuros

- anomaly detection
- graph fraud detection
- behavioral AI
- transaction prediction

---

## 25. ROADMAP FUTURO

Pendientes:

- biometría facial
- device fingerprint avanzado
- IA antifraude
- open banking validation
- risk engine tiempo real
- behavioral biometrics
