// ==========================================
// IMPORTS (IMPORTANTE: usar type="module" en HTML)
// ==========================================
import { API_URL } from "./config.js";

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let clienteId = null;
let mapaInstance = null;

// ==========================================
// FETCH REUTILIZABLE (BASE PARA TODO)
// ==========================================
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        ...(options.headers || {})
      },
      ...options
    });

    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en la API");
    }

    return data;

  } catch (error) {
    console.error("API ERROR:", error);
    mostrarNotificacion("Error de conexión", "danger");
  }
}

// ==========================================
// INICIO
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  clienteId = params.get("id");

  if (!clienteId) {
    mostrarError("Cliente no especificado");
    return;
  }

  await cargarDetalleCliente();
  await cargarResumenCuotas();
  await cargarHistorialCuotas();

  const fechaPago = document.getElementById("fechaPago");
  if (fechaPago) fechaPago.valueAsDate = new Date();
});

// ==========================================
// NOTIFICACIONES
// ==========================================
function mostrarNotificacion(mensaje, tipo = "success") {
  const toastEl = document.getElementById("toastNotificacion");
  if (!toastEl) return alert(mensaje);

  const toast = new bootstrap.Toast(toastEl);
  document.getElementById("toastBody").textContent = mensaje;
  toast.show();
}

// ==========================================
// DETALLE CLIENTE
// ==========================================
async function cargarDetalleCliente() {
  const data = await apiFetch(`/clientes/${clienteId}`);
  if (!data) return;

  const cliente = data.cliente;

  document.getElementById("nombreCliente").textContent = cliente.nombreCompleto || "Sin nombre";
  document.getElementById("cedulaCliente").textContent = cliente.cedula || "-";
  document.getElementById("telefonoCliente").textContent = cliente.telefono || "-";
  document.getElementById("direccionCliente").textContent = cliente.direccion || "-";

  document.getElementById("totalPrestado").textContent = cliente.totalPrestado || 0;
  document.getElementById("totalPendiente").textContent = cliente.totalPendiente || 0;

  // MAPA
  if (cliente.latitud && cliente.longitud) {
    inicializarMapa(cliente.latitud, cliente.longitud);
  }
}

// ==========================================
// RESUMEN CUOTAS
// ==========================================
async function cargarResumenCuotas() {
  const data = await apiFetch(`/clientes/${clienteId}/cuotas`);
  if (!data) return;

  const r = data.resumen;

  document.getElementById("cuotasPagadas").textContent = r.cuotasPagadas || 0;
  document.getElementById("cuotasPendientes").textContent = r.cuotasPendientes || 0;
  document.getElementById("cuotasMora").textContent = r.cuotasMora || 0;
}

// ==========================================
// HISTORIAL CUOTAS
// ==========================================
async function cargarHistorialCuotas() {
  const data = await apiFetch(`/pagos/cliente/${clienteId}`);
  if (!data) return;

  const tabla = document.getElementById("tablaCuotas");

  if (!data.cuotas.length) {
    tabla.innerHTML = "<tr><td colspan='5'>Sin datos</td></tr>";
    return;
  }

  tabla.innerHTML = data.cuotas.map((c, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${new Date(c.fecha_pago).toLocaleDateString()}</td>
      <td>$${c.monto_pagos}</td>
      <td>${c.metodo_pago}</td>
      <td>${c.estado_prestamos}</td>
    </tr>
  `).join("");
}

// ==========================================
// MAPA (LEAFLET)
// ==========================================
function inicializarMapa(lat, lng) {
  const div = document.getElementById("mapaCliente");
  if (!div) return;

  if (mapaInstance) mapaInstance.remove();

  mapaInstance = L.map("mapaCliente").setView([lat, lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapaInstance);

  L.marker([lat, lng]).addTo(mapaInstance);
}

// ==========================================
// ACCIONES
// ==========================================
async function eliminarCliente() {
  if (!confirm("¿Eliminar cliente?")) return;

  await apiFetch(`/clientes/${clienteId}`, {
    method: "DELETE"
  });

  mostrarNotificacion("Cliente eliminado");
  setTimeout(() => window.location.href = "/clientes", 1000);
}

// ==========================================
// ERRORES
// ==========================================
function mostrarError(msg) {
  document.getElementById("nombreCliente").textContent = msg;
}