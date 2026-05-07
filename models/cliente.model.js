import pool from "../config/db.js";

export const getAll = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id_clientes,
      nombre,
      apellido,
      cedula,
      telefono,
      direccion,
      latitud,
      longitud
    FROM clientes
    ORDER BY nombre ASC
  `);

  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM clientes WHERE id_clientes = ? LIMIT 1",
    [id]
  );

  return rows[0];
};

export const create = async (cliente) => {
  const {
    nombre,
    apellido,
    cedula,
    telefono,
    direccion
  } = cliente;

  const [result] = await pool.query(
    `INSERT INTO clientes 
    (nombre, apellido, cedula, telefono, direccion)
    VALUES (?, ?, ?, ?, ?)`,
    [nombre, apellido, cedula, telefono, direccion]
  );

  return result.insertId;
};