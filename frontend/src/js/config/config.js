// =====================================
// PRESTAPP CONFIG
// frontend/src/js/config/config.js
// =====================================

// =====================================
// DETECTAR HOST
// =====================================

const hostname =
  window.location.hostname;

// =====================================
// API URL
// =====================================

// ANDROID / RED LOCAL
let API_URL =
  "http://192.168.1.10:4000/api";

// LOCALHOST PC
if (
  hostname === "localhost" ||
  hostname === "127.0.0.1"
) {

  API_URL =
    "http://localhost:4000/api";
}

// PRODUCCIÓN
if (
  hostname.includes(
    "prestapp.com"
  )
) {

  API_URL =
    "https://api.prestapp.com/api";
}

// =====================================
// EXPORT
// =====================================

export {
  API_URL
};

// =====================================
// APP CONFIG
// =====================================

export const APP_NAME =
  "PrestApp";

export const APP_VERSION =
  "1.0.0";

// =====================================
// STORAGE KEYS
// =====================================

export const STORAGE_KEYS = {

  TOKEN:
    "token",

  USER:
    "usuario",

  THEME:
    "theme"
};

// =====================================
// TIMEOUTS
// =====================================

export const REQUEST_TIMEOUT =
  15000;

// =====================================
// PAGINACIÓN
// =====================================

export const ITEMS_PER_PAGE =
  10;

// =====================================
// ROLES
// =====================================

export const ROLES = {

  SUPER_ADMIN:
    "super_admin",

  ADMIN:
    "administrador",

  TRABAJADOR:
    "trabajador"
};

// =====================================
// ESTADOS
// =====================================

export const ESTADOS = {

  ACTIVO:
    "activo",

  PENDIENTE:
    "pendiente",

  PAGADO:
    "pagado",

  VENCIDO:
    "vencido"
};

// =====================================
// RUTAS FRONTEND
// =====================================

export const ROUTES = {

  LOGIN:
    "/src/html/auth/login.html",

  DASHBOARD_ADMIN:
    "/src/html/admin/dashboard.html",

  DASHBOARD_TRABAJADOR:
    "/src/html/trabajador/dashboard.html",

  CLIENTES:
    "/src/html/admin/clientes.html",

  PRESTAMOS:
    "/src/html/admin/prestamos.html",

  PAGOS:
    "/src/html/admin/pagos.html"
};

// =====================================
// HEADERS BASE
// =====================================

export function getHeaders() {

  const token =
    localStorage.getItem(
      "token"
    );

  return {

    "Content-Type":
      "application/json",

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`
        }
      : {})
  };
}

// =====================================
// DEBUG
// =====================================

console.log(
  `🚀 ${APP_NAME} v${APP_VERSION}`
);

console.log(
  "🌐 API:",
  API_URL
);