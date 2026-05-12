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
      id_usuarios,
      nombre,
      apellido,
      correo,
      rol
    FROM usuarios
    WHERE id_usuarios = ?
    `,
    [id]
  );

  return rows[0];
};