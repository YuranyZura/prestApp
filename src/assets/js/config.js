// ==========================================
// CONFIGURACIÓN GLOBAL DE LA APP
// ==========================================

// 🔥 URL dinámica (FUNCIONA EN PC Y ANDROID)
export const API_URL = `${window.location.origin}/api`;

// Timeout opcional
export const API_TIMEOUT = 10000;

// Debug
export const DEBUG = true;

// ==========================================
// FUNCIONES DE APOYO
// ==========================================

export function log(...args) {
  if (DEBUG) {
    console.log("[APP]", ...args);
  }
}

export function logError(...args) {
  console.error("[ERROR]", ...args);
}