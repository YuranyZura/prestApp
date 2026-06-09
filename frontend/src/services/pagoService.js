import { apiGet, apiPost, apiPut, apiDelete } from "../config/api";

export const obtenerPagos = async () => {
  return apiGet("/pagos");
};

export const obtenerPago = async (id) => {
  return apiGet(`/pagos/${id}`);
};

export const crearPago = async (datos) => {
  return apiPost("/pagos", datos);
};

export const actualizarPago = async (id, datos) => {
  return apiPut(`/pagos/${id}`, datos);
};

export const eliminarPago = async (id) => {
  return apiDelete(`/pagos/${id}`);
};

export const registrarCobro = async (prestamoId, valor) => {
  return apiPost("/pagos", {
    id_prestamo: prestamoId,
    monto_pagado: valor,
    metodo_pago: "efectivo"
  });
};