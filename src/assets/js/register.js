let correoUsuario = ""; // Puedes usar sessionStorage para mayor seguridad

// Evento de registro
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.querySelector('input[name="nombre"]').value,
    apellido: document.querySelector('input[name="apellido"]').value,
    correo: document.querySelector('input[name="correo"]').value,
    contrasena: document.querySelector('input[name="contrasena"]').value,
  };

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      // Guardamos el correo
      correoUsuario = data.correo;
      sessionStorage.setItem("correo_usuario", data.correo); // Persistencia

      // Mostrar modal de verificación
      const modal = new bootstrap.Modal(document.getElementById("modalVerificacion"));
      modal.show();

    } else {
      mostrarToast(result.message, "error");
    }
  } catch (error) {
    console.error("Error en /register:", error);
    mostrarToast("Error en el servidor", "error");
  }
});

// Configuración del modal de verificación
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".codigo-input");

  // Pasar automáticamente al siguiente input
  inputs.forEach((input, i) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
    });

    // Permitir borrar y regresar
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "" && i > 0) {
        inputs[i - 1].focus();
      }
    });
  });

  // Manejar envío del formulario de verificación
  document.getElementById("formVerificacion").addEventListener("submit", async (e) => {
    e.preventDefault();
    const codigo = Array.from(inputs).map(inp => inp.value).join("");

    if (codigo.length !== 6) {
      mostrarToast("El código debe tener 6 dígitos", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correoUsuario, codigo })
      });

      const data = await res.json();

      if (data.success) {
        // Éxito: mostrar toast y redirigir
        const toastEl = document.getElementById("toastVerificacion");
        const toast = new bootstrap.Toast(toastEl);
        toast.show();

        // Redirigir después de que termine el toast
        toastEl.addEventListener("hidden.bs.toast", () => {
          window.location.href = "./login"; // o "./login"
        });

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalVerificacion"));
        modal.hide();

      } else {
        //  Error
        mostrarToast(data.message, "error");
      }
    } catch (err) {
      mostrarToast("Error de conexión", "error");
    }
  });

  // Reenviar código
  // Reenviar código
document.getElementById("btnReenviar").addEventListener("click", async () => {
  if (!correoUsuario) {
    mostrarToast("Primero debes registrarte", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/reenvio_codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: correoUsuario })
    });

    const data = await res.json();

    if (data.success) {
      //  Mostrar toast de reenvío (sin redirección)
      mostrarToast(data.message, "reenvio");
    } else {
      //  Mostrar error
      mostrarToast(data.message, "error");
    }
  } catch (err) {
    console.error("Error al reenviar:", err);
    mostrarToast("No se pudo reenviar el código. Intenta más tarde.", "error");
  }
});
});

// Función para mostrar toasts
function mostrarToast(mensaje, tipo) {
  let toastEl;

  if (tipo === "exito") {
    // Verificación exitosa → redirige
    toastEl = document.getElementById("toastVerificacion");
    const toast = new bootstrap.Toast(toastEl);
    
    // Escuchar solo una vez
    const onHidden = () => {
      window.location.href = "./login";
      toastEl.removeEventListener("hidden.bs.toast", onHidden);
    };
    toastEl.addEventListener("hidden.bs.toast", onHidden);
    toast.show();

  } else if (tipo === "reenvio") {
    // Reenvío → no redirige
    toastEl = document.getElementById("toastReenvio");
    document.getElementById("toastReenvioBody").textContent = mensaje;
    new bootstrap.Toast(toastEl).show();

  } else {
    // Error
    document.getElementById("toastErrorBody").textContent = mensaje;
    new bootstrap.Toast(document.getElementById("toastError")).show();
  }
}