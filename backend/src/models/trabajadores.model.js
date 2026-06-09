import { query } from "../config/db.js";

// ==========================================
// OBTENER TODOS LOS TRABAJADORES
// ==========================================

export const obtenerTodosLosTrabajadores =
  async () => {

    const rows = await query(`
      SELECT
        id_trabajador,
        nombre,
        apellido,
        correo,
        telefono,
        direccion,
        cargo,
        salario,
        estado,
        fecha_creacion
      FROM trabajadores
      ORDER BY id_trabajador DESC
    `);

    return rows;
  };

// ==========================================
// OBTENER TRABAJADOR POR ID
// ==========================================

export const obtenerTrabajadorPorId =
  async (id) => {

    const rows = await query(
      `
      SELECT
        id_trabajador,
        nombre,
        apellido,
        correo,
        telefono,
        direccion,
        cargo,
        salario,
        estado,
        fecha_creacion
      FROM trabajadores
      WHERE id_trabajador = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0];
  };

// ==========================================
// CREAR TRABAJADOR
// ==========================================

export const crearTrabajadorModel =
  async ({
    nombre,
    apellido,
    correo,
    telefono,
    direccion,
    cargo,
    salario
  }) => {

    const result = await query(
      `
      INSERT INTO trabajadores
      (
        nombre,
        apellido,
        correo,
        telefono,
        direccion,
        cargo,
        salario,
        estado
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nombre,
        apellido,
        correo,
        telefono,
        direccion,
        cargo,
        salario,
        "activo"
      ]
    );

    return result;
  };

// ==========================================
// ACTUALIZAR TRABAJADOR
// ==========================================

export const actualizarTrabajadorModel =
  async (
    id,
    {
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      cargo,
      salario,
      estado
    }
  ) => {

    const result = await query(
      `
      UPDATE trabajadores
      SET
        nombre = ?,
        apellido = ?,
        correo = ?,
        telefono = ?,
        direccion = ?,
        cargo = ?,
        salario = ?,
        estado = ?
      WHERE id_trabajador = ?
      `,
      [
        nombre,
        apellido,
        correo,
        telefono,
        direccion,
        cargo,
        salario,
        estado,
        id
      ]
    );

    return result;
  };

// ==========================================
// ELIMINAR TRABAJADOR
// ==========================================

export const eliminarTrabajadorModel =
  async (id) => {

    const result = await query(
      `
      DELETE FROM trabajadores
      WHERE id_trabajador = ?
      `,
      [id]
    );

    return result;
  };

// ==========================================
// VALIDAR CORREO EXISTENTE
// ==========================================

export const existeCorreoTrabajador =
  async (correo) => {

    const rows = await query(
      `
      SELECT id_trabajador
      FROM trabajadores
      WHERE correo = ?
      LIMIT 1
      `,
      [correo]
    );

    return rows.length > 0;
  };

// ==========================================
// OBTENER TRABAJADORES ACTIVOS
// ==========================================

export const obtenerTrabajadoresActivos =
  async () => {

    const rows = await query(
      `
      SELECT
        id_trabajador,
        nombre,
        apellido,
        cargo,
        telefono
      FROM trabajadores
      WHERE estado = 'activo'
      ORDER BY nombre ASC
      `
    );

    return rows;
  };