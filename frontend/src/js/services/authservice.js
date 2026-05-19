import {
  apiPost,
  apiFetch
}
from "./api.js";

// =====================================
// RUTAS
// =====================================

const RUTAS = {

  LOGIN:
    "/html/auth/login.html",

  ADMIN:
    "/html/admin/dashboard.html",

  SUPER_ADMIN:
    "/html/admin/administradores.html",

  TRABAJADOR:
    "/html/trabajador/dashboard.html",

  UNAUTHORIZED:
    "/html/errors/unauthorized.html"
};

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
    // VALIDAR RESPUESTA
    // =====================================

    if (
      !data ||
      !data.success
    ) {

      throw new Error(
        data?.message ||
        "Credenciales inválidas"
      );
    }

    // =====================================
    // VALIDAR TOKEN
    // =====================================

    if (!data.token) {

      throw new Error(
        "Token no recibido"
      );
    }

    // =====================================
    // GUARDAR TOKEN
    // =====================================

    localStorage.setItem(
      "token",
      data.token
    );

    // =====================================
    // GUARDAR USUARIO
    // =====================================

    if (data.user) {

      localStorage.setItem(
        "usuario",
        JSON.stringify(data.user)
      );
    }

    return data;

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

    if (
      !data ||
      !data.success
    ) {

      throw new Error(
        data?.message ||
        "Error en registro"
      );
    }

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
      "Logout backend error:",
      error
    );
  }

  limpiarSesion();

  window.location.href =
    RUTAS.LOGIN;
}

// =====================================
// VERIFICAR SESIÓN
// =====================================

export async function verificarSesion() {

  try {

    // =====================================
    // VALIDAR TOKEN LOCAL
    // =====================================

    if (!estaAutenticado()) {

      await logout();

      return false;
    }

    // =====================================
    // VALIDAR BACKEND
    // =====================================

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
      "Sesión inválida:",
      error
    );

    await logout();

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

  try {

    const usuario =
      localStorage.getItem(
        "usuario"
      );

    return usuario
      ? JSON.parse(usuario)
      : null;

  } catch (error) {

    console.error(
      "Error parseando usuario:",
      error
    );

    return null;
  }
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
// VALIDAR TOKEN JWT
// =====================================

function tokenExpirado(
  token
) {

  try {

    const payload =
      JSON.parse(
        atob(
          token.split(".")[1]
        )
      );

    if (!payload.exp) {

      return true;
    }

    const expiracion =
      payload.exp * 1000;

    return (
      Date.now() >= expiracion
    );

  } catch (error) {

    console.error(
      "Token inválido:",
      error
    );

    return true;
  }
}

// =====================================
// VALIDAR LOGIN
// =====================================

export function estaAutenticado() {

  const token =
    obtenerToken();

  if (!token) {

    return false;
  }

  return !tokenExpirado(
    token
  );
}

// =====================================
// REDIRECCIÓN POR ROL
// =====================================

export function redirigirPorRol() {

  const rol =
    obtenerRol();

  // =====================================
  // SUPER ADMIN
  // =====================================

  if (
    rol === "super_admin"
  ) {

    window.location.href =
      RUTAS.SUPER_ADMIN;

    return;
  }

  // =====================================
  // ADMIN
  // =====================================

  if (
    rol === "administrador"
  ) {

    window.location.href =
      RUTAS.ADMIN;

    return;
  }

  // =====================================
  // TRABAJADOR
  // =====================================

  if (
    rol === "trabajador"
  ) {

    window.location.href =
      RUTAS.TRABAJADOR;

    return;
  }

  // =====================================
  // ROL NO AUTORIZADO
  // =====================================

  window.location.href =
    RUTAS.UNAUTHORIZED;
}

// =====================================
// LIMPIAR SESIÓN
// =====================================

function limpiarSesion() {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "usuario"
  );
}