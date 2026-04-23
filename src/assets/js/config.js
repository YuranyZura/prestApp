// ==========================================
// CONFIGURACIÓN GLOBAL DE LA APP
// ==========================================

// Detectar entorno automáticamente
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// URL del backend
export const API_URL = isLocalhost
  ? "http://localhost:4000/api"
  : "http://192.168.1.10:4000/api"; // 👈 TU IP para celular

// Timeout opcional (por si el servidor se cae)
export const API_TIMEOUT = 10000; // 10 segundos

// Modo debug (para ver logs en consola)
export const DEBUG = true;

// ==========================================
// FUNCIONES DE APOYO
// ==========================================

// Mostrar logs solo si DEBUG está activo
export function log(...args) {
  if (DEBUG) {
    console.log("[APP]", ...args);
  }
}

// Mostrar errores controlados
export function logError(...args) {
  console.error("[ERROR]", ...args);
}