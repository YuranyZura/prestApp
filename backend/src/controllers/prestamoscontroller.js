import { query } from "../config/db.js";

export const obtenerPrestamos = async (req, res) => {

  try {

    const rows = await query(
      `SELECT * FROM prestamos ORDER BY id_prestamo DESC`
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