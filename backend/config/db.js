import { Router } from "express";
import pool from "../config/db.js"; // tu conexión

const router = Router();

// 📍 GET clientes del día
router.get("/hoy", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, lat, lng
      FROM clientes
      WHERE fecha_cobro = CURDATE()
    `);

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo rutas" });
  }
});

// 📍 POST guardar ubicación
router.post("/ubicacion", async (req, res) => {
  const { lat, lng } = req.body;

  try {
    await pool.query(`
      INSERT INTO ubicaciones (lat, lng, fecha)
      VALUES (?, ?, NOW())
    `, [lat, lng]);

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error guardando ubicación" });
  }
});

export default router;