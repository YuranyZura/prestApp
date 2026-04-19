// =============================
// VARIABLES GLOBALES
// =============================
let correoUsuario = sessionStorage.getItem("correo_usuario") || "";

// =============================
// INICIO
// =============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Register.js cargado");

  inicializarFormularioRegistro();
  inicializarVerificacion();
  inicializarReenvio();
});

// =============================
// REGISTRO
// =============================
function inicializarFormularioRegistro() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombre: document.querySelector('input[name="nombre"]').value.trim(),
      apellido: document.querySelector('input[name="apellido"]').value.trim(),
      correo: document.querySelector('input[name="correo"]').value.trim(),
      contrasena: document.querySelector('input[name="contrasena"]').value
    };

    if (!data.nombre || !data.apellido || !data.correo || !data.contrasena) {
      mostrarToast("Completa todos los campos", "error");
      return;
    }

    try {
      const result = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
      });

      if (result.success) {
        correoUsuario = data.correo;
        sessionStorage.setItem("correo_usuario", data.correo);

        mostrarModalVerificacion();

      } else {
        mostrarToast(result.message, "error");
      }

    } catch (error) {
      console.error("Error en registro:", error);
      mostrarToast("Error en el servidor", "error");
    }
  });
}

// =============================
// MODAL VERIFICACIÓN
// =============================
function mostrarModalVerificacion() {
  const modal = new bootstrap.Modal(document.getElementById("modalVerificacion"));
  modal.show();
}

// =============================
// VERIFICACIÓN
// =============================
function inicializarVerificacion() {
  const formVerificacion = document.getElementById("formVerificacion");
  if (!formVerificacion) return;

  const inputs = document.querySelectorAll(".codigo-input");

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

  formVerificacion.addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigo = Array.from(inputs).map(i => i.value).join("");

    if (!correoUsuario || codigo.length !== 6) {
      mostrarToast("Código inválido", "error");
      return;
    }

    try {
      const result = await apiFetch("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ correo: correoUsuario, codigo })
      });

      if (result.success) {
        mostrarToast("Cuenta verificada", "exito");

        const modal = bootstrap.Modal.getInstance(
          document.getElementById("modalVerificacion")
        );
        modal.hide();

      } else {
        mostrarToast(result.message, "error");
      }

    } catch (error) {
      mostrarToast("Error de conexión", "error");
    }
  });
}

// =============================
// REENVIAR CÓDIGO
// =============================
function inicializarReenvio() {
  const btn = document.getElementById("btnReenviar");
  if (!btn) return;

  btn.addEventListener("click", async () => {

    if (!correoUsuario) {
      mostrarToast("Primero debes registrarte", "error");
      return;
    }

    try {
      const result = await apiFetch("/auth/reenvio_codigo", {
        method: "POST",
        body: JSON.stringify({ correo: correoUsuario })
      });

      if (result.success) {
        mostrarToast("Código reenviado", "reenvio");
      } else {
        mostrarToast(result.message, "error");
      }

    } catch (error) {
      console.error("Error reenviando:", error);
      mostrarToast("No se pudo reenviar el código", "error");
    }
  });
}

// =============================
// TOASTS
// =============================
function mostrarToast(mensaje, tipo) {
  let toastEl;

  if (tipo === "exito") {
    toastEl = document.getElementById("toastVerificacion");

    const toast = new bootstrap.Toast(toastEl);

    const onHidden = () => {
      window.location.href = "./login";
      toastEl.removeEventListener("hidden.bs.toast", onHidden);
    };

    toastEl.addEventListener("hidden.bs.toast", onHidden);
    toast.show();

  } else if (tipo === "reenvio") {
    toastEl = document.getElementById("toastReenvio");
    document.getElementById("toastReenvioBody").textContent = mensaje;
    new bootstrap.Toast(toastEl).show();

  } else {
    document.getElementById("toastErrorBody").textContent = mensaje;
    new bootstrap.Toast(document.getElementById("toastError")).show();
  }
}