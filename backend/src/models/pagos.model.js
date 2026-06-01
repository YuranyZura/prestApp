import { query } from "../config/db.js";

// ==========================================
// OBTENER TODOS LOS PAGOS
// ==========================================

export const obtenerTodosLosPagos = async () => {

  const rows = await query(`
    SELECT
      p.id_pago,
      p.id_prestamo,
      p.monto_pagado,
      p.metodo_pago,
      p.estado,
      p.fecha_pago,

      pr.total_pagar,
      pr.estado AS estado_prestamo,

      c.nombre,
      c.apellido,
      c.telefono

    FROM pagos p

    INNER JOIN prestamos pr
      ON p.id_prestamo = pr.id_prestamo

    INNER JOIN clientes c
      ON pr.id_cliente = c.id_cliente

    ORDER BY p.id_pago DESC
  `);

  return rows;
};

// ==========================================
// OBTENER PAGO POR ID
// ==========================================

export const obtenerPagoPorId = async (
  id
) => {

  const rows = await query(
    `
    SELECT
      p.*,

      pr.total_pagar,
      pr.estado AS estado_prestamo,

      c.nombre,
      c.apellido,
      c.telefono

    FROM pagos p

    INNER JOIN prestamos pr
      ON p.id_prestamo = pr.id_prestamo

    INNER JOIN clientes c
      ON pr.id_cliente = c.id_cliente

    WHERE p.id_pago = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

// ==========================================
// CREAR PAGO
// ==========================================

export const crearPagoModel = async ({
  id_prestamo,
  monto_pagado,
  metodo_pago
}) => {

  const result = await query(
    `
    INSERT INTO pagos
    (
      id_prestamo,
      monto_pagado,
      metodo_pago,
      estado,
      fecha_pago
    )
    VALUES (?, ?, ?, ?, NOW())
    `,
    [
      id_prestamo,
      monto_pagado,
      metodo_pago,
      "completado"
    ]
  );

  return result;
};

// ==========================================
// ACTUALIZAR PAGO
// ==========================================

export const actualizarPagoModel = async (
  id,
  {
    monto_pagado,
    metodo_pago,
    estado
  }
) => {

  const result = await query(
    `
    UPDATE pagos
    SET
      monto_pagado = ?,
      metodo_pago = ?,
      estado = ?
    WHERE id_pago = ?
    `,
    [
      monto_pagado,
      metodo_pago,
      estado,
      id
    ]
  );

  return result;
};

// ==========================================
// ELIMINAR PAGO
// ==========================================

export const eliminarPagoModel = async (
  id
) => {

  const result = await query(
    `
    DELETE FROM pagos
    WHERE id_pago = ?
    `,
    [id]
  );

  return result;
};

// ==========================================
// OBTENER PAGOS POR PRÉSTAMO
// ==========================================

export const obtenerPagosPorPrestamo =
  async (id_prestamo) => {

    const rows = await query(
      `
      SELECT *
      FROM pagos
      WHERE id_prestamo = ?
      ORDER BY fecha_pago DESC
      `,
      [id_prestamo]
    );

    return rows;
  };

// ==========================================
// TOTAL PAGADO PRÉSTAMO
// ==========================================

export const totalPagadoPrestamo =
  async (id_prestamo) => {

    const rows = await query(
      `
      SELECT
        COALESCE(
          SUM(monto_pagado),
          0
        ) AS total_pagado
      FROM pagos
      WHERE id_prestamo = ?
      `,
      [id_prestamo]
    );

    return rows[0].total_pagado;
  };

// ==========================================
// VALIDAR SI EXISTE PAGO
// ==========================================

export const existePago = async (
  id
) => {

  const rows = await query(
    `
    SELECT id_pago
    FROM pagos
    WHERE id_pago = ?
    LIMIT 1
    `,
    [id]
  );

  return rows.length > 0;
};