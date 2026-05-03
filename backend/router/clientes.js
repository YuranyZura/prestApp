// ==========================================
// backend/router/clientes.js
// PRESTAPP - CLIENTES PRO (CORREGIDO)
// JWT + MULTER + GEOLOCALIZACIÓN
// ==========================================

import { Router } from "express";
import pool from "../config/db.js";
import fetch from "node-fetch";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { verificarToken } from "../middleware/auth.js";

const router = Router();

// ==========================================
// __dirname ES MODULES
// ==========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// MULTER CONFIG
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      "cliente-" +
        unique +
        path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    const allowed =
      /jpeg|jpg|png|gif/;

    const ext = allowed.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mime = allowed.test(
      file.mimetype
    );

    if (ext && mime) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Solo imágenes permitidas"
        )
      );
    }
  }
});

// ==========================================
// GEOLOCALIZAR DIRECCIÓN
// ==========================================
async function geolocalizar(direccion) {
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(direccion)}`;

    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "PrestApp/1.0",
        "Accept-Language":
          "es"
      }
    });

    if (!resp.ok) {
      return {
        latitud: null,
        longitud: null
      };
    }

    const data = await resp.json();

    if (!data.length) {
      return {
        latitud: null,
        longitud: null
      };
    }

    return {
      latitud: parseFloat(data[0].lat),
      longitud: parseFloat(data[0].lon)
    };

  } catch {
    return {
      latitud: null,
      longitud: null
    };
  }
}

// ==========================================
// LISTAR CLIENTES
// GET /api/clientes
// ==========================================
router.get(
  "/",
  verificarToken,
  async (req, res) => {
    try {
      const [rows] =
        await pool.query(`
        SELECT
          id_clientes,
          nombre,
          apellido,
          cedula,
          telefono,
          direccion,
          foto,
          latitud,
          longitud,
          CONCAT(nombre,' ',IFNULL(apellido,'')) nombreCompleto
        FROM clientes
        ORDER BY nombre ASC
      `);

      res.json({
        success: true,
        clientes: rows
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Error listando clientes"
      });
    }
  }
);

// ==========================================
// CREAR CLIENTE
// POST /api/clientes
// ==========================================
router.post(
  "/",
  verificarToken,
  async (req, res) => {
    try {
      const {
        nombreCompleto,
        cedula,
        telefono,
        direccion,
        ciudad,
        fechaNacimiento
      } = req.body;

      if (
        !nombreCompleto ||
        !cedula ||
        !telefono ||
        !direccion
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Campos incompletos"
        });
      }

      const partes =
        nombreCompleto
          .trim()
          .split(/\s+/);

      const nombre = partes[0];
      const apellido =
        partes.slice(1).join(" ");

      const dirFinal = ciudad
        ? `${direccion}, ${ciudad}`
        : direccion;

      const [existe] =
        await pool.query(
          `
        SELECT id_clientes
        FROM clientes
        WHERE cedula = ?
        LIMIT 1
      `,
          [cedula]
        );

      if (existe.length) {
        return res.status(400).json({
          success: false,
          message:
            "Ya existe esa cédula"
        });
      }

      const geo =
        await geolocalizar(
          dirFinal
        );

      const [result] =
        await pool.query(
          `
        INSERT INTO clientes
        (
          nombre,
          apellido,
          cedula,
          telefono,
          direccion,
          fecha_nacimiento,
          latitud,
          longitud
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
          [
            nombre,
            apellido,
            cedula,
            telefono,
            dirFinal,
            fechaNacimiento ||
              null,
            geo.latitud,
            geo.longitud
          ]
        );

      res.json({
        success: true,
        message:
          "Cliente creado",
        id:
          result.insertId
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Error creando cliente"
      });
    }
  }
);

// ==========================================
// DETALLE CLIENTE
// GET /api/clientes/:id
// ==========================================
router.get(
  "/:id",
  verificarToken,
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const [rows] =
        await pool.query(
          `
        SELECT *,
        CONCAT(nombre,' ',IFNULL(apellido,'')) nombreCompleto
        FROM clientes
        WHERE id_clientes = ?
        LIMIT 1
      `,
          [id]
        );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message:
            "Cliente no encontrado"
        });
      }

      res.json({
        success: true,
        cliente:
          rows[0]
      });

    } catch (error) {
      res.status(500).json({
        success: false
      });
    }
  }
);

// ==========================================
// ACTUALIZAR CLIENTE
// PUT /api/clientes/:id
// ==========================================
router.put(
  "/:id",
  verificarToken,
  upload.single("foto"),
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        nombreCompleto,
        cedula,
        telefono,
        direccion,
        ciudad
      } = req.body;

      const sets = [];
      const values = [];

      if (nombreCompleto) {
        const partes =
          nombreCompleto
            .trim()
            .split(/\s+/);

        sets.push(
          "nombre=?",
          "apellido=?"
        );

        values.push(
          partes[0],
          partes
            .slice(1)
            .join(" ")
        );
      }

      if (cedula) {
        sets.push(
          "cedula=?"
        );
        values.push(
          cedula
        );
      }

      if (telefono) {
        sets.push(
          "telefono=?"
        );
        values.push(
          telefono
        );
      }

      if (direccion) {
        const dir =
          ciudad
            ? `${direccion}, ${ciudad}`
            : direccion;

        const geo =
          await geolocalizar(
            dir
          );

        sets.push(
          "direccion=?",
          "latitud=?",
          "longitud=?"
        );

        values.push(
          dir,
          geo.latitud,
          geo.longitud
        );
      }

      if (req.file) {
        sets.push(
          "foto=?"
        );
        values.push(
          req.file
            .filename
        );
      }

      if (!sets.length) {
        return res.status(400).json({
          success: false,
          message:
            "Nada para actualizar"
        });
      }

      await pool.query(
        `
        UPDATE clientes
        SET ${sets.join(",")}
        WHERE id_clientes = ?
      `,
        [...values, id]
      );

      res.json({
        success: true,
        message:
          "Cliente actualizado"
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
// ELIMINAR CLIENTE
// DELETE /api/clientes/:id
// ==========================================
router.delete(
  "/:id",
  verificarToken,
  async (req, res) => {
    try {
      const { id } =
        req.params;

      await pool.query(
        `
        DELETE pagos
        FROM pagos
        INNER JOIN prestamos
        ON pagos.id_prestamos =
        prestamos.id_prestamos
        WHERE prestamos.id_clientes = ?
      `,
        [id]
      );

      await pool.query(
        `
        DELETE FROM prestamos
        WHERE id_clientes = ?
      `,
        [id]
      );

      await pool.query(
        `
        DELETE FROM clientes
        WHERE id_clientes = ?
      `,
        [id]
      );

      res.json({
        success: true,
        message:
          "Cliente eliminado"
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
// RESUMEN CUOTAS
// GET /api/clientes/:id/cuotas
// ==========================================
router.get(
  "/:id/cuotas",
  verificarToken,
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const [rows] =
        await pool.query(
          `
        SELECT
          COUNT(*) totalPrestamos,
          IFNULL(SUM(total_pagar),0) totalPrestado
        FROM prestamos
        WHERE id_clientes = ?
      `,
          [id]
        );

      res.json({
        success: true,
        resumen:
          rows[0]
      });

    } catch (error) {
      res.status(500).json({
        success: false
      });
    }
  }
);

export default router;