# Eventos y Logs Críticos — PrestApp

Última actualización: [FECHA]

---

## 1. OBJETIVO

El sistema de eventos y logs críticos de PrestApp permite:

- auditoría completa,
- monitoreo operacional,
- detección de fraude,
- trazabilidad financiera,
- análisis de incidentes,
- cumplimiento regulatorio,
- y recuperación ante fallos.

---

## 2. PRINCIPIOS

 Todo evento crítico debe:

- registrarse,
- tener timestamp,
- incluir usuario responsable,
- guardar metadata,
- permitir trazabilidad,
- y ser inmutable.

---

## 3. TIPOS DE EVENTOS

| Categoría | Descripción |
|
| auth | autenticación |
| loans | préstamos |
| payments | pagos |
| fraud | antifraude |
| admin | acciones administrativas |
| risk | scoring/riesgo |
| system | infraestructura |
| security | seguridad |
| notifications | notificaciones |

---

## 4. ESTRUCTURA ESTÁNDAR LOG

## Formato JSON

```json id="m0fq4n"
{
  "event": "loan_approved",
  "userId": 123,
  "adminId": 10,
  "timestamp": "2026-05-17T10:00:00Z",
  "ip": "192.168.1.1",
  "device": "Chrome Windows",
  "metadata": {
    "loanId": 88,
    "amount": 500000
  }
}
