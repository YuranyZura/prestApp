// Ruta: /rol2_cobrador.js los endpoints para el rol de cobrador como editar su perfil y ver estadísticas, cobros, etc

import { Router } from "express";
import { pool } from "../server.js";

const router = Router();

// perfil - Obtener datos del trabajador logueado
router.get("/perfil", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ 
        success: false, 
        message: "No hay sesión activa" 
      });
    }

    const usuarioId = req.session.usuario.id;

    // Intentar obtener datos desde la tabla trabajadores, enlazada por id_usuario
    const [trabajadores] = await pool.query(
      `SELECT t.id_trabajador, t.cedula, t.nombre, t.apellido, t.telefono, t.foto, u.correo, u.rol
       FROM trabajadores t
       INNER JOIN usuarios u ON t.id_usuario = u.id_usuarios
       WHERE u.id_usuarios = ?
       LIMIT 1`,
      [usuarioId]
    );

    let perfil;
    if (trabajadores.length > 0) {
      const t = trabajadores[0];
      perfil = {
        cedula: t.cedula,
        nombre: t.nombre,
        apellido: t.apellido,
        nombreCompleto: `${t.nombre} ${t.apellido}`,
        iniciales: `${t.nombre?.charAt(0) ?? ''}${t.apellido?.charAt(0) ?? ''}`.toUpperCase(),
        telefono: t.telefono,
        correo: t.correo,
        foto: t.foto ? `/uploads/${t.foto}` : null,
        rol: t.rol
      };
    } else {
      // Si no existe en trabajadores, devolver al menos los datos básicos desde usuarios
      const [usuarios] = await pool.query(
        `SELECT id_usuarios, nombre, apellido, correo, rol
         FROM usuarios
         WHERE id_usuarios = ?
         LIMIT 1`,
        [usuarioId]
      );

      if (usuarios.length === 0) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      const u = usuarios[0];
      perfil = {
        cedula: null,
        nombre: u.nombre,
        apellido: u.apellido,
        nombreCompleto: `${u.nombre ?? ''} ${u.apellido ?? ''}`.trim(),
        iniciales: `${u.nombre?.charAt(0) ?? ''}${u.apellido?.charAt(0) ?? ''}`.toUpperCase(),
        telefono: null,
        correo: u.correo,
        foto: null,
        rol: u.rol
      };
    }

    res.json({ success: true, trabajador: perfil });

  } catch (error) {
    console.error("Error al obtener perfil del trabajador:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});




// Obtener ruta de cobro del día (clientes con préstamos activos para hoy)
router.get("/ruta", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const usuarioId = req.session.usuario.id;

    // Obtener id del trabajador
    const [trabajadores] = await pool.query(
      `SELECT id_trabajador FROM trabajadores WHERE id_usuario = ? LIMIT 1`,
      [usuarioId]
    );

    if (trabajadores.length === 0) {
      return res.status(403).json({ success: false, message: "No tienes permisos" });
    }

    const idTrabajador = trabajadores[0].id_trabajador;

    // Obtener clientes con préstamos activos para hoy
    const [clientes] = await pool.query(
      `SELECT DISTINCT
              c.id_clientes,
              CONCAT(c.nombre, ' ', IFNULL(c.apellido, '')) as nombreCliente,
              c.cedula,
              c.telefono,
              c.direccion,
              c.foto,
              COUNT(p.id_prestamos) as numeroPrestamos,
              SUM(p.cuota_diaria) as cuotaDiaria,
              MIN(p.fecha_inicio) as primerPrestamo,
              MAX(p.fecha_final) as ultimoPrestamo
       FROM clientes c
       INNER JOIN prestamos p ON c.id_clientes = p.id_clientes
       WHERE p.id_trabajador = ? 
         AND p.fecha_inicio <= CURDATE() 
         AND p.fecha_final >= CURDATE()
       GROUP BY c.id_clientes
       ORDER BY c.nombre ASC`,
      [idTrabajador]
    );

    // Obtener pagos del día para cada cliente
    const clientesConPagos = await Promise.all(clientes.map(async (cliente) => {
      const [pagos] = await pool.query(
        `SELECT COALESCE(SUM(pag.monto_pagos), 0) as totalPagadoHoy
         FROM pagos pag
         INNER JOIN prestamos p ON pag.id_prestamos = p.id_prestamos
         WHERE p.id_clientes = ? 
           AND DATE(pag.fecha_pago) = CURDATE()`,
        [cliente.id_clientes]
      );

      return {
        ...cliente,
        totalPagadoHoy: pagos[0].totalPagadoHoy || 0,
        pendientePagar: Math.max(0, parseFloat(cliente.cuotaDiaria) - (pagos[0].totalPagadoHoy || 0))
      };
    }));

    res.json({
      success: true,
      clientes: clientesConPagos
    });

  } catch (error) {
    console.error("Error al obtener ruta de cobro:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});



// listar prestamos activos del trabajador 
router.get("/prestamos", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const usuarioId = req.session.usuario.id;

    // Obtener id del trabajador
    const [trabajadores] = await pool.query(
      `SELECT id_trabajador FROM trabajadores WHERE id_usuario = ? LIMIT 1`,
      [usuarioId]
    );

    if (trabajadores.length === 0) {
      return res.status(403).json({ success: false, message: "No tienes permisos" });
    }

    const idTrabajador = trabajadores[0].id_trabajador;

    // Obtener préstamos activos (no completados)
    const [prestamos] = await pool.query(
      `SELECT p.id_prestamos, p.monto, p.fecha_inicio, p.fecha_final, p.interes, p.total_pagar, p.cuota_diaria,
              c.id_clientes, CONCAT(c.nombre, ' ', IFNULL(c.apellido, '')) as nombreCliente,
              c.cedula, c.telefono, c.direccion
       FROM prestamos p
       INNER JOIN clientes c ON p.id_clientes = c.id_clientes
       WHERE p.id_trabajador = ? AND p.fecha_final >= CURDATE()
       ORDER BY p.fecha_inicio DESC`,
      [idTrabajador]
    );

    res.json({
      success: true,
      prestamos
    });

  } catch (error) {
    console.error("Error al listar préstamos:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});


//==== Crear nuevo préstamo======
router.post("/prestamos", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const { clienteId, monto, plazo, fechaInicio, frecuencia, interes } = req.body;

    // Validar campos requeridos
    if (!clienteId || !monto || !plazo || !fechaInicio || !frecuencia) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan campos requeridos" 
      });
    }

    // Obtener id del trabajador logueado
    const usuarioId = req.session.usuario.id;
    const [trabajadores] = await pool.query(
      `SELECT id_trabajador FROM trabajadores WHERE id_usuario = ? LIMIT 1`,
      [usuarioId]
    );

    if (trabajadores.length === 0) {
      return res.status(403).json({ success: false, message: "No tienes permisos para crear préstamos" });
    }

    const idTrabajador = trabajadores[0].id_trabajador;

    // Calcular fecha final basada en el plazo
    const fechaInicioParsed = new Date(fechaInicio);
    const fechaFinal = new Date(fechaInicioParsed);
    fechaFinal.setDate(fechaFinal.getDate() + parseInt(plazo));

    // Calcular monto total a pagar (con interés)
    const montoPrestamo = parseFloat(monto);
    const tasaInteres = parseFloat(interes) || 0;
    const montoInteres = (montoPrestamo * tasaInteres) / 100;
    const totalPagar = montoPrestamo + montoInteres;

    // Calcular cuota según frecuencia
    let numeroCuotas = 0;
    switch (frecuencia) {
      case 'diario':
        numeroCuotas = parseInt(plazo);
        break;
      case 'semanal':
        numeroCuotas = Math.ceil(parseInt(plazo) / 7);
        break;
      case 'quincenal':
        numeroCuotas = Math.ceil(parseInt(plazo) / 15);
        break;
      case 'mensual':
        numeroCuotas = Math.ceil(parseInt(plazo) / 30);
        break;
    }

    const cuotaDiaria = totalPagar / parseInt(plazo); // Cuota diaria
    const cuotaPeriodo = totalPagar / numeroCuotas; // Cuota por período

    // Insertar préstamo
    const [resultado] = await pool.query(
      `INSERT INTO prestamos (id_clientes, id_trabajador, monto, fecha_inicio, fecha_final, interes, total_pagar, cuota_diaria)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [clienteId, idTrabajador, montoPrestamo, fechaInicio, 
       fechaFinal.toISOString().split('T')[0], tasaInteres, totalPagar, cuotaDiaria]
    );

    res.json({
      success: true,
      message: "Préstamo registrado exitosamente",
      prestamo: {
        id: resultado.insertId,
        clienteId,
        monto: montoPrestamo,
        interes: tasaInteres,
        totalPagar,
        cuotaDiaria,
        cuotaPeriodo,
        numeroCuotas,
        fechaInicio,
        fechaFinal: fechaFinal.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error("Error al crear préstamo:", error);
    res.status(500).json({ success: false, message: "Error del servidor al crear préstamo" });
  }
});



//==== Registrar pago de un cliente======
router.post("/pagos", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const { clienteId, monto, metodoPago, tipoPago, nota } = req.body;

    // Validar campos requeridos
    if (!clienteId || metodoPago === undefined || tipoPago === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan campos requeridos (clienteId, metodoPago, tipoPago)" 
      });
    }

    // Validar monto según tipo de pago
    if ((tipoPago === 'completo' || tipoPago === 'parcial') && (!monto || monto <= 0)) {
      return res.status(400).json({ 
        success: false, 
        message: "El monto debe ser mayor a 0 para pagos completos o parciales" 
      });
    }

    // Obtener id del trabajador logueado
    const usuarioId = req.session.usuario.id;
    const [trabajadores] = await pool.query(
      `SELECT id_trabajador FROM trabajadores WHERE id_usuario = ? LIMIT 1`,
      [usuarioId]
    );

    if (trabajadores.length === 0) {
      return res.status(403).json({ success: false, message: "No tienes permisos" });
    }

    const idTrabajador = trabajadores[0].id_trabajador;

    // Obtener préstamos activos del cliente con el cobrador actual
    const [prestamos] = await pool.query(
      `SELECT id_prestamos, monto, total_pagar, cuota_diaria, fecha_inicio, fecha_final
       FROM prestamos 
       WHERE id_clientes = ? 
         AND id_trabajador = ?
         AND fecha_final >= CURDATE()
       ORDER BY fecha_inicio ASC
       LIMIT 1`,
      [clienteId, idTrabajador]
    );

    if (prestamos.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No se encontró un préstamo activo para este cliente" 
      });
    }

    const prestamo = prestamos[0];
    const montoRegistro = parseFloat(monto) || 0;

    // Registrar el pago (incluso si es $0 para aplazamientos)
    const [resultado] = await pool.query(
      `INSERT INTO pagos (id_prestamos, monto_pagos, fecha_pago, metodo_pago, nota)
       VALUES (?, ?, NOW(), ?, ?)`,
      [prestamo.id_prestamos, montoRegistro, metodoPago, nota || null]
    );

    // Calcular total pagado hasta ahora
    const [totalPagado] = await pool.query(
      `SELECT COALESCE(SUM(monto_pagos), 0) as total
       FROM pagos
       WHERE id_prestamos = ?`,
      [prestamo.id_prestamos]
    );

    const pagado = totalPagado[0].total;
    const pendiente = Math.max(0, prestamo.total_pagar - pagado);

    // Mensaje de respuesta según tipo de pago
    let mensaje = '';
    if (tipoPago === 'completo') {
      mensaje = 'Pago completo registrado exitosamente';
    } else if (tipoPago === 'parcial') {
      mensaje = 'Abono parcial registrado exitosamente';
    } else if (tipoPago === 'nopago') {
      mensaje = 'Aplazamiento registrado exitosamente';
    }

    res.json({
      success: true,
      message: mensaje,
      pago: {
        id: resultado.insertId,
        prestamoId: prestamo.id_prestamos,
        monto: montoRegistro,
        metodoPago,
        tipoPago,
        fecha: new Date(),
        totalPagado: pagado,
        pendiente: pendiente
      }
    });

  } catch (error) {
    console.error("Error al registrar pago:", error);
    res.status(500).json({ success: false, message: "Error del servidor al registrar pago" });
  }
});






// Estadísticas del día
router.get("/estadisticas", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }
    res.json({
      success: true,
      estadisticas: {
        pagados: 0,
        pendientes: 0,
        mora: 0,
        totalRecaudado: 0
      }
    });

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});


export default router;
