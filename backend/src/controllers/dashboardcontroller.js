import { query } from "../config/db.js";

export const obtenerDashboard = async (req, res) => {

  try {

    const clientes = await query(
      `SELECT COUNT(*) total FROM clientes`
    );

    const prestamos = await query(
      `SELECT COUNT(*) total FROM prestamos`
    );

    const pagos = await query(
      `SELECT COUNT(*) total FROM pagos`
    );

    res.json({
      success: true,
      data: {
        clientes: clientes[0].total,
        prestamos: prestamos[0].total,
        pagos: pagos[0].total
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};