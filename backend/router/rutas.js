// ==========================================
// backend/router/rutas.js
// PRESTAPP - RUTAS / GEOLOCALIZACIÓN
// ==========================================

import { Router } from "express";
import pool from "../config/db.js";
import { verificarToken } from "../middleware/auth.js";
import { soloTrabajador, soloAdmin } from "../middleware/roles.js";

const router = Router();

// ==========================================
// 📍 CLIENTES DEL DÍA (RUTA DE COBRO)
// GET /api/rutas/hoy
// ==========================================
router.get(
  "/hoy",
  verificarToken,
  soloTrabajador,
  async (req, res) => {
    try {
      const usuarioId = req.usuario.id;

      // Obtener trabajador
      const [trabajador] = await pool.query(
        `SELECT id_trabajador 
         FROM trabajadores 
         WHERE id_usuario = ? 
         LIMIT 1`,
        [usuarioId]
      );

      if (!trabajador.length) {
        return res.status(403).json({
          success: false,
          message: "No eres trabajador"
        });
      }

      const idTrabajador = trabajador[0].id_trabajador;

      // Clientes con préstamos activos HOY
      const [rows] = await pool.query(`
        SELECT DISTINCT
          c.id_clientes,
          c.nombre,
          c.apellido,
          c.telefono,
          c.direccion,
          c.latitud,
          c.longitud,
          SUM(p.cuota_diaria) AS cuotaHoy
        FROM clientes c
        INNER JOIN prestamos p 
          ON p.id_clientes = c.id_clientes
        WHERE p.id_trabajador = ?
          AND p.estado = 'activo'
          AND p.fecha_inicio <= CURDATE()
          AND p.fecha_final >= CURDATE()
        GROUP BY c.id_clientes
        ORDER BY c.nombre ASC
      `, [idTrabajador]);

      res.json({
        success: true,
        clientes: rows
      });

    } catch (error) {
      console.error("Error en rutas/hoy:", error);
      res.status(500).json({
        success: false,
        message: "Error obteniendo ruta"
      });
    }
  }
);

// ==========================================
// 📍 GUARDAR UBICACIÓN DEL TRABAJADOR
// POST /api/rutas/ubicacion
// ==========================================
router.post(
  "/ubicacion",
  verificarToken,
  soloTrabajador,
  async (req, res) => {
    try {
      const { lat, lng } = req.body;

      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: "Latitud y longitud requeridas"
        });
      }

      const usuarioId = req.usuario.id;

      const [trabajador] = await pool.query(
        `SELECT id_trabajador 
         FROM trabajadores 
         WHERE id_usuario = ? 
         LIMIT 1`,
        [usuarioId]
      );

      if (!trabajador.length) {
        return res.status(403).json({
          success: false,
          message: "No autorizado"
        });
      }

      const idTrabajador = trabajador[0].id_trabajador;

      await pool.query(`
        INSERT INTO ubicaciones 
        (id_trabajador, latitud, longitud, fecha)
        VALUES (?, ?, ?, NOW())
      `, [idTrabajador, lat, lng]);

      res.json({
        success: true,
        message: "Ubicación guardada"
      });

    } catch (error) {
      console.error("Error guardando ubicación:", error);
      res.status(500).json({
        success: false,
        message: "Error guardando ubicación"
      });
    }
  }
);

// ==========================================
// 📍 HISTORIAL DE UBICACIONES (ADMIN)
// GET /api/rutas/historial/:id
// ==========================================
router.get(
  "/historial/:id",
  verificarToken,
  soloAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await pool.query(`
        SELECT latitud, longitud, fecha
        FROM ubicaciones
        WHERE id_trabajador = ?
        ORDER BY fecha DESC
        LIMIT 100
      `, [id]);

      res.json({
        success: true,
        ubicaciones: rows
      });

    } catch (error) {
      console.error("Error historial:", error);
      res.status(500).json({
        success: false,
      });
    }
  }
);

export default router;