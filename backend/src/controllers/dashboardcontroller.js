// ==========================================
// DASHBOARD CONTROLLER
// backend/src/controllers/dashboardController.js
// ==========================================

import { query } from "../config/db.js";

/* ==========================================
OBTENER DASHBOARD
========================================== */

export const obtenerDashboard = async (req, res) => {

  try {

    res.json({
      success: true,
      message: "Dashboard funcionando"
    });

  } catch (error) {

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

    res.json({
      success: true,
      data: {
        clientes: 100,
        prestamos: 50,
        pagos: 30
      }
    });

  } catch (error) {

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

    res.json({
      success: true,
      data: {
        ingresos: 50000,
        clientesActivos: 80,
        mora: 5
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error métricas"
    });

  }

};