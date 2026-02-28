import { Router } from "express";
import { pool } from "../server.js";
import fetch from "node-fetch";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para guardar fotos en "uploads/"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "cliente-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif)"));
    }
  }
});


//  Registrar nuevo cliente
router.post("/", async (req, res) => {
  try {
    // Verificar sesión activa
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({
        success: false,
        message: "No hay sesión activa"
      });
    }

    const { nombreCompleto, cedula, telefono, direccion, ciudad, fechaNacimiento } = req.body;

    // Validar campos requeridos
    if (!nombreCompleto || !cedula || !telefono || !direccion) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos"
      });
    }

    // Dividir nombre completo en nombre y apellido
    const partesNombre = nombreCompleto.trim().split(/\s+/);
    const nombre = partesNombre[0];
    const apellido = partesNombre.slice(1).join(' ') || '';

    // Obtener id del trabajador desde la sesión
    const usuarioId = req.session.usuario.id;

    // Buscar id_trabajador del usuario logueado
    const [trabajadores] = await pool.query(
      `SELECT id_trabajador FROM trabajadores WHERE id_usuario = ? LIMIT 1`,
      [usuarioId]
    );

    // Si no existe como trabajador, intentar crear uno básico o asignar null
    let idTrabajador = null;
    if (trabajadores.length > 0) {
      idTrabajador = trabajadores[0].id_trabajador;
    }

    // Agregar ciudad a la dirección si existe
    const direccionCompleta = ciudad ? `${direccion}, ${ciudad}` : direccion;

    // Verificar si ya existe un cliente con esa cedula
    const [existe] = await pool.query(
      `SELECT id_clientes FROM clientes WHERE cedula = ? LIMIT 1`,
      [cedula]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un cliente con esa cédula"
      });
    }

    let latitud = null;
    let longitud = null;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(direccionCompleta)}`;
      const geoResp = await fetch(url, {
        headers: {
          // Usa un UA identificable según política de Nominatim
          "User-Agent": "PrestApp/1.0 (contact: soporte@prestapp.local)",
          "Accept-Language": "es"
        }
      });
      if (geoResp.ok) {
        const resultados = await geoResp.json();
        if (Array.isArray(resultados) && resultados.length > 0) {
          latitud = parseFloat(resultados[0].lat);
          longitud = parseFloat(resultados[0].lon);
        }
      }
    } catch (geoErr) {
      console.warn("Geocoding Nominatim falló, continuo sin coordenadas:", geoErr);
    }


    // Insertar cliente (incluye latitud/longitud si disponibles)
    const [resultado] = await pool.query(
      `INSERT INTO clientes (id_trabajador, nombre, apellido, cedula, fecha_nacimiento, direccion, telefono, latitud, longitud)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idTrabajador, nombre, apellido, cedula, fechaNacimiento || null, direccionCompleta, telefono, latitud, longitud]
    );

    res.json({
      success: true,
      message: "Cliente registrado exitosamente",
      cliente: {
        id: resultado.insertId,
        nombre,
        apellido,
        nombreCompleto,
        cedula,
        telefono,
        direccion: direccionCompleta,
        latitud,
        longitud
      }
    });

  } catch (error) {
    console.error("Error al registrar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al registrar cliente"
    });
  }
});




// listar todos los clientes
router.get("/", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const [clientes] = await pool.query(
      `SELECT c.id_clientes, c.nombre, c.apellido, c.cedula, c.telefono, c.direccion, c.foto, c.latitud, c.longitud,
              CONCAT(c.nombre, ' ', IFNULL(c.apellido, '')) as nombreCompleto
       FROM clientes c
       ORDER BY c.nombre ASC`
    );

    res.json({
      success: true,
      clientes
    });

  } catch (error) {
    console.error("Error al listar clientes:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});




// Ver detalle de un cliente
router.get("/:id", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const { id } = req.params;

    const [clientes] = await pool.query(
      `SELECT c.*, CONCAT(c.nombre, ' ', IFNULL(c.apellido, '')) as nombreCompleto
       FROM clientes c
       WHERE c.id_clientes = ?
       LIMIT 1`,
      [id]
    );

    if (clientes.length === 0) {
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    }

    // Obtener préstamos del cliente
    const [prestamos] = await pool.query(
      `SELECT p.*, 
              (p.monto * (1 + IFNULL(p.interes, 0)/100)) as totalPagar,
              CASE 
                WHEN p.estado = 'pagado' THEN 'Pagado'
                WHEN p.estado = 'en_proceso' THEN 'En Proceso'
                ELSE 'Activo'
              END as estado_formateado
       FROM prestamos p
       WHERE p.id_clientes = ?
       ORDER BY p.fecha_inicio DESC`,
      [id]
    );

    res.json({
      success: true,
      cliente: clientes[0],
      prestamos: prestamos || []
    });

  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});



// Actualizar datos de un cliente (re-geocifica si cambia dirección)
router.put("/:id", upload.single("foto"), async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const { id } = req.params;
    const { nombreCompleto, cedula, telefono, direccion, ciudad, fechaNacimiento } = req.body;

    const setClauses = [];
    const values = [];

    // nombre/apellido
    if (nombreCompleto && nombreCompleto.trim()) {
      const partesNombre = nombreCompleto.trim().split(/\s+/);
      const nombre = partesNombre[0];
      const apellido = partesNombre.slice(1).join(' ') || '';
      setClauses.push("nombre = ?", "apellido = ?");
      values.push(nombre, apellido);
    }

    if (cedula) {
      setClauses.push("cedula = ?");
      values.push(cedula);
    }

    if (telefono) {
      setClauses.push("telefono = ?");
      values.push(telefono);
    }

    if (fechaNacimiento) {
      setClauses.push("fecha_nacimiento = ?");
      values.push(fechaNacimiento);
    }

    // Si se subió una nueva foto
    if (req.file) {
      setClauses.push("foto = ?");
      values.push(req.file.filename);
    }

    // Si llega nueva dirección, actualizar y geocodificar
    let latitud = null;
    let longitud = null;
    if (direccion && direccion.trim()) {
      const direccionCompleta = ciudad ? `${direccion}, ${ciudad}` : direccion;
      setClauses.push("direccion = ?");
      values.push(direccionCompleta);

      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(direccionCompleta)}`;
        const geoResp = await fetch(url, {
          headers: {
            "User-Agent": "PrestApp/1.0 (contact: soporte@prestapp.local)",
            "Accept-Language": "es"
          }
        });
        if (geoResp.ok) {
          const resultados = await geoResp.json();
          if (Array.isArray(resultados) && resultados.length > 0) {
            latitud = parseFloat(resultados[0].lat);
            longitud = parseFloat(resultados[0].lon);
          }
        }
      } catch (geoErr) {
        console.warn("Geocoding Nominatim falló (PUT)", geoErr);
      }

      if (latitud !== null && longitud !== null) {
        setClauses.push("latitud = ?", "longitud = ?");
        values.push(latitud, longitud);
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ success: false, message: "No hay campos para actualizar" });
    }

    const [upd] = await pool.query(
      `UPDATE clientes SET ${setClauses.join(", ")} WHERE id_clientes = ?`,
      [...values, id]
    );

    if (upd.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    }

    const [clientes] = await pool.query(
      `SELECT c.*, CONCAT(c.nombre, ' ', IFNULL(c.apellido, '')) as nombreCompleto
       FROM clientes c
       WHERE c.id_clientes = ?
       LIMIT 1`,
      [id]
    );

    return res.json({ success: true, message: "Cliente actualizado", cliente: clientes[0] });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});




// ======Eliminar cliente
router.delete("/:id", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const { id } = req.params;

    // Verificar que el cliente existe
    const [clienteExiste] = await pool.query(
      `SELECT id_clientes FROM clientes WHERE id_clientes = ? LIMIT 1`,
      [id]
    );

    if (clienteExiste.length === 0) {
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    }

    // Eliminar primero los pagos asociados a préstamos del cliente
    await pool.query(
      `DELETE pagos FROM pagos 
       INNER JOIN prestamos ON pagos.id_prestamos = prestamos.id_prestamos 
       WHERE prestamos.id_clientes = ?`,
      [id]
    );

    // Eliminar préstamos del cliente
    await pool.query(
      `DELETE FROM prestamos WHERE id_clientes = ?`,
      [id]
    );

    // Finalmente eliminar el cliente
    const [resultado] = await pool.query(
      `DELETE FROM clientes WHERE id_clientes = ?`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "No se pudo eliminar el cliente" });
    }

    res.json({
      success: true,
      message: "Cliente y sus registros asociados eliminados exitosamente"
    });

  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al eliminar cliente"
    });
  }
});



// ======resumen de prestamos====
router.get("/:id", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const { id } = req.params;

    const [clientes] = await pool.query(
      `SELECT c.*, CONCAT(c.nombre, ' ', IFNULL(c.apellido, '')) as nombreCompleto
       FROM clientes c
       WHERE c.id_clientes = ?
       LIMIT 1`,
      [id]
    );

    if (clientes.length === 0) {
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    }

    res.json({
      success: true,
      cliente: clientes[0]
    });

  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});



// resumen de cuotas de un cliente
router.get("/:id/cuotas", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }

    const { id } = req.params;

    // Obtener préstamos del cliente (usando columnas reales)
    const [prestamos] = await pool.query(
      `SELECT 
         p.id_prestamos,
         p.id_clientes,
         p.total_pagar AS totalPagar,
         p.cuota_diaria,
         p.fecha_inicio,
         p.fecha_final
       FROM prestamos p
       WHERE p.id_clientes = ?
       ORDER BY p.fecha_inicio DESC`,
      [id]
    );

    if (prestamos.length === 0) {
      return res.json({
        success: true,
        resumen: {
          cuotasPagadas: 0,
          cuotasPendientes: 0,
          cuotasMora: 0,
          totalPrestado: 0,
          totalPagado: 0,
          totalPendiente: 0,
          porcentajePago: 0
        }
      });
    }

    // Sumatoria de pagos agrupados por préstamo del cliente
    const [pagos] = await pool.query(
      `SELECT 
         pa.id_prestamos,
         COALESCE(SUM(pa.monto_pagos), 0) AS totalPagado,
         COUNT(pa.id_pagos) AS numeroPagos
       FROM pagos pa
       INNER JOIN prestamos p ON pa.id_prestamos = p.id_prestamos
       WHERE p.id_clientes = ?
       GROUP BY pa.id_prestamos`,
      [id]
    );

    const pagosPorPrestamo = new Map();
    pagos.forEach(row => {
      pagosPorPrestamo.set(row.id_prestamos, {
        totalPagado: parseFloat(row.totalPagado || 0),
        numeroPagos: parseInt(row.numeroPagos || 0)
      });
    });

    // Agregados totales
    let totalPrestado = 0;
    let totalPagadoCliente = 0;
    let totalPendiente = 0;
    let cuotasPagadas = 0;
    let cuotasPendientes = 0;
    let cuotasMora = 0; // TODO: calcular en base a fechas si se requiere

    prestamos.forEach(p => {
      const totalP = parseFloat(p.totalPagar || 0);
      const cuotaDiaria = parseFloat(p.cuota_diaria || 0);
      const pagosInfo = pagosPorPrestamo.get(p.id_prestamos) || { totalPagado: 0, numeroPagos: 0 };

      totalPrestado += totalP;
      totalPagadoCliente += pagosInfo.totalPagado;

      const pendientePrestamo = Math.max(0, totalP - pagosInfo.totalPagado);
      totalPendiente += pendientePrestamo;

      cuotasPagadas += pagosInfo.numeroPagos;
      if (cuotaDiaria > 0) {
        cuotasPendientes += Math.ceil(pendientePrestamo / cuotaDiaria);
      }
    });

    const porcentajePago = totalPrestado > 0 ? Math.round((totalPagadoCliente / totalPrestado) * 100) : 0;

    res.json({
      success: true,
      resumen: {
        cuotasPagadas: cuotasPagadas,
        cuotasPendientes: cuotasPendientes,
        cuotasMora: cuotasMora,
        totalPrestado: totalPrestado.toFixed(2),
        totalPagado: totalPagadoCliente.toFixed(2),
        totalPendiente: totalPendiente.toFixed(2),
        porcentajePago: porcentajePago
      }
    });

  } catch (error) {
    console.error("Error al obtener resumen de cuotas:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});



// ===ruta para mostrar los clientes que tien un trbjador en la vista del administrador
router.get('/trabajador/:trabajadorId', async (req, res) => {
  const { trabajadorId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
        c.id_clientes,
        CONCAT(c.nombre, ' ', c.apellido) AS nombre_completo,
        c.cedula,
        c.telefono,
        c.direccion,
        c.foto,
        p.fecha_inicio AS fecha_prestamo,
        p.total_pagar AS monto_prestado
      FROM clientes c
      LEFT JOIN prestamos p
        ON c.id_clientes = p.id_clientes
      WHERE c.id_trabajador = ?`,
      [trabajadorId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});



export default router;
