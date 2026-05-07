import { Router } from "express";
import { query } from "../config/db.js";
import pool from "../config/db.js";

import fetch from "node-fetch";
import multer from "multer";
import path from "path";

import { verificarToken } from "../middleware/auth.js";
import { soloAdmin, soloTrabajador } from "../middleware/roles.js";
import { deleteFile } from "../config/uploads.js";

const router = Router();

// ==========================================
// MULTER (IMÁGENES)
// ==========================================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.random();
    cb(null, "cliente-" + unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);

    if (ext && mime) cb(null, true);
    else cb(new Error("Solo imágenes válidas"));
  }
});

// ==========================================
// GEOLOCALIZAR (CON TIMEOUT)
// ==========================================
async function geolocalizar(direccion) {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(direccion)}`;

    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "PrestApp",
        "Accept-Language": "es"
      }
    });

    const data = await resp.json();

    if (!data.length) return { latitud: null, longitud: null };

    return {
      latitud: parseFloat(data[0].lat),
      longitud: parseFloat(data[0].lon)
    };

  } catch {
    return { latitud: null, longitud: null };
  }
}

// ==========================================
// VALIDAR ID
// ==========================================
function validarId(id) {
  return Number.isInteger(Number(id));
}

// ==========================================
// GET CLIENTES
// ==========================================
router.get("/", verificarToken, async (req, res) => {
  try {
    const rows = await query(`
      SELECT id_clientes, nombre, apellido, cedula, telefono, direccion, foto, latitud, longitud
      FROM clientes
      ORDER BY nombre ASC
    `);

    const clientes = rows.map(c => ({
      ...c,
      foto: c.foto
        ? `${req.protocol}://${req.get("host")}/uploads/${c.foto}`
        : null
    }));

    res.json({ success: true, clientes });

  } catch {
    res.status(500).json({ success: false });
  }
});

// ==========================================
// CREAR CLIENTE
// ==========================================
router.post("/", verificarToken, soloTrabajador, async (req, res) => {
  try {
    const { nombreCompleto, cedula, telefono, direccion } = req.body;

    if (!nombreCompleto || !cedula || !telefono || !direccion) {
      return res.status(400).json({ success: false, message: "Campos requeridos" });
    }

    if (!/^\d+$/.test(cedula)) {
      return res.status(400).json({ message: "Cédula inválida" });
    }

    const partes = nombreCompleto.split(" ");
    const nombre = partes[0];
    const apellido = partes.slice(1).join(" ");

    const existe = await query(
      "SELECT id_clientes FROM clientes WHERE cedula = ?",
      [cedula]
    );

    if (existe.length) {
      return res.status(400).json({ message: "Cédula ya existe" });
    }

    const geo = await geolocalizar(direccion);

    const result = await query(`
      INSERT INTO clientes
      (nombre, apellido, cedula, telefono, direccion, latitud, longitud)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [nombre, apellido, cedula, telefono, direccion, geo.latitud, geo.longitud]);

    res.json({
      success: true,
      message: "Cliente creado",
      id: result.insertId
    });

  } catch {
    res.status(500).json({ success: false });
  }
});

// ==========================================
// DETALLE
// ==========================================
router.get("/:id", verificarToken, async (req, res) => {

  const { id } = req.params;

  if (!validarId(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const rows = await query(
      "SELECT * FROM clientes WHERE id_clientes = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "No encontrado" });
    }

    const cliente = rows[0];

    if (cliente.foto) {
      cliente.foto = `${req.protocol}://${req.get("host")}/uploads/${cliente.foto}`;
    }

    res.json({ success: true, cliente });

  } catch {
    res.status(500).json({ success: false });
  }
});

// ==========================================
// ACTUALIZAR
// ==========================================
router.put(
  "/:id",
  verificarToken,
  soloTrabajador,
  upload.single("foto"),
  async (req, res) => {

    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    try {

      const sets = [];
      const values = [];

      if (req.body.nombreCompleto) {
        const partes = req.body.nombreCompleto.split(" ");
        sets.push("nombre=?", "apellido=?");
        values.push(partes[0], partes.slice(1).join(" "));
      }

      if (req.body.telefono) {
        sets.push("telefono=?");
        values.push(req.body.telefono);
      }

      if (req.body.direccion) {
        const geo = await geolocalizar(req.body.direccion);
        sets.push("direccion=?", "latitud=?", "longitud=?");
        values.push(req.body.direccion, geo.latitud, geo.longitud);
      }

      if (req.file) {

        const old = await query(
          "SELECT foto FROM clientes WHERE id_clientes = ?",
          [id]
        );

        if (old[0]?.foto) {
          deleteFile(old[0].foto);
        }

        sets.push("foto=?");
        values.push(req.file.filename);
      }

      if (!sets.length) {
        return res.status(400).json({ message: "Nada para actualizar" });
      }

      await query(
        `UPDATE clientes SET ${sets.join(",")} WHERE id_clientes = ?`,
        [...values, id]
      );

      res.json({ success: true, message: "Actualizado" });

    } catch {
      res.status(500).json({ success: false });
    }
  }
);

// ==========================================
// ELIMINAR (CON TRANSACCIÓN)
// ==========================================
router.delete("/:id", verificarToken, soloAdmin, async (req, res) => {

  const { id } = req.params;

  if (!validarId(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const conn = await pool.getConnection();

  try {

    await conn.beginTransaction();

    const [cliente] = await conn.query(
      "SELECT foto FROM clientes WHERE id_clientes = ?",
      [id]
    );

    if (cliente[0]?.foto) {
      deleteFile(cliente[0].foto);
    }

    await conn.query(`
      DELETE pagos FROM pagos
      INNER JOIN prestamos
      ON pagos.id_prestamos = prestamos.id_prestamos
      WHERE prestamos.id_clientes = ?
    `, [id]);

    await conn.query(
      "DELETE FROM prestamos WHERE id_clientes = ?",
      [id]
    );

    await conn.query(
      "DELETE FROM clientes WHERE id_clientes = ?",
      [id]
    );

    await conn.commit();

    res.json({ success: true, message: "Eliminado correctamente" });

  } catch (err) {

    await conn.rollback();

    res.status(500).json({ success: false });

  } finally {
    conn.release();
  }
});

export default router;