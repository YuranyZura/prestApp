import {
  apiPost,
  apiFetch
}
from "./api.js";

// =====================================
// LOGIN
// =====================================

export async function login(
  correo,
  contrasena
) {

  try {

    const data =
      await apiPost(
        "/auth/login",
        {
          correo,
          contrasena
        }
      );

    // =====================================
    // LOGIN OK
    // =====================================

    if (
      data &&
      data.success
    ) {

      // TOKEN

      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );
      }

      // USUARIO

      if (data.user) {

        localStorage.setItem(
          "usuario",
          JSON.stringify(data.user)
        );
      }

      return data;
    }

    throw new Error(
      data.message ||
      "Credenciales inválidas"
    );

  } catch (error) {

    console.error(
      "ERROR LOGIN:",
      error
    );

    throw error;
  }
}

// =====================================
// REGISTER
// =====================================

export async function register(
  usuario
) {

  try {

    const data =
      await apiPost(
        "/auth/register",
        usuario
      );

    return data;

  } catch (error) {

    console.error(
      "ERROR REGISTER:",
      error
    );

    throw error;
  }
}

// =====================================
// LOGOUT
// =====================================

export async function logout() {

  try {

    await apiPost(
      "/auth/logout"
    );

  } catch (error) {

    console.warn(
      "Logout backend error"
    );
  }

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "usuario"
  );

  window.location.href =
    "/src/html/auth/login.html";
}

// =====================================
// VERIFICAR TOKEN
// =====================================

export async function verificarSesion() {

  try {

    const data =
      await apiFetch(
        "/auth/check",
        {
          method: "GET"
        }
      );

    return (
      data &&
      data.success
    );

  } catch (error) {

    console.error(
      "Sesión inválida"
    );

    cerrarSesion();

    return false;
  }
}

// =====================================
// OBTENER TOKEN
// =====================================

export function obtenerToken() {

  return localStorage.getItem(
    "token"
  );
}

// =====================================
// OBTENER USUARIO
// =====================================

export function obtenerUsuario() {

  const usuario =
    localStorage.getItem(
      "usuario"
    );

  return usuario
    ? JSON.parse(usuario)
    : null;
}

// =====================================
// OBTENER ROL
// =====================================

export function obtenerRol() {

  const usuario =
    obtenerUsuario();

  return usuario?.rol || null;
}

// =====================================
// VALIDAR LOGIN
// =====================================

export function estaAutenticado() {

  return !!obtenerToken();
}

// =====================================
// REDIRECCIÓN POR ROL
// =====================================

export function redirigirPorRol() {

  const rol =
    obtenerRol();

  // SUPER ADMIN

  if (
    rol === "super_admin"
  ) {

    window.location.href =
      "/src/html/admin/administradores.html";

    return;
  }

  // ADMIN

  if (
    rol === "administrador"
  ) {

    window.location.href =
      "/src/html/admin/dashboard.html";

    return;
  }

  // TRABAJADOR

  if (
    rol === "trabajador"
  ) {

    window.location.href =
      "/src/html/trabajador/dashboard.html";

    return;
  }

  // DEFAULT

  window.location.href =
    "/src/html/auth/login.html";
}

// =====================================
// CERRAR SESIÓN
// =====================================

function cerrarSesion() {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "usuario"
  );

  window.location.href =
    "/src/html/auth/login.html";
}