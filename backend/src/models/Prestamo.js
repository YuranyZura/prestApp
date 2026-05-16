// ==========================================
// MODELO PRESTAMO
// backend/src/models/prestamo.js
// SIN SEQUELIZE
// ==========================================

import { query } from "../config/db.js";

/* ==========================================
OBTENER TODOS LOS PRÉSTAMOS
========================================== */

export const obtenerPrestamosModel = async () => {

  const sql = `
    SELECT *
    FROM prestamos
    ORDER BY fecha_creacion DESC
  `;

  return await query(sql);
};

/* ==========================================
OBTENER PRÉSTAMO POR ID
========================================== */

export const obtenerPrestamoPorIdModel = async (id) => {

  const sql = `
    SELECT *
    FROM prestamos
    WHERE id_prestamo = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);

  return rows[0];
};

/* ==========================================
CREAR PRÉSTAMO
========================================== */

export const crearPrestamoModel = async (data) => {

  const {
    id_cliente,
    monto,
    interes,
    cuotas,
    fecha_inicio,
    estado
  } = data;

  const sql = `
    INSERT INTO prestamos (
      id_cliente,
      monto,
      interes,
      cuotas,
      fecha_inicio,
      estado
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return await query(sql, [
    id_cliente,
    monto,
    interes,
    cuotas,
    fecha_inicio,
    estado
  ]);
};

/* ==========================================
ACTUALIZAR PRÉSTAMO
========================================== */

export const actualizarPrestamoModel = async (id, data) => {

  const {
    monto,
    interes,
    cuotas,
    estado
  } = data;

  const sql = `
    UPDATE prestamos
    SET
      monto = ?,
      interes = ?,
      cuotas = ?,
      estado = ?
    WHERE id_prestamo = ?
  `;

  return await query(sql, [
    monto,
    interes,
    cuotas,
    estado,
    id
  ]);
};

/* ==========================================
ELIMINAR PRÉSTAMO
========================================== */

export const eliminarPrestamoModel = async (id) => {

  const sql = `
    DELETE FROM prestamos
    WHERE id_prestamo = ?
  `;

  return await query(sql, [id]);
};