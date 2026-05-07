import { Router } from "express";
import pool from "../config/db.js";
import { verificarToken } from "../middleware/auth.js";
import { soloTrabajador } from "../middleware/roles.js";

const router = Router();

// 🔐 PROTEGER TODO EL ROUTER
router.use(verificarToken, soloTrabajador);

// ==========================================
// 🧠 HELPER: obtener trabajador
// ==========================================
async function getTrabajadorId(usuarioId) {
  const [rows] = await pool.query(
    `SELECT id_trabajador FROM trabajadores WHERE id_usuario = ? LIMIT 1`,
    [usuarioId]
  );

  if (!rows.length) return null;
  return rows[0].id_trabajador;
}

// ==========================================
// 👤 PERFIL
// ==========================================
router.get("/perfil", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [rows] = await pool.query(
      `SELECT 
        t.cedula,
        t.nombre,
        t.apellido,
        t.telefono,
        t.foto,
        u.correo,
        u.rol
      FROM trabajadores t
      INNER JOIN usuarios u 
        ON t.id_usuario = u.id_usuarios
      WHERE u.id_usuarios = ?
      LIMIT 1`,
      [usuarioId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Perfil no encontrado"
      });
    }

    const t = rows[0];

    res.json({
      success: true,
      trabajador: {
        ...t,
        nombreCompleto: `${t.nombre} ${t.apellido}`,
        foto: t.foto ? `/uploads/${t.foto}` : null
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ==========================================
// 📍 RUTA DE COBRO DEL DÍA
// ==========================================
router.get("/ruta", async (req, res) => {
  try {
    const idTrabajador = await getTrabajadorId(req.usuario.id);

    if (!idTrabajador) {
      return res.status(403).json({
        success: false,
        message: "No autorizado"
      });
    }

    const [clientes] = await pool.query(`
      SELECT DISTINCT
        c.id_clientes,
        CONCAT(c.nombre,' ',IFNULL(c.apellido,'')) nombre,
        c.telefono,
        c.direccion,
        c.foto,
        SUM(p.cuota_diaria) cuotaDiaria
      FROM clientes c
      INNER JOIN prestamos p 
        ON c.id_clientes = p.id_clientes
      WHERE p.id_trabajador = ?
        AND p.estado = 'activo'
      GROUP BY c.id_clientes
      ORDER BY c.nombre ASC
    `, [idTrabajador]);

    res.json({
      success: true,
      clientes
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ==========================================
// 💰 PRÉSTAMOS DEL COBRADOR
// ==========================================
router.get("/prestamos", async (req, res) => {
  try {
    const idTrabajador = await getTrabajadorId(req.usuario.id);

    const [rows] = await pool.query(`
      SELECT 
        p.*,
        CONCAT(c.nombre,' ',IFNULL(c.apellido,'')) cliente
      FROM prestamos p
      INNER JOIN clientes c 
        ON c.id_clientes = p.id_clientes
      WHERE p.id_trabajador = ?
        AND p.estado = 'activo'
      ORDER BY p.fecha_inicio DESC
    `, [idTrabajador]);

    res.json({
      success: true,
      prestamos: rows
    });

  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ==========================================
// 💳 REGISTRAR PAGO
// ==========================================
router.post("/pagos", async (req, res) => {
  try {
    const { clienteId, monto = 0, metodoPago = "efectivo" } = req.body;

    if (!clienteId) {
      return res.status(400).json({
        success: false,
        message: "clienteId requerido"
      });
    }

    const idTrabajador = await getTrabajadorId(req.usuario.id);

    const [prestamos] = await pool.query(`
      SELECT id_prestamos, total_pagar
      FROM prestamos
      WHERE id_clientes = ?
        AND id_trabajador = ?
        AND estado = 'activo'
      LIMIT 1
    `, [clienteId, idTrabajador]);

    if (!prestamos.length) {
      return res.status(404).json({
        success: false,
        message: "No hay préstamo activo"
      });
    }

    const prestamo = prestamos[0];

    // guardar pago
    await pool.query(`
      INSERT INTO pagos 
      (id_prestamos, monto_pagos, metodo_pago, fecha_pago)
      VALUES (?, ?, ?, NOW())
    `, [prestamo.id_prestamos, monto, metodoPago]);

    // actualizar saldo
    await pool.query(`
      UPDATE prestamos
      SET saldo = saldo - ?
      WHERE id_prestamos = ?
    `, [monto, prestamo.id_prestamos]);

    res.json({
      success: true,
      message: "Pago registrado"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ==========================================
// 📊 ESTADÍSTICAS
// ==========================================
router.get("/estadisticas", async (req, res) => {
  try {
    const idTrabajador = await getTrabajadorId(req.usuario.id);

    const [rows] = await pool.query(`
      SELECT 
        COUNT(DISTINCT p.id_clientes) clientes,
        IFNULL(SUM(pg.monto_pagos),0) total
      FROM prestamos p
      LEFT JOIN pagos pg 
        ON p.id_prestamos = pg.id_prestamos
      WHERE p.id_trabajador = ?
        AND DATE(pg.fecha_pago) = CURDATE()
    `, [idTrabajador]);

    res.json({
      success: true,
      estadisticas: rows[0]
    });

  } catch (error) {
    res.status(500).json({ success: false });
  }
});

export default router;