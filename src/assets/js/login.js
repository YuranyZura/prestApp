// ========== INICIO: LOGIN Y VERIFICACIÓN ==========
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado: login.js iniciado");

  const form = document.querySelector("form");
  if (!form) {
    console.warn("Formulario de login no encontrado");
    return;
  }

  // Referencias a modales y toasts
  const modalConfirm = new bootstrap.Modal(document.getElementById("modalConfirmarReenvio"));
  const modalVerifEl = document.getElementById("modalVerificacion");

  // Función para mostrar toasts
  function mostrarToast(mensaje, tipo) {
    let toastEl;


     if (tipo === "exito") {
      // Login exitoso
      toastEl = document.getElementById("toastLoginExito");
      const toast = new bootstrap.Toast(toastEl);
      toastEl.addEventListener("hidden.bs.toast", () => {
        try {
          const role = sessionStorage.getItem("user_role");
          // Redirigir según el rol del usuario
          if (role === "trabajador") {
            window.location.href = "./Rol2_trabajador.html";
          } else if (role === "administrador") {
            window.location.href = "./administradores.html";
          } else {
            window.location.href = "./dashboard";
          }
        } catch (e) {
          window.location.href = "./dashboard";
        }
      });
      toast.show();

    } else if (tipo === "verificado") {
      // Verificación exitosa
      toastEl = document.getElementById("toastVerificacion");
      const toast = new bootstrap.Toast(toastEl);
      toastEl.addEventListener("hidden.bs.toast", () => {
        window.location.href = "./login";
      });
      toast.show();

    } else if (tipo === "reenvio") {
      // Reenvío de código
      document.getElementById("toastReenvioBody").textContent = mensaje;
      toastEl = document.getElementById("toastReenvio");
      new bootstrap.Toast(toastEl).show();

    } else {
      // Error general
      document.getElementById("toastLoginErrorBody").textContent = mensaje;
      toastEl = document.getElementById("toastLoginError");
      new bootstrap.Toast(toastEl).show();
    }
  }

  // ========== FORMULARIO DE LOGIN ==========
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.querySelector('input[name="correo"]').value;
    const contrasena = document.querySelector('input[name="contrasena"]').value;

    if (!correo || !contrasena) {
      mostrarToast("Completa todos los campos", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
        credentials: "include" 
      });

      const result = await response.json();
      console.log("Respuesta del login:", result);

      if (result.success) {
          // Guardar rol del usuario para decidir la redirección
          try {
            if (result.user && result.user.rol !== undefined) {
              sessionStorage.setItem("user_role", String(result.user.rol));
            }
          } catch (e) {
            console.warn("No se pudo guardar el rol en sessionStorage:", e);
          }

          mostrarToast("Inicio de sesión exitoso.", "exito");
      } else {
        if (result.message.includes("no está verificada")) {
          // Guardar correo para verificación
          sessionStorage.setItem("correo_usuario", correo);
          console.log(" Correo guardado para verificación:", correo);

          // Mostrar modal de confirmación
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

  // ========== MODAL DE CONFIRMACIÓN: REENVIAR CÓDIGO ==========
  document.getElementById("btnConfirmarReenvio").addEventListener("click", async () => {
    modalConfirm.hide();

    const correo = sessionStorage.getItem("correo_usuario");
    if (!correo) {
      mostrarToast("No se encontró el correo. Inicia sesión de nuevo.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/reenvio_codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo })
      });

      const dataReenvio = await res.json();
      console.log("📤 Reenvío de código:", dataReenvio);

      if (dataReenvio.success) {
        mostrarToast("Código reenviado. Ingresa el código para verificar.", "reenvio");
      } else {
        mostrarToast(dataReenvio.message || "Error al reenviar", "error");
      }

      //  Abrir modal de verificación
      const modalVerif = new bootstrap.Modal(modalVerifEl);
      modalVerif.show();

    } catch (err) {
      console.error("Error al reenviar:", err);
      mostrarToast("No se pudo reenviar el código.", "error");
    }
  });

  // ========== FORMULARIO DE VERIFICACIÓN ==========
  const formVerificacion = document.getElementById("formVerificacion");
  if (!formVerificacion) {
    console.warn(" No se encontró #formVerificacion");
  } else {
    const inputs = document.querySelectorAll(".codigo-input");
    console.log(" Inputs de código:", inputs.length); // Debe ser 6

    formVerificacion.addEventListener("submit", async (e) => {
      e.preventDefault();

      const codigo = Array.from(inputs).map(inp => inp.value).join("");
      const correo = sessionStorage.getItem("correo_usuario");

      console.log(" Código ingresado:", codigo);
      console.log(" Correo para verificación:", correo);

      if (!correo) {
        console.error("No hay correo en sessionStorage");
        mostrarToast("No se encontró el correo. Inicia sesión de nuevo.", "error");
        return;
      }

      if (codigo.length !== 6) {
        mostrarToast("El código debe tener 6 dígitos", "error");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, codigo })
        });

        const data = await res.json();
        console.log(" Respuesta de verificación:", data);

        if (data.success) {
          mostrarToast("¡Tu cuenta ha sido verificada con éxito!", "verificado");
          const modal = bootstrap.Modal.getInstance(modalVerifEl);
          if (modal) modal.hide();
        } else {
          mostrarToast(data.message, "error");
        }

      } catch (err) {
        console.error(" Error al verificar:", err);
        mostrarToast("Error de conexión con el servidor", "error");
      }
    });

    // Autofocus entre inputs
    inputs.forEach((input, i) => {
      input.addEventListener("input", () => {
        if (input.value && i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && i > 0) {
          inputs[i - 1].focus();
        }
      });
    });
  }

  // ========== REENVIAR DESDE EL MODAL (opcional) ==========
  const btnReenviarModal = document.getElementById("btnReenviar");
  if (btnReenviarModal) {
    btnReenviarModal.addEventListener("click", async () => {
      const correo = sessionStorage.getItem("correo_usuario");
      if (!correo) {
        mostrarToast("No hay correo guardado", "error");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/auth/reenvio_codigo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo })
        });

        const data = await res.json();
        if (data.success) {
          mostrarToast("Código reenviado", "reenvio");
        } else {
          mostrarToast("Error al reenviar", "error");
        }
      } catch (err) {
        mostrarToast("No se pudo reenviar", "error");
      }
    });
  }
});