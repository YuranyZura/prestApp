// ========== INICIO: LOGIN Y VERIFICACIÓN ==========
// ==========================================
// IMPORTS
// ==========================================
import { API_URL } from "./config.js";

// ==========================================
// INICIO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  const modalConfirm = new bootstrap.Modal(document.getElementById("modalConfirmarReenvio"));
  const modalVerifEl = document.getElementById("modalVerificacion");

  // ==========================================
  // FETCH GLOBAL
  // ==========================================
  async function apiFetch(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {})
      },
      credentials: "include",
      ...options
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Respuesta inválida del servidor");
    }

    if (!res.ok) {
      throw new Error(data.message || "Error en la API");
    }

    return data;

  } catch (error) {
    console.error("API ERROR:", error);
    mostrarToast(error.message || "Error de conexión", "error");
    return null;
  }
}
   // ==========================================
  // TOAST
  // ==========================================
  function mostrarToast(mensaje, tipo) {
    let toastEl;

    if (tipo === "exito") {
      toastEl = document.getElementById("toastLoginExito");

      const toast = new bootstrap.Toast(toastEl);
      toastEl.addEventListener("hidden.bs.toast", () => {
        const role = sessionStorage.getItem("user_role");

        if (role === "trabajador") {
  window.location.href = "/html/trabajador/Rol2_trabajador.html";
} else if (role === "administrador") {
  window.location.href = "/html/admin/administradores.html";
} else {
  window.location.href = "/dashboard";
}
      });

      toast.show();

    } else if (tipo === "verificado") {
      toastEl = document.getElementById("toastVerificacion");

      const toast = new bootstrap.Toast(toastEl);
      toastEl.addEventListener("hidden.bs.toast", () => {
        window.location.href = "./login";
      });

      toast.show();

    } else if (tipo === "reenvio") {
      document.getElementById("toastReenvioBody").textContent = mensaje;
      new bootstrap.Toast(document.getElementById("toastReenvio")).show();

    } else {
      document.getElementById("toastLoginErrorBody").textContent = mensaje;
      new bootstrap.Toast(document.getElementById("toastLoginError")).show();
    }
  }

  // ==========================================
  // LOGIN
  // ==========================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.querySelector('input[name="correo"]').value;
    const contrasena = document.querySelector('input[name="contrasena"]').value;

    if (!correo || !contrasena) {
      mostrarToast("Completa todos los campos", "error");
      return;
    }

    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, contrasena })
    });

    if (!result) return;

    if (result.success) {

      // ✅ Guardar rol
      if (result.user?.rol !== undefined) {
        sessionStorage.setItem("user_role", String(result.user.rol));
      }

      // ✅ Guardar token (IMPORTANTE PARA ANDROID)
      
if (result.token) {
  localStorage.setItem("token", result.token);
}
      mostrarToast("Inicio de sesión exitoso", "exito");

    } else {
      if (result.message.includes("no está verificada")) {
        sessionStorage.setItem("correo_usuario", correo);
        document.getElementById("correoConfirmacion").textContent = correo;
        modalConfirm.show();
      } else {
        mostrarToast(result.message, "error");
      }
    }
  });

  // ==========================================
  // REENVIAR CÓDIGO
  // ==========================================
  document.getElementById("btnConfirmarReenvio").addEventListener("click", async () => {
    modalConfirm.hide();

    const correo = sessionStorage.getItem("correo_usuario");

    if (!correo) {
      mostrarToast("No se encontró el correo", "error");
      return;
    }

    const data = await apiFetch("/auth/reenvio_codigo", {
      method: "POST",
      body: JSON.stringify({ correo })
    });

    if (data?.success) {
      mostrarToast("Código reenviado", "reenvio");
    }

    new bootstrap.Modal(modalVerifEl).show();
  });

  // ==========================================
  // VERIFICACIÓN
  // ==========================================
  const formVerificacion = document.getElementById("formVerificacion");

  if (formVerificacion) {
    const inputs = document.querySelectorAll(".codigo-input");

    formVerificacion.addEventListener("submit", async (e) => {
      e.preventDefault();

      const codigo = Array.from(inputs).map(i => i.value).join("");
      const correo = sessionStorage.getItem("correo_usuario");

      if (!correo || codigo.length !== 6) {
        mostrarToast("Código inválido", "error");
        return;
      }

      const data = await apiFetch("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ correo, codigo })
      });

      if (data?.success) {
        mostrarToast("Cuenta verificada", "verificado");
        bootstrap.Modal.getInstance(modalVerifEl)?.hide();
      }
    });

    // UX inputs
    inputs.forEach((input, i) => {
      input.addEventListener("input", () => {
        if (input.value && i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && i > 0) {
          inputs[i - 1].focus();
        }
      });
    });
  }
});