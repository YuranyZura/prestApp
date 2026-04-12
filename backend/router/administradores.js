// Endpoints para la gestión de administradores
import { Router } from "express";
import  conexion from "../config/db.js";

const router = Router();

// GET /api/administradores - Obtener todos los administradores
router.get("/", async (req, res) => {
  try {
    const [rows] = await conexion.query(
      `SELECT id_usuarios, nombre, apellido, correo, rol, verificado, fecha_creacion 
       FROM usuarios 
       WHERE rol = 'administrador' 
       ORDER BY fecha_creacion DESC`
    );
    
    return res.json({ 
      success: true, 
      data: rows 
    });
  } catch (err) {
    console.error("Error al obtener administradores:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});

// GET /api/administradores/:id - Obtener un administrador específico
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await conexion.query(
      `SELECT id_usuarios, nombre, apellido, correo, rol, verificado, fecha_creacion 
       FROM usuarios 
       WHERE id_usuarios = ? AND rol = 'administrador'`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Administrador no encontrado" 
      });
    }
    
    return res.json({ 
      success: true, 
      data: rows[0] 
    });
  } catch (err) {
    console.error("Error al obtener administrador:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});

// POST /api/administradores - Crear un nuevo administrador
router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;
    
    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan datos requeridos" 
      });
    }

    // Verificar si el correo ya existe
    const [existing] = await conexion.query(
      "SELECT id_usuarios FROM usuarios WHERE correo = ?",
      [correo]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Ya existe un usuario con ese correo" 
      });
    }

    // Nota: En producción deberías hashear la contraseña con bcrypt
    const [result] = await conexion.query(
      `INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol, verificado) 
       VALUES (?, ?, ?, ?, 'administrador', 1)`,
      [nombre, apellido, correo, contrasena]
    );
    
    return res.json({ 
      success: true, 
      message: "Administrador creado exitosamente",
      id: result.insertId 
    });
  } catch (err) {
    console.error("Error al crear administrador:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});

// PUT /api/administradores/:id - Actualizar un administrador
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo } = req.body;
    
    if (!nombre || !apellido || !correo) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan datos requeridos" 
      });
    }

    const [result] = await conexion.query(
      `UPDATE usuarios 
       SET nombre = ?, apellido = ?, correo = ? 
       WHERE id_usuarios = ? AND rol = 'administrador'`,
      [nombre, apellido, correo, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Administrador no encontrado" 
      });
    }
    
    return res.json({ 
      success: true, 
      message: "Administrador actualizado exitosamente" 
    });
  } catch (err) {
    console.error("Error al actualizar administrador:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});

// DELETE /api/administradores/:id - Eliminar un administrador
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await conexion.query(
      "DELETE FROM usuarios WHERE id_usuarios = ? AND rol = 'administrador'",
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Administrador no encontrado" 
      });
    }
    
    return res.json({ 
      success: true, 
      message: "Administrador eliminado exitosamente" 
    });
  } catch (err) {
    console.error("Error al eliminar administrador:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});

export default router;