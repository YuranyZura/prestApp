import * as trabajadoresModel
from "../models/trabajadores.model.js";

// ==========================================
// OBTENER TODOS
// ==========================================

export const obtenerTrabajadores =
async (req, res) => {

  try {

    const trabajadores =
      await trabajadoresModel
      .obtenerTrabajadores();

    res.json({

      success: true,

      trabajadores
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false
    });
  }
};

// ==========================================
// OBTENER POR ID
// ==========================================

export const obtenerTrabajadorPorId =
async (req, res) => {

  try {

    const { id } = req.params;

    const trabajador =
      await trabajadoresModel
      .obtenerTrabajadorPorId(id);

    res.json({

      success: true,

      trabajador
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false
    });
  }
};

// ==========================================
// CREAR
// ==========================================

export const crearTrabajador =
async (req, res) => {

  try {

    const trabajador =
      await trabajadoresModel
      .crearTrabajador(req.body);

    res.status(201).json({

      success: true,

      trabajador
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false
    });
  }
};

// ==========================================
// ACTUALIZAR
// ==========================================

export const actualizarTrabajador =
async (req, res) => {

  try {

    const { id } = req.params;

    res.json({

      success: true,

      message:
        `Trabajador ${id} actualizado`
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false
    });
  }
};

// ==========================================
// ELIMINAR
// ==========================================

export const eliminarTrabajador =
async (req, res) => {

  try {

    const { id } = req.params;

    res.json({

      success: true,

      message:
        `Trabajador ${id} eliminado`
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false
    });
  }
};