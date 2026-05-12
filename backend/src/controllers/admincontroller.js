import bcrypt from "bcrypt";
import { query } from "../config/db.js";

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