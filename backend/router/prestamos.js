// ==========================================
// backend/router/prestamos.js
// PRESTAPP - PRÉSTAMOS PRO
// ==========================================

import { Router } from "express";
import pool from "../config/db.js";
import { verificarToken } from "../middleware/auth.js";

const router = Router();

// ==========================================
// CREAR PRÉSTAMO
// POST /api/prestamos
// ==========================================
router.post("/", verificarToken, async (req, res) => {
  try {
    const {
      id_clientes,
      monto,
      interes,
      numero_cuotas,
      fecha_inicio
    } = req.body;

    if (
      !id_clientes ||
      !monto ||
      !interes ||
      !numero_cuotas
    ) {
      return res.status(400).json({
        success: false,
        message: "Campos incompletos"
      });
    }

    const montoNum = parseFloat(monto);
    const interesNum = parseFloat(interes);
    const cuotasNum = parseInt(numero_cuotas);

    const total_pagar =
      montoNum + (montoNum * interesNum / 100);

    const cuota_diaria =
      total_pagar / cuotasNum;

    const saldo = total_pagar;

    const fechaInicio =
      fecha_inicio || new Date();

    const fechaFinal = new Date(fechaInicio);
    fechaFinal.setDate(
      fechaFinal.getDate() + cuotasNum
    );

    const [result] = await pool.query(`
      INSERT INTO prestamos
      (
        id_clientes,
        monto,
        interes,
        total_pagar,
        cuota_diaria,
        numero_cuotas,
        saldo,
        estado,
        fecha_inicio,
        fecha_final
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id_clientes,
      montoNum,
      interesNum,
      total_pagar,
      cuota_diaria,
      cuotasNum,
      saldo,
      "activo",
      fechaInicio,
      fechaFinal
    ]);

    res.json({
      success: true,
      message: "Préstamo creado",
      id_prestamo: result.insertId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error creando préstamo"
    });
  }
});

// ==========================================
// LISTAR TODOS
// GET /api/prestamos
// ==========================================
router.get("/", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.*,
        CONCAT(c.nombre,' ',IFNULL(c.apellido,'')) cliente
      FROM prestamos p
      INNER JOIN clientes c
      ON c.id_clientes = p.id_clientes
      ORDER BY p.id_prestamos DESC
    `);

    res.json({
      success: true,
      prestamos: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

// ==========================================
// PRÉSTAMOS POR CLIENTE
// GET /api/prestamos/cliente/:id
// ==========================================
router.get(
  "/cliente/:id",
  verificarToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await pool.query(`
        SELECT *
        FROM prestamos
        WHERE id_clientes = ?
        ORDER BY id_prestamos DESC
      `, [id]);

      res.json({
        success: true,
        prestamos: rows
      });

    } catch (error) {
      res.status(500).json({
        success: false
      });
    }
  }
);

// ==========================================
// PAGAR CUOTA
// POST /api/prestamos/pagar
// ==========================================
router.post(
  "/pagar",
  verificarToken,
  async (req, res) => {
    try {
      const {
        id_prestamos,
        monto
      } = req.body;

      if (!id_prestamos || !monto) {
        return res.status(400).json({
          success: false
        });
      }

      const montoPago =
        parseFloat(monto);

      // guardar pago
      await pool.query(`
        INSERT INTO pagos
        (
          id_prestamos,
          monto_pagos,
          fecha_pago
        )
        VALUES (?, ?, NOW())
      `, [
        id_prestamos,
        montoPago
      ]);

      // descontar saldo
      await pool.query(`
        UPDATE prestamos
        SET saldo = saldo - ?
        WHERE id_prestamos = ?
      `, [
        montoPago,
        id_prestamos
      ]);

      // revisar si quedó pagado
      const [rows] =
        await pool.query(`
        SELECT saldo
        FROM prestamos
        WHERE id_prestamos = ?
      `, [id_prestamos]);

      if (
        rows.length &&
        rows[0].saldo <= 0
      ) {
        await pool.query(`
          UPDATE prestamos
          SET estado='pagado',
              saldo=0
          WHERE id_prestamos = ?
        `, [id_prestamos]);
      }

      res.json({
        success: true,
        message: "Pago aplicado"
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false
      });
    }
  }
);

// ==========================================
// DETALLE PRÉSTAMO
// GET /api/prestamos/:id
// ==========================================
router.get(
  "/:id",
  verificarToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await pool.query(`
        SELECT
          p.*,
          CONCAT(c.nombre,' ',IFNULL(c.apellido,'')) cliente
        FROM prestamos p
        INNER JOIN clientes c
        ON c.id_clientes = p.id_clientes
        WHERE p.id_prestamos = ?
        LIMIT 1
      `, [id]);

      if (!rows.length) {
        return res.status(404).json({
          success: false
        });
      }

      res.json({
        success: true,
        prestamo: rows[0]
      });

    } catch (error) {
      res.status(500).json({
        success: false
      });
    }
  }
);

// ==========================================
// ELIMINAR PRÉSTAMO
// DELETE /api/prestamos/:id
// ==========================================
router.delete(
  "/:id",
  verificarToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(`
        DELETE FROM pagos
        WHERE id_prestamos = ?
      `, [id]);

      await pool.query(`
        DELETE FROM prestamos
        WHERE id_prestamos = ?
      `, [id]);

      res.json({
        success: true,
        message: "Préstamo eliminado"
      });

    } catch (error) {
      res.status(500).json({
        success: false
      });
    }
  }
);

export default router;