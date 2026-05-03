// ==========================================
// PRESTAPP - LOGIN Y VERIFICACIÓN PRO
// login.js
// ==========================================

import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // ELEMENTOS
  // ==========================================
  const formLogin = document.getElementById("formLogin");
  const formVerificacion = document.getElementById("formVerificacion");

  const modalConfirmEl = document.getElementById("modalConfirmarReenvio");
  const modalVerifEl = document.getElementById("modalVerificacion");

  const modalConfirm = modalConfirmEl
    ? new bootstrap.Modal(modalConfirmEl)
    : null;

  const modalVerif = modalVerifEl
    ? new bootstrap.Modal(modalVerifEl)
    : null;

  // ==========================================
  // TOKEN
  // ==========================================
  function obtenerToken() {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  }

  // ==========================================
  // LOGOUT
  // ==========================================
  function logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_role");
    sessionStorage.removeItem("correo_usuario");

    window.location.href = "/login";
  }

  // ==========================================
  // REDIRECCIÓN POR ROL
  // ==========================================
  function redirigirUsuario() {
    const role = sessionStorage.getItem("user_role");

    if (role === "trabajador") {
      window.location.href = "/html/trabajador/Rol2_trabajador.html";
    } else if (role === "administrador") {
      window.location.href = "/html/admin/administradores.html";
    } else {
      window.location.href = "/dashboard";
    }
  }

  // ==========================================
  // AUTOLOGIN
  // ==========================================
  if (obtenerToken() && window.location.pathname === "/login") {
    redirigirUsuario();
  }

  // ==========================================
  // TOAST
  // ==========================================
  function mostrarToast(mensaje, tipo = "error") {
    let toastId = "toastLoginError";

    if (tipo === "exito") toastId = "toastLoginExito";
    if (tipo === "verificado") toastId = "toastVerificacion";
    if (tipo === "reenvio") toastId = "toastReenvio";

    const toastEl = document.getElementById(toastId);

    if (!toastEl) {
      alert(mensaje);
      return;
    }

    const body = toastEl.querySelector(".toast-body");

    if (body) body.textContent = mensaje;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    // Redirigir después de login
    if (tipo === "exito") {
      setTimeout(() => {
        redirigirUsuario();
      }, 1200);
    }

    // Ir login después de verificar cuenta
    if (tipo === "verificado") {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    }
  }

  // ==========================================
  // FETCH GLOBAL
  // ==========================================
  async function apiFetch(endpoint, options = {}) {
    try {
      const token = obtenerToken();

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && {
            Authorization: `Bearer ${token}`
          }),
          ...(options.headers || {})
        },
        credentials: "include",
        body: options.body || null
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        logout();
        return null;
      }

      if (!res.ok) {
        throw new Error(
          data.message || "Error del servidor"
        );
      }

      return data;

    } catch (error) {
      console.error("API ERROR:", error);
      mostrarToast(error.message, "error");
      return null;
    }
  }

  // ==========================================
  // LOGIN
  // ==========================================
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const correo = document
        .getElementById("correo")
        .value.trim();

      const contrasena = document
        .getElementById("contrasena")
        .value.trim();

      const recordar = document.getElementById("recordarme")?.checked;

      if (!correo || !contrasena) {
        mostrarToast("Completa todos los campos");
        return;
      }

      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          correo,
          contrasena
        })
      });

      if (!result) return;

      if (result.success) {

        // Guardar rol
        if (result.user?.rol) {
          sessionStorage.setItem(
            "user_role",
            result.user.rol
          );
        }

        // Guardar token
        if (result.token) {
          if (recordar) {
            localStorage.setItem(
              "token",
              result.token
            );
          } else {
            sessionStorage.setItem(
              "token",
              result.token
            );
          }
        }

        mostrarToast(
          "Inicio de sesión exitoso",
          "exito"
        );

      } else {

        if (
          result.message &&
          result.message.includes("verificada")
        ) {
          sessionStorage.setItem(
            "correo_usuario",
            correo
          );

          const spanCorreo = document.getElementById(
            "correoConfirmacion"
          );

          if (spanCorreo) {
            spanCorreo.textContent = correo;
          }

          modalConfirm?.show();

        } else {
          mostrarToast(result.message);
        }
      }
    });
  }

  // ==========================================
  // REENVIAR CÓDIGO
  // ==========================================
  const btnConfirmar = document.getElementById(
    "btnConfirmarReenvio"
  );

  if (btnConfirmar) {
    btnConfirmar.addEventListener(
      "click",
      async () => {

        modalConfirm?.hide();

        const correo =
          sessionStorage.getItem(
            "correo_usuario"
          );

        if (!correo) {
          mostrarToast("Correo no encontrado");
          return;
        }

        const data = await apiFetch(
          "/auth/reenvio_codigo",
          {
            method: "POST",
            body: JSON.stringify({
              correo
            })
          }
        );

        if (data?.success) {
          mostrarToast(
            "Código reenviado",
            "reenvio"
          );

          modalVerif?.show();
        }
      }
    );
  }

  // ==========================================
  // VERIFICAR CÓDIGO
  // ==========================================
  if (formVerificacion) {

    const inputs =
      document.querySelectorAll(
        ".codigo-input"
      );

    formVerificacion.addEventListener(
      "submit",
      async (e) => {
        e.preventDefault();

        const codigo = Array.from(inputs)
          .map(input =>
            input.value.trim()
          )
          .join("");

        const correo =
          sessionStorage.getItem(
            "correo_usuario"
          );

        if (
          !correo ||
          codigo.length !== 6
        ) {
          mostrarToast("Código inválido");
          return;
        }

        const data = await apiFetch(
          "/auth/verify-email",
          {
            method: "POST",
            body: JSON.stringify({
              correo,
              codigo
            })
          }
        );

        if (data?.success) {
          modalVerif?.hide();

          mostrarToast(
            "Cuenta verificada correctamente",
            "verificado"
          );
        }
      }
    );

    // UX Inputs
    inputs.forEach((input, i) => {

      input.addEventListener(
        "input",
        () => {
          input.value =
            input.value.replace(
              /\D/g,
              ""
            );

          if (
            input.value &&
            i < inputs.length - 1
          ) {
            inputs[i + 1].focus();
          }
        }
      );

      input.addEventListener(
        "keydown",
        (e) => {
          if (
            e.key === "Backspace" &&
            !input.value &&
            i > 0
          ) {
            inputs[i - 1].focus();
          }
        }
      );

    });
  }

});