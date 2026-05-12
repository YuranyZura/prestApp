import { query } from "../config/db.js";

// ==========================================
// OBTENER TODOS LOS CLIENTES
// ==========================================

export const obtenerTodosLosClientes = async () => {

  const rows = await query(`
    SELECT
      id_cliente,
      nombre,
      apellido,
      telefono,
      direccion,
      cedula,
      estado,
      fecha_creacion
    FROM clientes
    ORDER BY id_cliente DESC
  `);

  return rows;
};

// ==========================================
// OBTENER CLIENTE POR ID
// ==========================================

export const obtenerClientePorId = async (id) => {

  const rows = await query(
    `
    SELECT
      id_cliente,
      nombre,
      apellido,
      telefono,
      direccion,
      cedula,
      estado,
      fecha_creacion
    FROM clientes
    WHERE id_cliente = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

// ==========================================
// CREAR CLIENTE
// ==========================================

export const crearClienteModel = async ({
  nombre,
  apellido,
  telefono,
  direccion,
  cedula
}) => {

  const result = await query(
    `
    INSERT INTO clientes
    (
      nombre,
      apellido,
      telefono,
      direccion,
      cedula
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      nombre,
      apellido,
      telefono,
      direccion,
      cedula
    ]
  );

  return result;
};

// ==========================================
// ACTUALIZAR CLIENTE
// ==========================================

export const actualizarClienteModel = async (
  id,
  {
    nombre,
    apellido,
    telefono,
    direccion,
    cedula,
    estado
  }
) => {

  const result = await query(
    `
    UPDATE clientes
    SET
      nombre = ?,
      apellido = ?,
      telefono = ?,
      direccion = ?,
      cedula = ?,
      estado = ?
    WHERE id_cliente = ?
    `,
    [
      nombre,
      apellido,
      telefono,
      direccion,
      cedula,
      estado,
      id
    ]
  );

  return result;
};

// ==========================================
// ELIMINAR CLIENTE
// ==========================================

export const eliminarClienteModel = async (
  id
) => {

  const result = await query(
    `
    DELETE FROM clientes
    WHERE id_cliente = ?
    `,
    [id]
  );

  return result;
};

// ==========================================
// VALIDAR CÉDULA EXISTENTE
// ==========================================

export const existeCedula = async (
  cedula
) => {

  const rows = await query(
    `
    SELECT id_cliente
    FROM clientes
    WHERE cedula = ?
    LIMIT 1
    `,
    [cedula]
  );

  return rows.length > 0;
};