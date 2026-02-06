import { Router } from "express";
import { pool } from "../server.js";

const router = Router();

/**
 * GET /api/pagos/resumen-hoy
 * Obtiene el resumen de cuotas pagadas en el día actual
 */
router.get("/resumen-hoy", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ 
        success: false, 
        message: "No hay sesión activa" 
      });
    }

    const usuarioId = req.session.usuario.id;
    const hoy = new Date().toISOString().split('T')[0];

    const [trabajadores] = await pool.query(
      `SELECT id_trabajador FROM trabajadores WHERE id_usuario = ? LIMIT 1`,
      [usuarioId]
    );

    if (trabajadores.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No se encontró el registro del trabajador" 
      });
    }

    const idTrabajador = trabajadores[0].id_trabajador;

    const [cuotas] = await pool.query(
      `SELECT 
        p.id_pagos,
        p.monto_pagos,
        p.metodo_pago,
        p.fecha_pago,
        c.nombre as nombreCliente,
        c.cedula
      FROM pagos p
      JOIN prestamos pr ON p.id_prestamos = pr.id_prestamos
      JOIN clientes c ON pr.id_clientes = c.id_clientes
      WHERE pr.id_trabajador = ? 
        AND DATE(p.fecha_pago) = ?
      ORDER BY p.fecha_pago DESC`,
      [idTrabajador, hoy]
    );

    const cuotasProcesadas = cuotas.map(cuota => ({
      id: cuota.id_pagos,
      referencia: `PAG-${cuota.id_pagos}`,
      nombreCliente: cuota.nombreCliente,
      cedula: cuota.cedula,
      monto: cuota.monto_pagos,
      metodo: cuota.metodo_pago || 'Efectivo',
      hora: new Date(cuota.fecha_pago).toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    }));

    const totalRecaudado = cuotas.reduce((sum, c) => sum + parseFloat(c.monto_pagos || 0), 0);
    const totalCuotas = cuotas.length;

    const [clientesAtendidosResult] = await pool.query(
      `SELECT COUNT(DISTINCT pr.id_clientes) AS total
       FROM pagos p
       JOIN prestamos pr ON p.id_prestamos = pr.id_prestamos
       WHERE pr.id_trabajador = ?
         AND DATE(p.fecha_pago) = ?`,
      [idTrabajador, hoy]
    );

    const clientesAtendidos = clientesAtendidosResult[0]?.total || 0;
    const promedioXCliente = clientesAtendidos > 0 ? totalRecaudado / clientesAtendidos : 0;

    return res.json({
      success: true,
      totalRecaudado: parseFloat(totalRecaudado.toFixed(2)),
      totalCuotas,
      clientesAtendidos,
      promedioXCliente: parseFloat(promedioXCliente.toFixed(2)),
      cuotas: cuotasProcesadas,
      clientes: []
    });

  } catch (error) {
    console.error('Error en resumen-hoy:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Error al obtener el resumen",
      error: error.message 
    });
  }
});

/**
 * GET /api/pagos/resumen-dia?fecha=YYYY-MM-DD
 * Obtiene el resumen de cuotas pagadas en una fecha específica
 */
router.get("/resumen-dia", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ 
        success: false, 
        message: "No hay sesión activa" 
      });
    }

    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ 
        success: false, 
        message: "Falta el parámetro fecha" 
      });
    }

    const usuarioId = req.session.usuario.id;

    const [trabajadores] = await pool.query(
      `SELECT id_trabajador FROM trabajadores WHERE id_usuario = ? LIMIT 1`,
      [usuarioId]
    );

    if (trabajadores.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No se encontró el registro del trabajador" 
      });
    }

    const idTrabajador = trabajadores[0].id_trabajador;

    const [cuotas] = await pool.query(
      `SELECT 
        p.id_pagos,
        p.monto_pagos,
        p.metodo_pago,
        p.fecha_pago,
        c.nombre as nombreCliente,
        c.cedula
      FROM pagos p
      JOIN prestamos pr ON p.id_prestamos = pr.id_prestamos
      JOIN clientes c ON pr.id_clientes = c.id_clientes
      WHERE pr.id_trabajador = ? 
        AND DATE(p.fecha_pago) = ?
      ORDER BY p.fecha_pago DESC`,
      [idTrabajador, fecha]
    );

    const cuotasProcesadas = cuotas.map(cuota => ({
      id: cuota.id_pagos,
      referencia: `PAG-${cuota.id_pagos}`,
      nombreCliente: cuota.nombreCliente,
      cedula: cuota.cedula,
      monto: cuota.monto_pagos,
      metodo: cuota.metodo_pago || 'Efectivo',
      hora: new Date(cuota.fecha_pago).toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    }));

    const totalRecaudado = cuotas.reduce((sum, c) => sum + parseFloat(c.monto_pagos || 0), 0);
    const totalCuotas = cuotas.length;

    const [clientesAtendidosResult] = await pool.query(
      `SELECT COUNT(DISTINCT pr.id_clientes) AS total
       FROM pagos p
       JOIN prestamos pr ON p.id_prestamos = pr.id_prestamos
       WHERE pr.id_trabajador = ?
         AND DATE(p.fecha_pago) = ?`,
      [idTrabajador, fecha]
    );

    const clientesAtendidos = clientesAtendidosResult[0]?.total || 0;
    const promedioXCliente = clientesAtendidos > 0 ? totalRecaudado / clientesAtendidos : 0;

    return res.json({
      success: true,
      totalRecaudado: parseFloat(totalRecaudado.toFixed(2)),
      totalCuotas,
      clientesAtendidos,
      promedioXCliente: parseFloat(promedioXCliente.toFixed(2)),
      cuotas: cuotasProcesadas,
      clientes: []
    });

  } catch (error) {
    console.error('Error en resumen-dia:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Error al obtener el resumen",
      error: error.message 
    });
  }
});


/**
 * GET /api/pagos/cliente/:id
 * Obtiene el historial de cuotas de un cliente específico
 */
router.get("/cliente/:id", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ 
        success: false, 
        message: "No hay sesión activa" 
      });
    }

    const { id } = req.params;

    const [cuotas] = await pool.query(
  `SELECT 
    p.id_pagos,
    p.monto_pagos,
    p.metodo_pago,
    p.fecha_pago,
    pr.id_prestamos,
    pr.monto
  FROM pagos p
  JOIN prestamos pr ON p.id_prestamos = pr.id_prestamos
  WHERE pr.id_clientes = ?
  ORDER BY p.fecha_pago DESC`,
  [id]
);


    return res.json({
      success: true,
      cuotas
    });

  } catch (error) {
    console.error('Error al obtener historial de cuotas:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Error al cargar el historial de cuotas",
      error: error.message 
    });
  }
});

export default router;
