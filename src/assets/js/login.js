import { API_URL } from "./config.js";

const form = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

function mostrar(texto, tipo = "error") {
    mensaje.className = `msg ${tipo}`;
    mensaje.innerText = texto;
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if (!correo || !contrasena) {
        mostrar("Complete todos los campos");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                correo,
                contrasena
            })

        });

        const data = await response.json();

        console.log(data);

        if (data.success) {

            mostrar("Login correcto", "success");

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "usuario",
                JSON.stringify(data.user)
            );

            setTimeout(() => {

                if (data.user.rol === "super_admin") {

                    window.location.href =
                        "/html/admin/administradores.html";

                } else if (data.user.rol === "administrador") {

                    window.location.href =
                        "/html/admin/dashboard.html";

                } else {

                    window.location.href =
                        "/html/trabajador/Rol2_trabajador.html";
                }

            }, 1000);

        } else {

            mostrar(data.message || "Credenciales incorrectas");

        }

    } catch (error) {

        console.error(error);

        mostrar("Error conectando con servidor");

    }

});