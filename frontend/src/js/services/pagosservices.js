import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete
}
from "./api.js";

// =====================================
// OBTENER PAGOS
// =====================================

export async function
obtenerPagos() {

  try {

    const data =
      await apiGet(
        "/pagos"
      );

    if (
      data &&
      data.success
    ) {

      return (
        data.pagos || []
      ).map(pago => ({

        ...pago,

        clienteNombre:
          pago.cliente_nombre ||

          `${pago.nombre || ""}
          ${pago.apellido || ""}`,

        estado:
          pago.estado ||
          "pendiente"
      }));
    }

    return [];

  } catch (error) {

    console.error(
      "Error obteniendo pagos:",
      error
    );

    return [];
  }
}

// =====================================
// OBTENER PAGO POR ID
// =====================================

export async function
obtenerPago(id) {

  try {

    const data =
      await apiGet(
        `/pagos/${id}`
      );

    if (
      data &&
      data.success
    ) {

      return {

        ...data.pago,

        clienteNombre:
          data.pago
            .cliente_nombre ||

          `${data.pago.nombre || ""}
          ${data.pago.apellido || ""}`
      };
    }

    return null;

  } catch (error) {

    console.error(
      "Error obteniendo pago:",
      error
    );

    return null;
  }
}

// =====================================
// CREAR PAGO
// =====================================

export async function
crearPago(pago) {

  try {

    const data =
      await apiPost(
        "/pagos",
        pago
      );

    return data;

  } catch (error) {

    console.error(
      "Error creando pago:",
      error
    );

    throw error;
  }
}

// =====================================
// ACTUALIZAR PAGO
// =====================================

export async function
actualizarPago(
  id,
  pago
) {

  try {

    const data =
      await apiPut(
        `/pagos/${id}`,
        pago
      );

    return data;

  } catch (error) {

    console.error(
      "Error actualizando pago:",
      error
    );

    throw error;
  }
}

// =====================================
// ELIMINAR PAGO
// =====================================

export async function
eliminarPago(id) {

  try {

    const data =
      await apiDelete(
        `/pagos/${id}`
      );

    return data;

  } catch (error) {

    console.error(
      "Error eliminando pago:",
      error
    );

    throw error;
  }
}

// =====================================
// REGISTRAR COBRO
// =====================================

export async function
registrarCobro(id) {

  try {

    const data =
      await apiPut(
        `/pagos/${id}/cobrar`,
        {}
      );

    return data;

  } catch (error) {

    console.error(
      "Error registrando cobro:",
      error
    );

    throw error;
  }
}

// =====================================
// OBTENER PAGOS PENDIENTES
// =====================================

export async function
obtenerPagosPendientes() {

  try {

    const pagos =
      await obtenerPagos();

    return pagos.filter(
      pago =>
        pago.estado ===
        "pendiente"
    );

  } catch (error) {

    console.error(
      "Error pagos pendientes:",
      error
    );

    return [];
  }
}

// =====================================
// OBTENER PAGOS PAGADOS
// =====================================

export async function
obtenerPagosPagados() {

  try {

    const pagos =
      await obtenerPagos();

    return pagos.filter(
      pago =>
        pago.estado ===
        "pagado"
    );

  } catch (error) {

    console.error(
      "Error pagos pagados:",
      error
    );

    return [];
  }
}

// =====================================
// OBTENER PAGOS VENCIDOS
// =====================================

export async function
obtenerPagosVencidos() {

  try {

    const pagos =
      await obtenerPagos();

    return pagos.filter(
      pago =>
        pago.estado ===
        "vencido"
    );

  } catch (error) {

    console.error(
      "Error pagos vencidos:",
      error
    );

    return [];
  }
}

// =====================================
// OBTENER PAGOS RECIENTES
// =====================================

export async function
obtenerPagosRecientes() {

  try {

    const data =
      await apiGet(
        "/pagos/recientes"
      );

    if (
      data &&
      data.success
    ) {

      return data.pagos || [];
    }

    return [];

  } catch (error) {

    console.error(
      "Error pagos recientes:",
      error
    );

    return [];
  }
}