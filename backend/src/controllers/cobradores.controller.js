import bcrypt from "bcrypt";
import { query } from "../config/db.js";

/* =========================================
OBTENER COBRADORES
========================================= */
export const obtenerCobradores = async (req, res) => {

  try {

    const rows = await query(`
      SELECT
        id_usuarios,
        nombre,
        apellido,
        correo,
        telefono,
        rol,
        verificado,
        fecha_creacion
      FROM usuarios
      WHERE rol = 'cobrador'
      ORDER BY fecha_creacion DESC
    `);

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });

  }

};

/* =========================================
OBTENER COBRADOR POR ID
========================================= */
export const obtenerCobradorPorId = async (req, res) => {

  try {

    const { id } = req.params;

    const rows = await query(`
      SELECT
        id_usuarios,
        nombre,
        apellido,
        correo,
        telefono,
        rol,
        verificado
      FROM usuarios
      WHERE id_usuarios = ?
      AND rol = 'cobrador'
    `, [id]);

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Cobrador no encontrado"
      });

    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });

  }

};

/* =========================================
CREAR COBRADOR
========================================= */
export const crearCobrador = async (req, res) => {

  try {

    const {
      nombre,
      apellido,
      correo,
      telefono,
      password
    } = req.body;

    const existe = await query(`
      SELECT id_usuarios
      FROM usuarios
      WHERE correo = ?
    `, [correo]);

    if (existe.length > 0) {

      return res.status(400).json({
        success: false,
        message: "El correo ya existe"
      });

    }

    const hash = await bcrypt.hash(password, 10);

    const result = await query(`
      INSERT INTO usuarios (
        nombre,
        apellido,
        correo,
        telefono,
        password,
        rol,
        verificado
      )
      VALUES (?, ?, ?, ?, ?, 'cobrador', 1)
    `, [
      nombre,
      apellido,
      correo,
      telefono,
      hash
    ]);

    res.status(201).json({
      success: true,
      message: "Cobrador creado",
      id: result.insertId
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });

  }

};

/* =========================================
ACTUALIZAR COBRADOR
========================================= */
export const actualizarCobrador = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      apellido,
      correo,
      telefono
    } = req.body;

    await query(`
      UPDATE usuarios
      SET
        nombre = ?,
        apellido = ?,
        correo = ?,
        telefono = ?
      WHERE id_usuarios = ?
      AND rol = 'cobrador'
    `, [
      nombre,
      apellido,
      correo,
      telefono,
      id
    ]);

    res.json({
      success: true,
      message: "Cobrador actualizado"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });

  }

};

/* =========================================
ELIMINAR COBRADOR
========================================= */
export const eliminarCobrador = async (req, res) => {

  try {

    const { id } = req.params;

    await query(`
      DELETE FROM usuarios
      WHERE id_usuarios = ?
      AND rol = 'cobrador'
    `, [id]);

    res.json({
      success: true,
      message: "Cobrador eliminado"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });

  }

};