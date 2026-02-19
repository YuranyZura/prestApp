import express from "express";
import { pool } from "../server.js";

const router = express.Router();

// GET /api/dashboard/stats
router.get("/estadisticas", async (req, res) => {
  try {
    // Consultas a la base de datos
    const [[{ trabajadoresActivos }]] = await pool.query(
      "SELECT COUNT(*) AS trabajadoresActivos FROM trabajadores"
    );
    const [[{ prestamosActivos }]] = await pool.query(
      "SELECT COUNT(*) AS prestamosActivos FROM prestamos WHERE estado = 'activo'"
    );
    const [[{ montoPrestado }]] = await pool.query(
      "SELECT IFNULL(SUM(monto),0) AS montoPrestado FROM prestamos WHERE estado = 'activo'"
    );
        const [[{ recuperadoHoy }]] = await pool.query(
          "SELECT IFNULL(SUM(monto_pagos),0) AS recuperadoHoy FROM pagos WHERE DATE(fecha_pago) = CURDATE()"
        );
    res.json({
      trabajadoresActivos,
      prestamosActivos,
      montoPrestado,
      recuperadoHoy
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

export default router;
