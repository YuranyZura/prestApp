import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete
}
from "./api.js";

// =====================================
// OBTENER CLIENTES
// =====================================

export async function
obtenerClientes() {

  try {

    const data =
      await apiGet(
        "/clientes"
      );

    if (
      data &&
      data.success
    ) {

      return (
        data.clientes || []
      ).map(cliente => ({

        ...cliente,

        nombreCompleto:
          `${cliente.nombre || ""}
          ${cliente.apellido || ""}`,

        estado:
          cliente.estado ||
          "activo"
      }));
    }

    return [];

  } catch (error) {

    console.error(
      "Error obteniendo clientes:",
      error
    );

    return [];
  }
}

// =====================================
// OBTENER CLIENTE POR ID
// =====================================

export async function
obtenerCliente(id) {

  try {

    const data =
      await apiGet(
        `/clientes/${id}`
      );

    if (
      data &&
      data.success
    ) {

      return {

        ...data.cliente,

        nombreCompleto:
          `${data.cliente.nombre || ""}
          ${data.cliente.apellido || ""}`
      };
    }

    return null;

  } catch (error) {

    console.error(
      "Error obteniendo cliente:",
      error
    );

    return null;
  }
}

// =====================================
// CREAR CLIENTE
// =====================================

export async function
crearCliente(cliente) {

  try {

    const data =
      await apiPost(
        "/clientes",
        cliente
      );

    return data;

  } catch (error) {

    console.error(
      "Error creando cliente:",
      error
    );

    throw error;
  }
}

// =====================================
// ACTUALIZAR CLIENTE
// =====================================

export async function
actualizarCliente(
  id,
  cliente
) {

  try {

    const data =
      await apiPut(
        `/clientes/${id}`,
        cliente
      );

    return data;

  } catch (error) {

    console.error(
      "Error actualizando cliente:",
      error
    );

    throw error;
  }
}

// =====================================
// ELIMINAR CLIENTE
// =====================================

export async function
eliminarCliente(id) {

  try {

    const data =
      await apiDelete(
        `/clientes/${id}`
      );

    return data;

  } catch (error) {

    console.error(
      "Error eliminando cliente:",
      error
    );

    throw error;
  }
}