import { query } from "../config/db.js";

/* =========================================
OBTENER CLIENTES
========================================= */
export const obtenerClientes = async (req, res) => {

  try {

    const rows = await query(`
      SELECT
        id_cliente,
        nombre,
        apellido,
        telefono,
        direccion,
        cedula,
        CONCAT(nombre, ' ', apellido) AS nombreCompleto
      FROM clientes
      ORDER BY id_cliente DESC
    `);

    res.json({
      success: true,
      clientes: rows
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
OBTENER CLIENTE POR ID
========================================= */
export const obtenerClientePorId = async (req, res) => {

  try {

    const { id } = req.params;

    const rows = await query(`
      SELECT *
      FROM clientes
      WHERE id_cliente = ?
    `, [id]);

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
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
CREAR CLIENTE
========================================= */
export const crearCliente = async (req, res) => {

  try {

    const {
      nombre,
      apellido,
      telefono,
      direccion,
      cedula
    } = req.body;

    const result = await query(`
      INSERT INTO clientes (
        nombre,
        apellido,
        telefono,
        direccion,
        cedula
      )
      VALUES (?, ?, ?, ?, ?)
    `, [
      nombre,
      apellido,
      telefono,
      direccion,
      cedula
    ]);

    res.status(201).json({
      success: true,
      message: "Cliente creado",
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
ACTUALIZAR CLIENTE
========================================= */
export const actualizarCliente = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      apellido,
      telefono,
      direccion,
      cedula
    } = req.body;

    await query(`
      UPDATE clientes
      SET
        nombre = ?,
        apellido = ?,
        telefono = ?,
        direccion = ?,
        cedula = ?
      WHERE id_cliente = ?
    `, [
      nombre,
      apellido,
      telefono,
      direccion,
      cedula,
      id
    ]);

    res.json({
      success: true,
      message: "Cliente actualizado"
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
ELIMINAR CLIENTE
========================================= */
export const eliminarCliente = async (req, res) => {

  try {

    const { id } = req.params;

    await query(`
      DELETE FROM clientes
      WHERE id_cliente = ?
    `, [id]);

    res.json({
      success: true,
      message: "Cliente eliminado"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });

  }

};