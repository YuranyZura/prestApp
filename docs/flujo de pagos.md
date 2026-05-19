# Flujo de Pagos — PrestApp

Última actualización: [FECHA]

---

## 1. OBJETIVO

El flujo de pagos de PrestApp permite:

- recibir pagos de cuotas,
- registrar transacciones,
- actualizar saldos,
- controlar mora,
- generar comprobantes,
- y mantener trazabilidad financiera.

---

## 2. FLUJO GENERAL

Usuario → Selección préstamo → Generación pago → Pasarela → Confirmación → Aplicación pago → Actualización saldo

---

## 3. TIPOS DE PAGOS

## Tipos soportados

| Tipo | Descripción |
|
| cuota parcial | pago parcial |
| cuota completa | pago cuota |
| pago anticipado | abono capital |
| pago total | cierre préstamo |
| mora | intereses mora |

---

## 4. MÉTODOS DE PAGO

## Métodos habilitados

- PSE
- transferencia bancaria
- tarjeta débito
- tarjeta crédito
- billeteras digitales
- efectivo/recaudo

---

## 5. CREACIÓN DE PAGO

## Endpoint

POST /payments/create

---

## Request

```json id="k5t92s"
{
  "loanId": 1,
  "amount": 150000,
  "paymentMethod": "PSE"
}
