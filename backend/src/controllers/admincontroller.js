import bcrypt from "bcrypt";
import { query } from "../config/db.js";

/* =========================================
OBTENER TODOS LOS ADMINS
========================================= */
export const obtenerAdmins = async (req, res) => {

  try {

    const rows = await query(`
      SELECT
        id_usuarios,
        nombre,
        apellido,
        correo,
        rol,
        verificado,
        fecha_creacion
      FROM usuarios
      WHERE rol = 'administrador'
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
OBTENER ADMIN POR ID
========================================= */
export const obtenerAdminPorId = async (req, res) => {

  try {

    const { id } = req.params;

    const rows = await query(`
      SELECT
        id_usuarios,
        nombre,
        apellido,
        correo,
        rol,
        verificado,
        fecha_creacion
      FROM usuarios
      WHERE id_usuarios = ?
      AND rol = 'administrador'
    `, [id]);

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Administrador no encontrado"
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
CREAR ADMIN
========================================= */
export const crearAdmin = async (req, res) => {

  try {

    const {
      nombre,
      apellido,
      correo,
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
        password,
        rol,
        verificado
      )
      VALUES (?, ?, ?, ?, 'administrador', 1)
    `, [
      nombre,
      apellido,
      correo,
      hash
    ]);

    res.status(201).json({
      success: true,
      message: "Administrador creado",
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
ACTUALIZAR ADMIN
========================================= */
export const actualizarAdmin = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      apellido,
      correo
    } = req.body;

    await query(`
      UPDATE usuarios
      SET
        nombre = ?,
        apellido = ?,
        correo = ?
      WHERE id_usuarios = ?
      AND rol = 'administrador'
    `, [
      nombre,
      apellido,
      correo,
      id
    ]);

    res.json({
      success: true,
      message: "Administrador actualizado"
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
ELIMINAR ADMIN
========================================= */
export const eliminarAdmin = async (req, res) => {

  try {

    const { id } = req.params;

    await query(`
      DELETE FROM usuarios
      WHERE id_usuarios = ?
      AND rol = 'administrador'
    `, [id]);

    res.json({
      success: true,
      message: "Administrador eliminado"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });

  }

};