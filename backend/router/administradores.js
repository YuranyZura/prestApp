// Endpoints para la gestión de administradores
import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

// 📍 GET TODOS
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_usuarios, nombre, apellido, correo, rol, verificado, fecha_creacion 
      FROM usuarios 
      WHERE rol = 'administrador' 
      ORDER BY fecha_creacion DESC
    `);

    res.json({ success: true, data: rows });

  } catch (err) {
    console.error("Error GET administradores:", err.message);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// 📍 GET POR ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT id_usuarios, nombre, apellido, correo, rol, verificado, fecha_creacion 
      FROM usuarios 
      WHERE id_usuarios = ? AND rol = 'administrador'
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Administrador no encontrado" });
    }

    res.json({ success: true, data: rows[0] });

  } catch (err) {
    console.error("Error GET por ID:", err.message);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// 📍 CREAR
router.post("/", async (req, res) => {
  const { nombre, apellido, correo, contrasena } = req.body;

  if (!nombre || !apellido || !correo || !contrasena) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id_usuarios FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Correo ya existe" });
    }

    const [result] = await pool.query(`
      INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol, verificado) 
      VALUES (?, ?, ?, ?, 'administrador', 1)
    `, [nombre, apellido, correo, contrasena]);

    res.json({
      success: true,
      message: "Administrador creado",
      id: result.insertId
    });

  } catch (err) {
    console.error("Error POST:", err.message);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// 📍 ACTUALIZAR
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }

  if (!nombre || !apellido || !correo) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  try {
    const [result] = await pool.query(`
      UPDATE usuarios 
      SET nombre = ?, apellido = ?, correo = ? 
      WHERE id_usuarios = ? AND rol = 'administrador'
    `, [nombre, apellido, correo, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "No encontrado" });
    }

    res.json({ success: true, message: "Actualizado correctamente" });

  } catch (err) {
    console.error("Error PUT:", err.message);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// 📍 ELIMINAR
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }

  try {
    const [result] = await pool.query(
      "DELETE FROM usuarios WHERE id_usuarios = ? AND rol = 'administrador'",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "No encontrado" });
    }

    res.json({ success: true, message: "Eliminado correctamente" });

  } catch (err) {
    console.error("Error DELETE:", err.message);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

export default router;