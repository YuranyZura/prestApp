import * as pagosModel from "../models/pagos.model.js";

// ==========================================
// OBTENER PAGOS
// ==========================================

export const obtenerPagos = async (req, res) => {
  try {
    const pagos = await pagosModel.obtenerTodosLosPagos();
    res.json({
      ok: true,
      pagos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error obteniendo pagos"
    });
  }
};

// ==========================================
// OBTENER PAGO POR ID
// ==========================================

export const obtenerPagoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await pagosModel.obtenerPagoPorId(id);
    res.json({
      ok: true,
      pago
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error obteniendo pago"
    });
  }
};

// ==========================================
// CREAR PAGO
// ==========================================

export const crearPago = async (req, res) => {
  try {
    const datos = req.body;
    const result = await pagosModel.crearPagoModel(datos);
    res.status(201).json({
      ok: true,
      id: result.insertId,
      mensaje: "Pago creado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error creando pago"
    });
  }
};

// ==========================================
// ACTUALIZAR PAGO
// ==========================================

export const actualizarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    await pagosModel.actualizarPagoModel(id, datos);
    res.json({
      ok: true,
      mensaje: "Pago actualizado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error actualizando pago"
    });
  }
};

// ==========================================
// ELIMINAR PAGO
// ==========================================

export const eliminarPago = async (req, res) => {
  try {
    const { id } = req.params;
    await pagosModel.eliminarPagoModel(id);
    res.json({
      ok: true,
      mensaje: "Pago eliminado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error eliminando pago"
    });
  }
};
