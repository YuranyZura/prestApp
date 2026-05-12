import { API_URL } from "../../assets/js/config.js";

// ==========================
// ELEMENTOS
// ==========================

const form = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");
const btnLogin = document.getElementById("btnLogin");

// ==========================
// MENSAJES
// ==========================

function mostrarMensaje(texto, tipo = "error") {

  if (!mensaje) {
    alert(texto);
    return;
  }

  mensaje.className = `msg ${tipo}`;
  mensaje.textContent = texto;
}

// ==========================
// LOGIN
// ==========================

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const correo =
      document.getElementById("correo")
      .value
      .trim();

    const contrasena =
      document.getElementById("contrasena")
      .value
      .trim();

    if (!correo || !contrasena) {

      mostrarMensaje(
        "Complete todos los campos"
      );

      return;
    }

    try {

      if (btnLogin) {
        btnLogin.disabled = true;
      }

      console.log("Intentando login...");

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            correo,
            contrasena
          })
        }
      );

      const data = await response.json();

      console.log("RESPUESTA:", data);

      // ==========================
      // LOGIN OK
      // ==========================

      if (data.success) {

        mostrarMensaje(
          "Inicio de sesión exitoso",
          "success"
        );

        // TOKEN
        if (data.token) {

          localStorage.setItem(
            "token",
            data.token
          );
        }

        // USER
        if (data.user) {

          localStorage.setItem(
            "usuario",
            JSON.stringify(data.user)
          );
        }

        // REDIRECCIÓN
        setTimeout(() => {

          const rol =
            data.user?.rol;

          console.log("ROL:", rol);

          if (rol === "super_admin") {

            window.location.href =
              "/html/admin/administradores.html";

          } else if (
            rol === "administrador"
          ) {

            window.location.href =
              "/html/admin/dashboard.html";

          } else {

            window.location.href =
              "/html/trabajador/Rol2_trabajador.html";
          }

        }, 1000);

      }

      // ==========================
      // LOGIN FAIL
      // ==========================

      else {

        mostrarMensaje(
          data.message ||
          "Credenciales inválidas"
        );
      }

    }

    catch (error) {

      console.error(
        "ERROR LOGIN:",
        error
      );

      mostrarMensaje(
        "No se pudo conectar con el servidor"
      );
    }

    finally {

      if (btnLogin) {
        btnLogin.disabled = false;
      }
    }

  });

}