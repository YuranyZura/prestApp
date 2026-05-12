import { query } from "../config/db.js";

export const obtenerTrabajadores = async (req, res) => {

  try {

    const rows = await query(
      `SELECT * FROM trabajadores ORDER BY id_trabajador DESC`
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};
