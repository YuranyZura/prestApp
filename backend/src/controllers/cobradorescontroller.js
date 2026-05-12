import { query } from "../config/db.js";

export const obtenerCobradores = async (req, res) => {

  try {

    const rows = await query(
      `SELECT * FROM usuarios WHERE rol = 'cobrador'`
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
