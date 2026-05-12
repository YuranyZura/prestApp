import { query } from "../config/db.js";

// ==========================================
// OBTENER TODOS LOS PRÉSTAMOS
// ==========================================

export const obtenerTodosLosPrestamos = async () => {

  const rows = await query(`
    SELECT
      p.id_prestamo,
      p.monto,
      p.interes,
      p.total_pagar,
      p.cuotas,
      p.estado,
      p.fecha_inicio,
      p.fecha_fin,

      c.id_cliente,
      c.nombre,
      c.apellido,
      c.telefono

    FROM prestamos p

    INNER JOIN clientes c
      ON p.id_cliente = c.id_cliente

    ORDER BY p.id_prestamo DESC
  `);

  return rows;
};

// ==========================================
// OBTENER PRÉSTAMO POR ID
// ==========================================

export const obtenerPrestamoPorId = async (
  id
) => {

  const rows = await query(
    `
    SELECT
      p.*,

      c.nombre,
      c.apellido,
      c.telefono,
      c.cedula

    FROM prestamos p

    INNER JOIN clientes c
      ON p.id_cliente = c.id_cliente

    WHERE p.id_prestamo = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

// ==========================================
// CREAR PRÉSTAMO
// ==========================================

export const crearPrestamoModel = async ({
  id_cliente,
  monto,
  interes,
  cuotas,
  fecha_inicio,
  fecha_fin
}) => {

  // TOTAL A PAGAR
  const total_pagar =
    Number(monto) +
    (
      Number(monto) *
      Number(interes) / 100
    );

  const result = await query(
    `
    INSERT INTO prestamos
    (
      id_cliente,
      monto,
      interes,
      total_pagar,
      cuotas,
      estado,
      fecha_inicio,
      fecha_fin
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id_cliente,
      monto,
      interes,
      total_pagar,
      cuotas,
      "activo",
      fecha_inicio,
      fecha_fin
    ]
  );

  return result;
};

// ==========================================
// ACTUALIZAR PRÉSTAMO
// ==========================================

export const actualizarPrestamoModel = async (
  id,
  {
    monto,
    interes,
    cuotas,
    estado,
    fecha_inicio,
    fecha_fin
  }
) => {

  const total_pagar =
    Number(monto) +
    (
      Number(monto) *
      Number(interes) / 100
    );

  const result = await query(
    `
    UPDATE prestamos
    SET
      monto = ?,
      interes = ?,
      total_pagar = ?,
      cuotas = ?,
      estado = ?,
      fecha_inicio = ?,
      fecha_fin = ?
    WHERE id_prestamo = ?
    `,
    [
      monto,
      interes,
      total_pagar,
      cuotas,
      estado,
      fecha_inicio,
      fecha_fin,
      id
    ]
  );

  return result;
};

// ==========================================
// ELIMINAR PRÉSTAMO
// ==========================================

export const eliminarPrestamoModel = async (
  id
) => {

  const result = await query(
    `
    DELETE FROM prestamos
    WHERE id_prestamo = ?
    `,
    [id]
  );

  return result;
};

// ==========================================
// OBTENER PRÉSTAMOS POR CLIENTE
// ==========================================

export const obtenerPrestamosPorCliente =
  async (id_cliente) => {

    const rows = await query(
      `
      SELECT *
      FROM prestamos
      WHERE id_cliente = ?
      ORDER BY id_prestamo DESC
      `,
      [id_cliente]
    );

    return rows;
  };

// ==========================================
// VALIDAR SI EXISTE PRÉSTAMO
// ==========================================

export const existePrestamo = async (
  id
) => {

  const rows = await query(
    `
    SELECT id_prestamo
    FROM prestamos
    WHERE id_prestamo = ?
    LIMIT 1
    `,
    [id]
  );

  return rows.length > 0;
};