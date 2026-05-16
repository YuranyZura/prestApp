import {
  obtenerPrestamosModel,
  obtenerPrestamoPorIdModel,
  crearPrestamoModel
} from "../models/prestamos.js";

// Obtener todos los préstamos
export const obtenerPrestamos = async (req, res) => {
  try {
    const prestamos = await obtenerPrestamosModel();

    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener préstamos",
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
        mensaje: "Préstamo no encontrado",
      });
    }

    res.status(200).json(prestamo);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el préstamo",
      error: error.message,
    });
  }
};

// Crear préstamo
export const crearPrestamo = async (req, res) => {
  try {
    const nuevoPrestamo = await crearPrestamoModel(req.body);

    res.status(201).json({
      mensaje: "Préstamo creado correctamente",
      prestamo: nuevoPrestamo,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear préstamo",
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
        mensaje: "Préstamo no encontrado",
      });
    }

    await prestamo.update(req.body);

    res.status(200).json({
      mensaje: "Préstamo actualizado correctamente",
      prestamo,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar préstamo",
      error: error.message,
    });
  }
};

// Eliminar préstamo
export const eliminarPrestamo = async (req, res) => {
  try {
    const { id } = req.params;

    const prestamo = await Prestamo.findByPk(id);

    if (!prestamo) {
      return res.status(404).json({
        mensaje: "Préstamo no encontrado",
      });
    }

    await prestamo.destroy();

    res.status(200).json({
      mensaje: "Préstamo eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar préstamo",
      error: error.message,
    });
  }
};