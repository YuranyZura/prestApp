import { Router } from "express";
import { query } from "../config/db.js";

import { verificarToken } from "../middleware/auth.js";
import { soloTrabajador } from "../middleware/roles.js";

const router = Router();

// ==========================================
// 🔧 FUNCION BASE (REUTILIZABLE)
// ==========================================
async function obtenerResumen(idTrabajador, fecha) {

  const cuotas = await query(`
    SELECT 
      p.id_pagos,
      p.monto_pagos,
      p.metodo_pago,
      p.fecha_pago,
      c.nombre,
      c.cedula
    FROM pagos p
    INNER JOIN prestamos pr
      ON pr.id_prestamos = p.id_prestamos
    INNER JOIN clientes c
      ON c.id_clientes = pr.id_clientes
    WHERE pr.id_trabajador = ?
      AND DATE(p.fecha_pago) = ?
    ORDER BY p.fecha_pago DESC
  `, [idTrabajador, fecha]);

  const totalRecaudado = cuotas.reduce(
    (sum, c) => sum + Number(c.monto_pagos || 0),
    0
  );

  const totalCuotas = cuotas.length;

  const clientes = await query(`
    SELECT COUNT(DISTINCT pr.id_clientes) total
    FROM pagos p
    INNER JOIN prestamos pr
      ON pr.id_prestamos = p.id_prestamos
    WHERE pr.id_trabajador = ?
      AND DATE(p.fecha_pago) = ?
  `, [idTrabajador, fecha]);

  const clientesAtendidos = clientes[0]?.total || 0;

  const promedio =
    clientesAtendidos > 0
      ? totalRecaudado / clientesAtendidos
      : 0;

  return {
    totalRecaudado,
    totalCuotas,
    clientesAtendidos,
    promedio,
    cuotas
  };
}

// ==========================================
// 🔍 OBTENER ID TRABAJADOR DESDE TOKEN
// ==========================================
async function getTrabajadorId(userId) {

  const rows = await query(
    "SELECT id_trabajador FROM trabajadores WHERE id_usuario = ? LIMIT 1",
    [userId]
  );

  if (!rows.length) return null;

  return rows[0].id_trabajador;
}

// ==========================================
// 📅 RESUMEN HOY
// ==========================================
router.get(
  "/resumen-hoy",
  verificarToken,
  soloTrabajador,
  async (req, res) => {

    try {

      const userId = req.usuario.id;

      const idTrabajador = await getTrabajadorId(userId);

      if (!idTrabajador) {
        return res.status(404).json({
          success: false,
          message: "Trabajador no encontrado"
        });
      }

      const hoy = new Date().toISOString().slice(0, 10);

      const data = await obtenerResumen(idTrabajador, hoy);

      res.json({
        success: true,
        ...data
      });

    } catch (error) {
      console.error("❌ resumen-hoy:", error.message);

      res.status(500).json({
        success: false,
        message: "Error del servidor"
      });
    }
  }
);

// ==========================================
// 📅 RESUMEN POR FECHA
// ==========================================
router.get(
  "/resumen-dia",
  verificarToken,
  soloTrabajador,
  async (req, res) => {

    try {

      const { fecha } = req.query;

      if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return res.status(400).json({
          success: false,
          message: "Fecha inválida"
        });
      }

      const userId = req.usuario.id;

      const idTrabajador = await getTrabajadorId(userId);

      if (!idTrabajador) {
        return res.status(404).json({
          success: false,
          message: "Trabajador no encontrado"
        });
      }

      const data = await obtenerResumen(idTrabajador, fecha);

      res.json({
        success: true,
        ...data
      });

    } catch (error) {
      console.error("❌ resumen-dia:", error.message);

      res.status(500).json({
        success: false,
        message: "Error del servidor"
      });
    }
  }
);

// ==========================================
// 📄 HISTORIAL CLIENTE
// ==========================================
router.get(
  "/cliente/:id",
  verificarToken,
  async (req, res) => {

    try {

      const { id } = req.params;

      if (!Number.isInteger(Number(id))) {
        return res.status(400).json({
          success: false,
          message: "ID inválido"
        });
      }

      const rows = await query(`
        SELECT 
          p.id_pagos,
          p.monto_pagos,
          p.metodo_pago,
          p.fecha_pago,
          pr.id_prestamos,
          pr.monto
        FROM pagos p
        INNER JOIN prestamos pr
          ON pr.id_prestamos = p.id_prestamos
        WHERE pr.id_clientes = ?
        ORDER BY p.fecha_pago DESC
      `, [id]);

      res.json({
        success: true,
        cuotas: rows
      });

    } catch (error) {
      console.error("❌ historial cliente:", error.message);

      res.status(500).json({
        success: false,
        message: "Error del servidor"
      });
    }
  }
);

export default router;