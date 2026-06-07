import { query } from "../config/db.js";

// BUSCAR POR CORREO
export const buscarUsuarioPorCorreo = async (correo) => {

  const rows = await query(
    `
    SELECT *
    FROM usuarios
    WHERE correo = ?
    LIMIT 1
    `,
    [correo]
  );

  return rows[0];
};

// BUSCAR POR ID
export const buscarUsuarioPorId = async (id) => {

  const rows = await query(
    `
    SELECT
      id_usuario,
      nombre,
      apellido,
      correo,
      rol,
      cedula,
      telefono
    FROM usuarios
    WHERE id_usuario = ?
    `,
    [id]
  );

  return rows[0];
};