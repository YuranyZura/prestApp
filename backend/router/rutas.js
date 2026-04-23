import express from "express";
import pool from "../config/db.js"; // ✅ CORREGIDO

const router = express.Router();

// 📍 OBTENER CLIENTES DEL DÍA
router.get("/hoy", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, lat, lng 
      FROM clientes 
      WHERE fecha_cobro = CURDATE()
    `);

    res.json(rows);

  } catch (error) {
    console.error("Error en /hoy:", error.message);
    res.status(500).json({ error: "Error obteniendo rutas" });
  }
});

// 📍 GUARDAR UBICACIÓN DEL TRABAJADOR
router.post("/ubicacion", async (req, res) => {
  const { lat, lng } = req.body;

  // ✅ Validar datos
  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitud y longitud son obligatorias" });
  }

  try {
    await pool.query(`
      INSERT INTO ubicaciones (lat, lng, fecha)
      VALUES (?, ?, NOW())
    `, [lat, lng]);

    res.json({ success: true });

  } catch (error) {
    console.error("Error en /ubicacion:", error.message);
    res.status(500).json({ error: "Error guardando ubicación" });
  }
});

export default router; // ✅ IMPORTANTE (si no lo tienes)