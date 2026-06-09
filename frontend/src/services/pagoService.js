import axios from "axios";
import API from "../config/api";

// ==========================================
// CONFIGURACIÓN TOKEN
// ==========================================

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// ==========================================
// OBTENER TODOS LOS PAGOS
// ==========================================

export const obtenerPagos = async () => {
  const response = await axios.get(
    `${API}/pagos`,
    getHeaders()
  );

  return response.data;
};

// ==========================================
// OBTENER PAGO POR ID
// ==========================================

export const obtenerPago = async (id) => {
  const response = await axios.get(
    `${API}/pagos/${id}`,
    getHeaders()
  );

  return response.data;
};

// ==========================================
// CREAR PAGO
// ==========================================

export const crearPago = async (datos) => {
  const response = await axios.post(
    `${API}/pagos`,
    datos,
    getHeaders()
  );

  return response.data;
};

// ==========================================
// ACTUALIZAR PAGO
// ==========================================

export const actualizarPago = async (
  id,
  datos
) => {
  const response = await axios.put(
    `${API}/pagos/${id}`,
    datos,
    getHeaders()
  );

  return response.data;
};

// ==========================================
// ELIMINAR PAGO
// ==========================================

export const eliminarPago = async (id) => {
  const response = await axios.delete(
    `${API}/pagos/${id}`,
    getHeaders()
  );

  return response.data;
};

// ==========================================
// REGISTRAR COBRO
// ==========================================

export const registrarCobro = async (
  prestamoId,
  valor
) => {
  const response = await axios.post(
    `${API}/pagos/cobro`,
    {
      prestamoId,
      valor
    },
    getHeaders()
  );

  return response.data;
};