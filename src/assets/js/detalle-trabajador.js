// Obtener parámetros de la URL
// ==========================================
// IMPORTS
// ==========================================
import { API_URL } from "./config.js";

// ==========================================
// VARIABLES
// ==========================================
let idTrabajador = null;

// ==========================================
// FETCH GLOBAL (REUTILIZABLE)
// ==========================================
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      credentials: "include",
      ...options
    });

    if (res.status === 401) {
      window.location.href = "/login";
      return null;
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error en API");
    }

    return data;

  } catch (error) {
    console.error("API ERROR:", error);
    alert("Error de conexión");
  }
}

// ==========================================
// INICIO
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  idTrabajador = params.get("id");

  if (!idTrabajador) {
    alert("ID no válido");
    return;
  }

  await cargarDetalle();
  configurarFormulario();
});

// ==========================================
// CARGAR DETALLE
// ==========================================
async function cargarDetalle() {
  const trabajador = await apiFetch(`/trabajadores/${idTrabajador}`);
  if (!trabajador) return;

  // DATOS
  document.getElementById("fotoTrabajador").src =
    trabajador.foto
      ? `${API_URL.replace('/api','')}/uploads/${trabajador.foto}`
      : "../assets/images/profile/user-1.jpg";

  document.getElementById("nombreCompleto").textContent =
    `${trabajador.nombre} ${trabajador.apellido}`;

  document.getElementById("cedulaDetalle").textContent = trabajador.cedula;
  document.getElementById("fechaNacimientoDetalle").textContent =
    new Date(trabajador.fecha_nacimiento).toLocaleDateString();

  document.getElementById("celularDetalle").textContent = trabajador.telefono;
  document.getElementById("correoDetalle").textContent = trabajador.correo;
  document.getElementById("direccionDetalle").textContent = trabajador.direccion;

  // ======================================
  // USUARIO ASOCIADO
  // ======================================
  if (trabajador.id_usuario) {
    cargarUsuario(trabajador.id_usuario);
  } else {
    document.getElementById("usuarioAcceso").value = trabajador.correo || "";
  }
}

// ==========================================
// CARGAR USUARIO
// ==========================================
async function cargarUsuario(idUsuario) {
  const user = await apiFetch(`/auth/user/${idUsuario}`);
  if (!user) return;

  document.getElementById("usuarioExistente").value = user.correo;
  document.getElementById("contrasenaExistente").value = "********";

  document.getElementById("credencialesExistentes").classList.remove("d-none");
  document.getElementById("formularioCredenciales").classList.add("d-none");

  const estado = document.getElementById("estadoTrabajador");
  const btn = document.getElementById("btnToggleAcceso");

  if (user.verificado) {
    estado.textContent = "Activo";
    estado.classList.add("bg-success");
    btn.textContent = "Inactivar acceso";
  } else {
    estado.textContent = "Inactivo";
    estado.classList.add("bg-danger");
    btn.textContent = "Activar acceso";
  }

  btn.onclick = () => toggleAcceso(idUsuario, user.verificado);
}

// ==========================================
// ACTIVAR / DESACTIVAR ACCESO
// ==========================================
async function toggleAcceso(idUsuario, estadoActual) {
  const data = await apiFetch("/auth/toggle-acceso", {
    method: "POST",
    body: JSON.stringify({
      id_usuarios: idUsuario,
      activo: !estadoActual
    })
  });

  alert(data.message);
  window.location.reload();
}

// ==========================================
// FORMULARIO CREDENCIALES
// ==========================================
function configurarFormulario() {
  const form = document.getElementById("formCredenciales");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("usuarioAcceso").value.trim();
    const pass = document.getElementById("contrasenaAcceso").value;
    const confirm = document.getElementById("confirmarContrasena").value;

    if (pass.length < 8) return alert("Mínimo 8 caracteres");
    if (pass !== confirm) return alert("No coinciden");

    const data = await apiFetch("/auth/create-credenciales", {
      method: "POST",
      body: JSON.stringify({
        id_trabajador: idTrabajador,
        correo,
        contrasena: pass
      })
    });

    alert("Credenciales creadas");
    window.location.reload();
  });
}

// ==========================================
// GENERAR CONTRASEÑA
// ==========================================
function generarContrasena() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let pass = "";

  for (let i = 0; i < 10; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }

  document.getElementById("contrasenaAcceso").value = pass;
  document.getElementById("confirmarContrasena").value = pass;
}

// ==========================================
// COPIAR TEXTO
// ==========================================
async function copiarTexto(id) {
  const el = document.getElementById(id);
  await navigator.clipboard.writeText(el.value);
}