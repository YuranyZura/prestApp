import { query } from "../config/db.js";

export const obtenerPagos = async (req, res) => {

  try {

    const rows = await query(
      `SELECT * FROM pagos ORDER BY id_pago DESC`
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
