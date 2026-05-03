// ==========================================
// backend/router/dashboard.js
// DASHBOARD MYSQL REAL - PRESTAPP
// ==========================================

import express from "express";
import db from "../config/db.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// 🔐 RESUMEN PRINCIPAL
// GET /api/dashboard/resumen
// ==========================================
router.get("/resumen", verificarToken, async (req, res) => {
  try {
    // ======================================
    // TOTAL CLIENTES
    // ======================================
    const [clientes] = await db.query(`
      SELECT COUNT(*) AS total
      FROM clientes
    `);

    // ======================================
    // PRÉSTAMOS ACTIVOS
    // ======================================
    const [prestamos] = await db.query(`
      SELECT COUNT(*) AS total
      FROM prestamos
      WHERE estado = 'activo'
    `);

    // ======================================
    // CLIENTES EN MORA
    // ======================================
    const [mora] = await db.query(`
      SELECT COUNT(*) AS total
      FROM prestamos
      WHERE estado = 'mora'
    `);

    // ======================================
    // RECAUDADO HOY
    // ======================================
    const [pagosHoy] = await db.query(`
      SELECT IFNULL(SUM(monto),0) AS total
      FROM pagos
      WHERE DATE(fecha_pago)=CURDATE()
    `);

    // ======================================
    // RESPUESTA
    // ======================================
    res.json({
      success: true,
      data: {
        clientes: clientes[0].total,
        prestamos: prestamos[0].total,
        mora: mora[0].total,
        pagosHoy: pagosHoy[0].total
      }
    });

  } catch (error) {
    console.error("❌ Error resumen dashboard:", error);

    res.status(500).json({
      success: false,
      message: "Error cargando dashboard"
    });
  }
});

// ==========================================
// 📋 ÚLTIMOS PAGOS
// GET /api/dashboard/ultimos-pagos
// ==========================================
router.get("/ultimos-pagos", verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        c.nombre,
        p.monto,
        p.fecha_pago
      FROM pagos p
      INNER JOIN clientes c
        ON c.id = p.cliente_id
      ORDER BY p.fecha_pago DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("❌ Error últimos pagos:", error);

    res.status(500).json({
      success: false,
      message: "Error cargando pagos"
    });
  }
});

// ==========================================
// ⚠️ CLIENTES EN MORA
// GET /api/dashboard/morosos
// ==========================================
router.get("/morosos", verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.id,
        c.nombre,
        c.telefono,
        p.saldo,
        p.cuotas_vencidas
      FROM prestamos p
      INNER JOIN clientes c
        ON c.id = p.cliente_id
      WHERE p.estado = 'mora'
      ORDER BY p.cuotas_vencidas DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("❌ Error morosos:", error);

    res.status(500).json({
      success: false,
      message: "Error cargando morosos"
    });
  }
});

// ==========================================
// 📈 INGRESOS SEMANA
// GET /api/dashboard/ingresos-semana
// ==========================================
router.get("/ingresos-semana", verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        DATE(fecha_pago) fecha,
        SUM(monto) total
      FROM pagos
      WHERE fecha_pago >= CURDATE() - INTERVAL 7 DAY
      GROUP BY DATE(fecha_pago)
      ORDER BY fecha ASC
    `);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("❌ Error ingresos semana:", error);

    res.status(500).json({
      success: false,
      message: "Error cargando gráfico"
    });
  }
});

export default router;