// ==========================================
// backend/router/trabajadores.js
// PRESTAPP - TRABAJADORES PRO
// ==========================================

import { Router } from "express";
import pool from "../config/db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { verificarToken } from "../middleware/auth.js";
import { soloAdmin, soloSuperAdmin } from "../middleware/roles.js";
import { uploadsDir } from "../config/uploads.js";

const router = Router();

// ==========================================
// MULTER CONFIG
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "trabajador-" + unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ==========================================
// 📍 CREAR TRABAJADOR
// POST /api/trabajadores
// ==========================================
router.post(
  "/",
  verificarToken,
  soloAdmin,
  upload.single("foto"),
  async (req, res) => {
    try {
      const {
        nombre,
        apellido,
        cedula,
        fechaNacimiento,
        direccion,
        celular,
        correo
      } = req.body;

      if (!nombre || !apellido || !cedula) {
        return res.status(400).json({
          success: false,
          message: "Campos obligatorios faltantes"
        });
      }

      if (!/^\d{4,20}$/.test(cedula)) {
        return res.status(400).json({
          success: false,
          message: "Cédula inválida"
        });
      }

      const foto = req.file ? req.file.filename : null;

      const [result] = await pool.query(
        `INSERT INTO trabajadores
        (nombre, apellido, cedula, fecha_nacimiento, direccion, telefono, correo, foto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nombre,
          apellido,
          cedula,
          fechaNacimiento || null,
          direccion || null,
          celular || null,
          correo || null,
          foto
        ]
      );

      res.json({
        success: true,
        id: result.insertId
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error creando trabajador"
      });
    }
  }
);

// ==========================================
// 📍 LISTAR TRABAJADORES
// GET /api/trabajadores
// ==========================================
router.get(
  "/",
  verificarToken,
  soloAdmin,
  async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT *
        FROM trabajadores
        ORDER BY id_trabajador DESC
      `);

      res.json({
        success: true,
        trabajadores: rows
      });

    } catch (error) {
      res.status(500).json({
        success: false
      });
    }
  }
);

// ==========================================
// 📍 OBTENER POR ID
// ==========================================
router.get(
  "/:id",
  verificarToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await pool.query(
        `SELECT * FROM trabajadores WHERE id_trabajador = ?`,
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "No encontrado"
        });
      }

      res.json({
        success: true,
        trabajador: rows[0]
      });

    } catch (error) {
      res.status(500).json({
        success: false
      });
    }
  }
);

// ==========================================
// 📍 ACTUALIZAR
// ==========================================
router.put(
  "/:id",
  verificarToken,
  soloAdmin,
  upload.single("foto"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        cedula,
        nombre,
        apellido,
        telefono,
        correo,
        direccion,
        fecha_nacimiento
      } = req.body;

      const sets = [];
      const values = [];

      if (cedula) {
        if (!/^\d{4,20}$/.test(cedula)) {
          return res.status(400).json({
            success: false,
            message: "Cédula inválida"
          });
        }
        sets.push("cedula=?");
        values.push(cedula);
      }

      if (nombre) {
        sets.push("nombre=?");
        values.push(nombre);
      }

      if (apellido) {
        sets.push("apellido=?");
        values.push(apellido);
      }

      if (telefono) {
        sets.push("telefono=?");
        values.push(telefono);
      }

      if (correo) {
        sets.push("correo=?");
        values.push(correo);
      }

      if (direccion) {
        sets.push("direccion=?");
        values.push(direccion);
      }

      if (fecha_nacimiento) {
        sets.push("fecha_nacimiento=?");
        values.push(fecha_nacimiento);
      }

      if (req.file) {
        sets.push("foto=?");
        values.push(req.file.filename);
      }

      if (!sets.length) {
        return res.status(400).json({
          success: false,
          message: "Nada para actualizar"
        });
      }

      await pool.query(
        `UPDATE trabajadores SET ${sets.join(",")} WHERE id_trabajador = ?`,
        [...values, id]
      );

      res.json({
        success: true,
        message: "Actualizado correctamente"
      });

    } catch (error) {
      res.status(500).json({
        success: false
      });
    }
  }
);

// ==========================================
// 📍 ELIMINAR
// ==========================================
router.delete(
  "/:id",
  verificarToken,
  soloSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await pool.query(
        `DELETE FROM trabajadores WHERE id_trabajador = ?`,
        [id]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "No encontrado"
        });
      }

      res.json({
        success: true,
        message: "Eliminado"
      });

    } catch (error) {
      res.status(500).json({
        success: false
      });
    }
  }
);

export default router;