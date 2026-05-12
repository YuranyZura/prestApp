async function apiFetch(endpoint, options = {}) {
  try {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {})
      },
      credentials: "include", // 🔐 cookies (luego puedes cambiar a JWT)
      body: options.body || null
    });

    // 🔒 Si no está autenticado
    if (response.status === 401) {
      console.warn("Sesión expirada");
      redirigirLogin();
      return null;
    }

    // 📦 Intentar parsear respuesta
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Respuesta inválida del servidor");
    }

    // ❌ Error desde backend
    if (!response.ok) {
      throw new Error(data.message || "Error en la API");
    }

    return data;

  } catch (error) {
    console.error("API ERROR:", error);

    // Mostrar error bonito si existe la función
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion(error.message || "Error de conexión", "danger");
    }

    throw error;
  }
}

// ===============================
// MÉTODOS RÁPIDOS (OPCIONAL)
// ===============================

// GET
function apiGet(endpoint) {
  return apiFetch(endpoint);
}

// POST
function apiPost(endpoint, body) {
  return apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

// PUT
function apiPut(endpoint, body) {
  return apiFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

// DELETE
function apiDelete(endpoint) {
  return apiFetch(endpoint, {
    method: "DELETE"
  });
}

// FORM DATA (subir archivos)
function apiUpload(endpoint, formData) {
  return apiFetch(endpoint, {
    method: "POST",
    body: formData
  });
}