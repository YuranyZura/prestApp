import { query } from "../config/db.js";

export const obtenerClientes = async (req, res) => {

  try {

    const rows = await query(
      `SELECT * FROM clientes ORDER BY id_cliente DESC`
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.error(error);

    res. status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};