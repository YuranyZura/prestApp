import {
  obtenerPrestamosModel,
  obtenerPrestamoPorIdModel,
  crearPrestamoModel,
  actualizarPrestamoModel,
  eliminarPrestamoModel
} from "../models/prestamo.model.js";

// Obtener todos los préstamos
export const obtenerPrestamos = async (req, res) => {
  try {
    const prestamos = await obtenerPrestamosModel();

    res.status(200).json({
      success: true,
      prestamos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener préstamos",
      error: error.message,
    });
  }
};

// Obtener un préstamo por ID
export const obtenerPrestamoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const prestamo = await obtenerPrestamoPorIdModel(id);

    if (!prestamo) {
      return res.status(404).json({
        success: false,
        message: "Préstamo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      prestamo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el préstamo",
      error: error.message,
    });
  }
};

// Crear préstamo
export const crearPrestamo = async (req, res) => {
  try {
    const result = await crearPrestamoModel(req.body);

    res.status(201).json({
      success: true,
      message: "Préstamo creado correctamente",
      prestamo: { id_prestamo: result.insertId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear préstamo",
      error: error.message,
    });
  }
};

// Actualizar préstamo
export const actualizarPrestamo = async (req, res) => {
  try {
    const { id } = req.params;

    const prestamo = await obtenerPrestamoPorIdModel(id);

    if (!prestamo) {
      return res.status(404).json({
        success: false,
        message: "Préstamo no encontrado",
      });
    }

    await actualizarPrestamoModel(id, req.body);
    const prestamoActualizado = await obtenerPrestamoPorIdModel(id);

    res.status(200).json({
      success: true,
      message: "Préstamo actualizado correctamente",
      prestamo: prestamoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar préstamo",
      error: error.message,
    });
  }
};

// Eliminar préstamo
export const eliminarPrestamo = async (req, res) => {
  try {
    const { id } = req.params;

    const prestamo = await obtenerPrestamoPorIdModel(id);

    if (!prestamo) {
      return res.status(404).json({
        success: false,
        message: "Préstamo no encontrado",
      });
    }

    await eliminarPrestamoModel(id);

    res.status(200).json({
      success: true,
      message: "Préstamo eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar préstamo",
      error: error.message,
    });
  }
};