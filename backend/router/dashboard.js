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


// configuracion de api tasa de interes
router.post("/configuracion/interes", async (req, res) => {
    try {
        const { tasa_interes } = req.body;
        console.log("Valor recibido en tasa_interes:", tasa_interes);

        if (!tasa_interes) {
            console.log("Tasa inválida recibida:", tasa_interes);
            return res.status(400).json({ mensaje: "Tasa inválida" });
        }

        // Verificar si existe la clave
        const [rows] = await pool.query(
            "SELECT id FROM configuracion WHERE clave = 'tasa_interes'"
        );

        let result;
        if (rows.length > 0) {
            // Si existe, actualiza
            const query = `
                UPDATE configuracion
                SET valor = ?
                WHERE clave = 'tasa_interes'
            `;
            [result] = await pool.query(query, [tasa_interes]);
            console.log("UPDATE ejecutado:", result);
        } else {
            // Si no existe, inserta
            const query = `
                INSERT INTO configuracion (clave, valor)
                VALUES ('tasa_interes', ?)
            `;
            [result] = await pool.query(query, [tasa_interes]);
            console.log("INSERT ejecutado:", result);
        }

        res.json({ mensaje: "Tasa guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la tasa:", error);
        res.status(500).json({ mensaje: "Error al guardar la tasa" });
    }

});

// ===traer el valor de la tasa de interes====
router.get("/configuracion/interes", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT valor FROM configuracion WHERE clave = 'tasa_interes'"
    );

    if (rows.length === 0) {
      return res.json({ tasa_interes: 0 });
    }

    res.json({ tasa_interes: rows[0].valor });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo tasa" });
  }
});

export default router;
