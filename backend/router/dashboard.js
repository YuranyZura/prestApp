import { Router } from "express";
import { query } from "../config/db.js";
import { verificarToken } from "../middleware/auth.js";
import { soloAdmin, soloTrabajador } from "../middleware/roles.js";

const router = Router();

// ==========================================
// 🔐 RESUMEN PRINCIPAL
// ==========================================
router.get("/resumen", verificarToken, async (req, res) => {
  try {

    const clientes = await query(`
      SELECT COUNT(*) AS total FROM clientes
    `);

    const prestamos = await query(`
      SELECT COUNT(*) AS total
      FROM prestamos
      WHERE estado = 'activo'
    `);

    const mora = await query(`
      SELECT COUNT(*) AS total
      FROM prestamos
      WHERE estado = 'mora'
    `);

    const pagosHoy = await query(`
      SELECT IFNULL(SUM(monto),0) AS total
      FROM pagos
      WHERE DATE(fecha_pago)=CURDATE()
    `);

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
    console.error("❌ dashboard resumen:", error.message);

    res.status(500).json({
      success: false,
      message: "Error cargando dashboard"
    });
  }
});

// ==========================================
// 📋 ÚLTIMOS PAGOS
// ==========================================
router.get("/ultimos-pagos", verificarToken, async (req, res) => {
  try {

    const rows = await query(`
      SELECT 
        p.id_pagos,
        c.nombre,
        c.apellido,
        p.monto,
        p.fecha_pago
      FROM pagos p
      INNER JOIN prestamos pr
        ON pr.id_prestamos = p.id_prestamos
      INNER JOIN clientes c
        ON c.id_clientes = pr.id_clientes
      ORDER BY p.fecha_pago DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("❌ ultimos pagos:", error.message);

    res.status(500).json({
      success: false,
      message: "Error cargando pagos"
    });
  }
});

// ==========================================
// ⚠️ CLIENTES EN MORA
// ==========================================
router.get("/morosos", verificarToken, soloTrabajador, async (req, res) => {
  try {

    const rows = await query(`
      SELECT
        c.id_clientes,
        c.nombre,
        c.telefono,
        p.saldo,
        p.cuotas_vencidas
      FROM prestamos p
      INNER JOIN clientes c
        ON c.id_clientes = p.id_clientes
      WHERE p.estado = 'mora'
      ORDER BY p.cuotas_vencidas DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("❌ morosos:", error.message);

    res.status(500).json({
      success: false,
      message: "Error cargando morosos"
    });
  }
});

// ==========================================
// 📈 INGRESOS SEMANA
// ==========================================
router.get("/ingresos-semana", verificarToken, async (req, res) => {
  try {

    const rows = await query(`
      SELECT
        DATE(fecha_pago) AS fecha,
        SUM(monto) AS total
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
    console.error("❌ ingresos semana:", error.message);

    res.status(500).json({
      success: false,
      message: "Error cargando gráfico"
    });
  }
});

export default router;