import * as trabajadoresModel from "../models/trabajadores.model.js";

// ==========================================
// OBTENER TODOS
// ==========================================

export const obtenerTrabajadores = async (req, res) => {
  try {
    const trabajadores = await trabajadoresModel.obtenerTodosLosTrabajadores();
    res.json({
      success: true,
      trabajadores
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo trabajadores"
    });
  }
};

// ==========================================
// OBTENER POR ID
// ==========================================

export const obtenerTrabajadorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const trabajador = await trabajadoresModel.obtenerTrabajadorPorId(id);
    if (!trabajador) {
      return res.status(404).json({
        success: false,
        message: "Trabajador no encontrado"
      });
    }
    res.json({
      success: true,
      trabajador
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo trabajador"
    });
  }
};

// ==========================================
// CREAR
// ==========================================

export const crearTrabajador = async (req, res) => {
  try {
    const result = await trabajadoresModel.crearTrabajadorModel(req.body);
    res.status(201).json({
      success: true,
      id: result.insertId,
      message: "Trabajador creado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creando trabajador"
    });
  }
};

// ==========================================
// ACTUALIZAR
// ==========================================

export const actualizarTrabajador = async (req, res) => {
  try {
    const { id } = req.params;
    await trabajadoresModel.actualizarTrabajadorModel(id, req.body);
    res.json({
      success: true,
      message: `Trabajador ${id} actualizado correctamente`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error actualizando trabajador"
    });
  }
};

// ==========================================
// ELIMINAR
// ==========================================

export const eliminarTrabajador = async (req, res) => {
  try {
    const { id } = req.params;
    await trabajadoresModel.eliminarTrabajadorModel(id);
    res.json({
      success: true,
      message: `Trabajador ${id} eliminado correctamente`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error eliminando trabajador"
    });
  }
};