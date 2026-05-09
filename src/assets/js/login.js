// ==========================================
// PRESTAPP LOGIN.JS FULL REPARADO
// /public/js/login.js
// ==========================================

import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

const formLogin = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");
const btnLogin = document.getElementById("btnLogin");

// ===============================
// MENSAJES
// ===============================
function mostrar(texto, tipo = "error") {

    if (!mensaje) {
        alert(texto);
        return;
    }

    mensaje.innerText = texto;
    mensaje.className = "msg " + tipo;
}

// ===============================
// GUARDAR SESIÓN
// ===============================
function guardarSesion(data) {

    if (data.token) {
        localStorage.setItem("token", data.token);
    }

    if (data.user) {
        localStorage.setItem(
            "usuario",
            JSON.stringify(data.user)
        );
    }
}

// ===============================
// REDIRECCIÓN POR ROL
// ===============================
function redirigir(rol) {

    if (rol === "super_admin") {
        window.location.href =
        "/html/admin/administradores.html";
    }

    else if (rol === "administrador") {
        window.location.href =
        "/html/admin/dashboard.html";
    }

    else if (rol === "trabajador") {
        window.location.href =
        "/html/trabajador/Rol2_trabajador.html";
    }

    else {
        window.location.href = "/";
    }
}

// ===============================
// LOGIN
// ===============================
if (formLogin) {

btnLogin.addEventListener("click", async (e) => {

    e.preventDefault();

    const correo = document
        .getElementById("correo")
        .value.trim();

    const contrasena = document
        .getElementById("contrasena")
        .value.trim();

    if (!correo || !contrasena) {
        mostrar("Complete todos los campos");
        return;
    }

    try {

        const res = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                    correo,
                    contrasena
                })
            }
        );

        const data = await res.json();

        console.log("LOGIN:", data);

        if (data.success) {

            mostrar(
                "Inicio de sesión exitoso",
                "success"
            );

            guardarSesion(data);

            setTimeout(() => {
                redirigir(data.user.rol);
            }, 1000);

        } else {

            mostrar(
                data.message ||
                "Correo o contraseña incorrectos"
            );
        }

    } catch (error) {

        console.error(error);

        mostrar(
            "No se pudo conectar al servidor"
        );
    }

});

}

// ===============================
// AUTOLOGIN
// ===============================
const token = localStorage.getItem("token");
const usuario = localStorage.getItem("usuario");

if (token && usuario &&
window.location.pathname.includes("login")) {

    const user = JSON.parse(usuario);

    redirigir(user.rol);
}

// ===============================
// LOGOUT
// ===============================
window.logout = function () {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href =
    "/html/auth/login.html";
};

});