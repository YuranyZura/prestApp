import { Router } from "express";
import pool, { query } from "../config/db.js";

import { verificarToken } from "../middleware/auth.js";
import { soloAdmin, soloTrabajador } from "../middleware/roles.js";

const router = Router();

// ==========================================
// CREAR PRÉSTAMO
// ==========================================
router.post("/", verificarToken, soloAdmin, async (req, res) => {
  try {
    let {
      id_clientes,
      monto,
      interes,
      numero_cuotas,
      fecha_inicio
    } = req.body;

    if (!id_clientes || !monto || !interes || !numero_cuotas) {
      return res.status(400).json({ message: "Campos requeridos" });
    }

    monto = Number(monto);
    interes = Number(interes);
    numero_cuotas = Number(numero_cuotas);

    if (monto <= 0 || numero_cuotas <= 0) {
      return res.status(400).json({ message: "Valores inválidos" });
    }

    const total = monto + (monto * interes / 100);
    const cuota = total / numero_cuotas;

    const fechaInicio = fecha_inicio || new Date();
    const fechaFinal = new Date(fechaInicio);
    fechaFinal.setDate(fechaFinal.getDate() + numero_cuotas);

    const result = await query(`
      INSERT INTO prestamos
      (id_clientes, monto, interes, total_pagar, cuota_diaria, numero_cuotas, saldo, estado, fecha_inicio, fecha_final)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'activo', ?, ?)
    `, [
      id_clientes,
      monto,
      interes,
      total,
      cuota,
      numero_cuotas,
      total,
      fechaInicio,
      fechaFinal
    ]);

    res.json({
      success: true,
      id: result.insertId
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ==========================================
// LISTAR
// ==========================================
router.get("/", verificarToken, async (req, res) => {
  try {
    const rows = await query(`
      SELECT p.*, CONCAT(c.nombre,' ',c.apellido) cliente
      FROM prestamos p
      JOIN clientes c ON c.id_clientes = p.id_clientes
      ORDER BY p.id_prestamos DESC
    `);

    res.json({ success: true, data: rows });

  } catch {
    res.status(500).json({ success: false });
  }
});

// ==========================================
// PAGAR (🔥 CRÍTICO)
// ==========================================
router.post("/pagar", verificarToken, soloTrabajador, async (req, res) => {

  const conn = await pool.getConnection();

  try {
    const { id_prestamos, monto } = req.body;

    if (!id_prestamos || !monto) {
      return res.status(400).json({ message: "Datos requeridos" });
    }

    const montoPago = Number(monto);

    if (montoPago <= 0) {
      return res.status(400).json({ message: "Monto inválido" });
    }

    await conn.beginTransaction();

    const [prestamo] = await conn.query(
      "SELECT saldo, estado FROM prestamos WHERE id_prestamos = ? FOR UPDATE",
      [id_prestamos]
    );

    if (!prestamo.length) {
      await conn.rollback();
      return res.status(404).json({ message: "Préstamo no existe" });
    }

    if (prestamo[0].estado === "pagado") {
      await conn.rollback();
      return res.status(400).json({ message: "Ya está pagado" });
    }

    if (montoPago > prestamo[0].saldo) {
      await conn.rollback();
      return res.status(400).json({ message: "Pago excede saldo" });
    }

    // insertar pago
    await conn.query(`
      INSERT INTO pagos (id_prestamos, monto_pagos, fecha_pago)
      VALUES (?, ?, NOW())
    `, [id_prestamos, montoPago]);

    // actualizar saldo
    await conn.query(`
      UPDATE prestamos
      SET saldo = saldo - ?
      WHERE id_prestamos = ?
    `, [montoPago, id_prestamos]);

    // verificar saldo final
    const [updated] = await conn.query(
      "SELECT saldo FROM prestamos WHERE id_prestamos = ?",
      [id_prestamos]
    );

    if (updated[0].saldo <= 0) {
      await conn.query(`
        UPDATE prestamos
        SET estado = 'pagado', saldo = 0
        WHERE id_prestamos = ?
      `, [id_prestamos]);
    }

    await conn.commit();

    res.json({
      success: true,
      message: "Pago aplicado"
    });

  } catch (err) {

    await conn.rollback();

    console.error("❌ pago:", err.message);

    res.status(500).json({ success: false });

  } finally {
    conn.release();
  }
});

// ==========================================
// DETALLE
// ==========================================
router.get("/:id", verificarToken, async (req, res) => {

  try {

    const { id } = req.params;

    const rows = await query(`
      SELECT p.*, CONCAT(c.nombre,' ',c.apellido) cliente
      FROM prestamos p
      JOIN clientes c ON c.id_clientes = p.id_clientes
      WHERE p.id_prestamos = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch {
    res.status(500).json({ success: false });
  }
});

// ==========================================
// ELIMINAR (🔥 CON TRANSACCIÓN)
// ==========================================
router.delete("/:id", verificarToken, soloAdmin, async (req, res) => {

  const conn = await pool.getConnection();

  try {

    const { id } = req.params;

    await conn.beginTransaction();

    await conn.query(
      "DELETE FROM pagos WHERE id_prestamos = ?",
      [id]
    );

    await conn.query(
      "DELETE FROM prestamos WHERE id_prestamos = ?",
      [id]
    );

    await conn.commit();

    res.json({
      success: true,
      message: "Eliminado"
    });

  } catch (err) {

    await conn.rollback();

    res.status(500).json({ success: false });

  } finally {
    conn.release();
  }
});

export default router;