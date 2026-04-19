// ========== INICIO: LOGIN Y VERIFICACIÓN ==========
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado: login.js iniciado");

  const API_URL = "http://192.168.1.38:3000/api";
  const form = document.querySelector("form");

  if (!form) return;

  const modalConfirm = new bootstrap.Modal(document.getElementById("modalConfirmarReenvio"));
  const modalVerifEl = document.getElementById("modalVerificacion");

  // ================= TOAST =================
  function mostrarToast(mensaje, tipo) {
    let toastEl;

    if (tipo === "exito") {
      toastEl = document.getElementById("toastLoginExito");

      const toast = new bootstrap.Toast(toastEl);
      toastEl.addEventListener("hidden.bs.toast", () => {
        const role = sessionStorage.getItem("user_role");

        if (role === "trabajador") {
          window.location.href = "./Rol2_trabajador.html";
        } else if (role === "administrador") {
          window.location.href = "./administradores.html";
        } else {
          window.location.href = "./dashboard";
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
      toastEl = document.getElementById("toastReenvio");
      new bootstrap.Toast(toastEl).show();

    } else {
      document.getElementById("toastLoginErrorBody").textContent = mensaje;
      toastEl = document.getElementById("toastLoginError");
      new bootstrap.Toast(toastEl).show();
    }
  }

  // ================= LOGIN =================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.querySelector('input[name="correo"]').value;
    const contrasena = document.querySelector('input[name="contrasena"]').value;
  
    

    if (!correo || !contrasena) {
      mostrarToast("Completa todos los campos", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
        credentials: "include"
      });

      const result = await response.json();
      console.log("Respuesta del login:", result);

      if (result.success) {

        // ✅ Guardar rol
        if (result.user && result.user.rol !== undefined) {
          sessionStorage.setItem("user_role", String(result.user.rol));
        }

        // ✅ Guardar token
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

    } catch (error) {
      console.error("Error en login:", error);
      mostrarToast("Error de conexión con el servidor", "error");
    }
  });

  // ================= REENVIAR =================
  document.getElementById("btnConfirmarReenvio").addEventListener("click", async () => {
    modalConfirm.hide();

    const correo = sessionStorage.getItem("correo_usuario");

    if (!correo) {
      mostrarToast("No se encontró el correo", "error");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/reenvio_codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo })
      });

      const data = await res.json();

      if (data.success) {
        mostrarToast("Código reenviado", "reenvio");
      } else {
        mostrarToast(data.message, "error");
      }

      const modalVerif = new bootstrap.Modal(modalVerifEl);
      modalVerif.show();

    } catch (err) {
      mostrarToast("Error al reenviar", "error");
    }
  });

  // ================= VERIFICACIÓN =================
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

      try {
        const res = await fetch(`${API_URL}/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, codigo })
        });

        const data = await res.json();

        if (data.success) {
          mostrarToast("Cuenta verificada", "verificado");
          bootstrap.Modal.getInstance(modalVerifEl)?.hide();
        } else {
          mostrarToast(data.message, "error");
        }

      } catch {
        mostrarToast("Error de conexión", "error");
      }
    });

    // UX inputs código
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