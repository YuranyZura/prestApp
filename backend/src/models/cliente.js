// ==========================================
// MODELO CLIENTES
// backend/src/models/cliente.js
// ==========================================

import { query } from "../config/db.js";

/* ==========================================
OBTENER CLIENTES
========================================== */

export const obtenerClientesModel = async () => {

  const sql = `
    SELECT *
    FROM clientes
    ORDER BY fecha_creacion DESC
  `;

  return await query(sql);
};

/* ==========================================
OBTENER CLIENTE POR ID
========================================== */

export const obtenerClientePorIdModel = async (id) => {

  const sql = `
    SELECT *
    FROM clientes
    WHERE id_cliente = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);

  return rows[0];
};

/* ==========================================
CREAR CLIENTE
========================================== */

export const crearClienteModel = async (datos) => {

  const {
    nombre,
    apellido,
    telefono,
    direccion,
    cedula,
    correo
  } = datos;

  const sql = `
    INSERT INTO clientes (
      nombre,
      apellido,
      telefono,
      direccion,
      cedula,
      correo
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return await query(sql, [
    nombre,
    apellido,
    telefono,
    direccion,
    cedula,
    correo
  ]);
};

/* ==========================================
ACTUALIZAR CLIENTE
========================================== */

export const actualizarClienteModel = async (id, datos) => {

  const {
    nombre,
    apellido,
    telefono,
    direccion,
    cedula,
    correo
  } = datos;

  const sql = `
    UPDATE clientes
    SET
      nombre = ?,
      apellido = ?,
      telefono = ?,
      direccion = ?,
      cedula = ?,
      correo = ?
    WHERE id_cliente = ?
  `;

  return await query(sql, [
    nombre,
    apellido,
    telefono,
    direccion,
    cedula,
    correo,
    id
  ]);
};

/* ==========================================
ELIMINAR CLIENTE
========================================== */

export const eliminarClienteModel = async (id) => {

  const sql = `
    DELETE FROM clientes
    WHERE id_cliente = ?
  `;

  return await query(sql, [id]);
};