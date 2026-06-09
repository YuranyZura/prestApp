// ==========================================
// DASHBOARD CONTROLLER
// backend/src/controllers/dashboard.controller.js
// ==========================================

import { query } from "../config/db.js";

/* ==========================================
OBTENER DASHBOARD
========================================== */

export const obtenerDashboard = async (req, res) => {
  try {
    // 1. Resumen counts
    const totalClientes = await query("SELECT COUNT(*) AS count FROM clientes");
    const totalPrestamos = await query("SELECT COUNT(*) AS count FROM prestamos");
    const totalPagos = await query("SELECT COUNT(*) AS count FROM pagos");

    // 2. Metrics
    const ingresos = await query("SELECT COALESCE(SUM(monto_pagado), 0) AS total FROM pagos");
    const clientesActivos = await query("SELECT COUNT(DISTINCT id_cliente) AS count FROM prestamos WHERE estado = 'activo'");
    const prestamosMora = await query("SELECT COUNT(*) AS count FROM prestamos WHERE estado = 'mora' OR estado = 'vencido'");

    // 3. Recent items
    const ultimosPrestamos = await query(`
      SELECT p.*, c.nombre, c.apellido 
      FROM prestamos p
      LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY p.fecha_creacion DESC
      LIMIT 5
    `);

    const ultimosPagos = await query(`
      SELECT pg.*, c.nombre, c.apellido
      FROM pagos pg
      LEFT JOIN prestamos pr ON pg.id_prestamo = pr.id_prestamo
      LEFT JOIN clientes c ON pr.id_cliente = c.id_cliente
      ORDER BY pg.fecha_pago DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        resumen: {
          clientes: totalClientes[0]?.count || 0,
          prestamos: totalPrestamos[0]?.count || 0,
          pagos: totalPagos[0]?.count || 0
        },
        metricas: {
          ingresos: parseFloat(ingresos[0]?.total || 0),
          clientesActivos: clientesActivos[0]?.count || 0,
          mora: prestamosMora[0]?.count || 0
        },
        ultimosPrestamos,
        ultimosPagos
      }
    });
  } catch (error) {
    console.error("ERROR DASHBOARD:", error);
    res.status(500).json({
      success: false,
      message: "Error dashboard"
    });
  }
};

/* ==========================================
OBTENER RESUMEN
========================================== */

export const obtenerResumen = async (req, res) => {
  try {
    const totalClientesResult = await query("SELECT COUNT(*) AS count FROM clientes");
    const totalPrestamosResult = await query("SELECT COUNT(*) AS count FROM prestamos");
    const totalPagosResult = await query("SELECT COUNT(*) AS count FROM pagos");

    const clientes = totalClientesResult[0]?.count || 0;
    const prestamos = totalPrestamosResult[0]?.count || 0;
    const pagos = totalPagosResult[0]?.count || 0;

    res.json({
      success: true,
      data: {
        clientes,
        prestamos,
        pagos
      }
    });
  } catch (error) {
    console.error("ERROR DASHBOARD RESUMEN:", error);
    res.status(500).json({
      success: false,
      message: "Error resumen"
    });
  }
};

/* ==========================================
OBTENER METRICAS
========================================== */

export const obtenerMetricas = async (req, res) => {
  try {
    const totalPagos = await query("SELECT COALESCE(SUM(monto_pagado), 0) AS total FROM pagos");
    const clientesActivos = await query("SELECT COUNT(DISTINCT id_cliente) AS count FROM prestamos WHERE estado = 'activo'");
    const prestamosMora = await query("SELECT COUNT(*) AS count FROM prestamos WHERE estado = 'mora' OR estado = 'vencido'");

    res.json({
      success: true,
      data: {
        ingresos: parseFloat(totalPagos[0]?.total || 0),
        clientesActivos: clientesActivos[0]?.count || 0,
        mora: prestamosMora[0]?.count || 0
      }
    });
  } catch (error) {
    console.error("ERROR DASHBOARD METRICAS:", error);
    res.status(500).json({
      success: false,
      message: "Error métricas"
    });
  }
};