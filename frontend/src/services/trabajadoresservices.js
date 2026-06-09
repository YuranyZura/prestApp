import { apiGet, apiPost, apiPut, apiDelete } from "../config/api";

export async function obtenerTrabajadores() {
  try {
    const data = await apiGet("/trabajadores");
    if (data && data.success) {
      return data.trabajadores || [];
    }
    return [];
  } catch (error) {
    console.error("Error obteniendo trabajadores:", error);
    return [];
  }
}

export async function obtenerTrabajador(id) {
  try {
    const data = await apiGet(`/trabajadores/${id}`);
    if (data && data.success) {
      return data.trabajador;
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo trabajador:", error);
    return null;
  }
}

export async function crearTrabajador(trabajador) {
  try {
    const data = await apiPost("/trabajadores", trabajador);
    return data;
  } catch (error) {
    console.error("Error creando trabajador:", error);
    throw error;
  }
}

export async function actualizarTrabajador(id, trabajador) {
  try {
    const data = await apiPut(`/trabajadores/${id}`, trabajador);
    return data;
  } catch (error) {
    console.error("Error actualizando trabajador:", error);
    throw error;
  }
}

export async function eliminarTrabajador(id) {
  try {
    const data = await apiDelete(`/trabajadores/${id}`);
    return data;
  } catch (error) {
    console.error("Error eliminando trabajador:", error);
    throw error;
  }
}
