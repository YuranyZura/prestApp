import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete
}
from "../config/api";

// =====================================
// OBTENER PRÉSTAMOS
// =====================================

export async function
obtenerPrestamos() {

  try {

    const data =
      await apiGet(
        "/prestamos"
      );

    if (
      data &&
      data.success
    ) {

      return (
        data.prestamos || []
      ).map(prestamo => ({

        ...prestamo,

        clienteNombre:
          prestamo.cliente_nombre ||

          `${prestamo.nombre || ""}
          ${prestamo.apellido || ""}`,

        estado:
          prestamo.estado ||
          "activo"
      }));
    }

    return [];

  } catch (error) {

    console.error(
      "Error obteniendo préstamos:",
      error
    );

    return [];
  }
}

// =====================================
// OBTENER PRÉSTAMO POR ID
// =====================================

export async function
obtenerPrestamo(id) {

  try {

    const data =
      await apiGet(
        `/prestamos/${id}`
      );

    if (
      data &&
      data.success
    ) {

      return {

        ...data.prestamo,

        clienteNombre:
          data.prestamo
            .cliente_nombre ||

          `${data.prestamo.nombre || ""}
          ${data.prestamo.apellido || ""}`
      };
    }

    return null;

  } catch (error) {

    console.error(
      "Error obteniendo préstamo:",
      error
    );

    return null;
  }
}

// =====================================
// CREAR PRÉSTAMO
// =====================================

export async function
crearPrestamo(prestamo) {

  try {

    const data =
      await apiPost(
        "/prestamos",
        prestamo
      );

    return data;

  } catch (error) {

    console.error(
      "Error creando préstamo:",
      error
    );

    throw error;
  }
}

// =====================================
// ACTUALIZAR PRÉSTAMO
// =====================================

export async function
actualizarPrestamo(
  id,
  prestamo
) {

  try {

    const data =
      await apiPut(
        `/prestamos/${id}`,
        prestamo
      );

    return data;

  } catch (error) {

    console.error(
      "Error actualizando préstamo:",
      error
    );

    throw error;
  }
}

// =====================================
// ELIMINAR PRÉSTAMO
// =====================================

export async function
eliminarPrestamo(id) {

  try {

    const data =
      await apiDelete(
        `/prestamos/${id}`
      );

    return data;

  } catch (error) {

    console.error(
      "Error eliminando préstamo:",
      error
    );

    throw error;
  }
}

// =====================================
// APROBAR PRÉSTAMO
// =====================================

export async function
aprobarPrestamo(id) {

  try {

    const data =
      await apiPut(
        `/prestamos/${id}/aprobar`,
        {}
      );

    return data;

  } catch (error) {

    console.error(
      "Error aprobando préstamo:",
      error
    );

    throw error;
  }
}

// =====================================
// RECHAZAR PRÉSTAMO
// =====================================

export async function
rechazarPrestamo(id) {

  try {

    const data =
      await apiPut(
        `/prestamos/${id}/rechazar`,
        {}
      );

    return data;

  } catch (error) {

    console.error(
      "Error rechazando préstamo:",
      error
    );

    throw error;
  }
}

// =====================================
// OBTENER PRÉSTAMOS ACTIVOS
// =====================================

export async function
obtenerPrestamosActivos() {

  try {

    const prestamos =
      await obtenerPrestamos();

    return prestamos.filter(
      prestamo =>
        prestamo.estado ===
        "activo"
    );

  } catch (error) {

    console.error(
      "Error préstamos activos:",
      error
    );

    return [];
  }
}

// =====================================
// OBTENER PRÉSTAMOS VENCIDOS
// =====================================

export async function
obtenerPrestamosVencidos() {

  try {

    const prestamos =
      await obtenerPrestamos();

    return prestamos.filter(
      prestamo =>
        prestamo.estado ===
        "vencido"
    );

  } catch (error) {

    console.error(
      "Error préstamos vencidos:",
      error
    );

    return [];
  }
}