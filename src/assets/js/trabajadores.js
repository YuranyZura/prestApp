// ===============================
// CONFIG GLOBAL (IMPORTANTE ANDROID)
// ===============================
const API_URL = "http://TU_IP_LOCAL:4000/api"; 
// ⚠️ CAMBIA ESTO:
// Ejemplo: http://192.168.1.10:4000/api
// ❌ NO usar localhost en Android

let trabajadoresCache = [];
let trabajadorAEliminar = null;

// ===============================
// ALERTAS (COMPATIBLE ANDROID)
// ===============================
function showAlert(message, type = "success", duration = 3000) {
  const container = document.getElementById("alert-container");
  if (!container) return;

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close"></button>
  `;

  container.appendChild(alert);

  // cerrar manual
  alert.querySelector(".btn-close").onclick = () => alert.remove();

  // auto cerrar
  setTimeout(() => {
    alert.remove();
  }, duration);
}

// ===============================
// FETCH SEGURO (ANDROID)
// ===============================
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();

  } catch (error) {
    console.error("API ERROR:", error);
    showAlert("Error de conexión con el servidor", "danger");
    throw error;
  }
}

// ===============================
// CARGAR TRABAJADORES
// ===============================
async function cargarTrabajadores() {
  try {
    const data = await apiFetch("/trabajadores/trabajadores");

    trabajadoresCache = data;
    renderTrabajadores(trabajadoresCache);

  } catch (error) {
    console.error(error);
  }
}

// ===============================
// RENDER TABLA
// ===============================
function renderTrabajadores(lista) {
  const tabla = document.getElementById("tablaTrabajadores");
  const vacio = document.getElementById("mensajeSinResultados");

  if (!tabla) return;

  tabla.innerHTML = "";

  if (!lista || lista.length === 0) {
    vacio?.classList.remove("d-none");
    return;
  }

  vacio?.classList.add("d-none");

  lista.forEach(t => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <img src="${t.foto ? API_URL.replace('/api','') + '/uploads/' + t.foto : 'img/default.png'}"
             style="width:50px;height:50px;border-radius:50%;object-fit:cover;">
      </td>
      <td>${t.cedula}</td>
      <td>${t.nombre} ${t.apellido}</td>
      <td>${t.telefono || ''}</td>
      <td>${t.correo || ''}</td>
      <td>
        <button class="btn btn-sm btn-primary btn-editar">Editar</button>
        <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
      </td>
    `;

    // 👉 Ir a detalle
    tr.addEventListener("click", () => {
      window.location.href = `detalle-trabajador.html?id=${t.id_trabajador}`;
    });

    // 👉 Botones (evitar propagación)
    tr.querySelector(".btn-editar").onclick = (e) => {
      e.stopPropagation();
      abrirModalEditar(t.id_trabajador);
    };

    tr.querySelector(".btn-eliminar").onclick = (e) => {
      e.stopPropagation();
      trabajadorAEliminar = t;

      new bootstrap.Modal(document.getElementById("confirmModal")).show();
    };

    tabla.appendChild(tr);
  });
}

// ===============================
// ELIMINAR
// ===============================
async function eliminarTrabajador() {
  if (!trabajadorAEliminar) return;

  try {
    await apiFetch(`/trabajadores/${trabajadorAEliminar.id_trabajador}`, {
      method: "DELETE"
    });

    showAlert("Trabajador eliminado correctamente", "success");
    cargarTrabajadores();

  } catch (error) {
    showAlert("Error al eliminar", "danger");
  }
}

// ===============================
// ABRIR MODAL EDITAR
// ===============================
async function abrirModalEditar(id) {
  try {
    const t = await apiFetch(`/trabajadores/${id}`);

    document.getElementById("trabajadorId").value = t.id_trabajador;
    document.getElementById("cedula").value = t.cedula;
    document.getElementById("nombre").value = t.nombre;
    document.getElementById("apellido").value = t.apellido;
    document.getElementById("celular").value = t.telefono;
    document.getElementById("correo").value = t.correo;
    document.getElementById("direccion").value = t.direccion;
    document.getElementById("fechaNacimiento").value = t.fecha_nacimiento.split("T")[0];

    const preview = document.getElementById("vistaPrevia");
    preview.innerHTML = t.foto
      ? `<img src="${API_URL.replace('/api','')}/uploads/${t.foto}" style="width:100px;border-radius:50%">`
      : "";

    new bootstrap.Modal(document.getElementById("modalAgregarTrabajador")).show();

  } catch (error) {
    showAlert("Error al cargar trabajador", "danger");
  }
}

// ===============================
// GUARDAR / EDITAR
// ===============================
async function guardarTrabajador(e) {
  e.preventDefault();

  const id = document.getElementById("trabajadorId").value;

  const formData = new FormData();
  formData.append("cedula", cedula.value);
  formData.append("nombre", nombre.value);
  formData.append("apellido", apellido.value);
  formData.append("correo", correo.value);
  formData.append("direccion", direccion.value);

  if (celular.value) formData.append("telefono", celular.value);
  if (fechaNacimiento.value) formData.append("fecha_nacimiento", fechaNacimiento.value);
  if (foto.files[0]) formData.append("foto", foto.files[0]);

  try {
    if (id) {
      await apiFetch(`/trabajadores/trabajadores/${id}`, {
        method: "PUT",
        body: formData
      });
    } else {
      await apiFetch(`/trabajadores/trabajadores`, {
        method: "POST",
        body: formData
      });
    }

    showAlert("Guardado correctamente", "success");

    bootstrap.Modal.getInstance(document.getElementById("modalAgregarTrabajador")).hide();

    document.getElementById("formularioTrabajador").reset();
    cargarTrabajadores();

  } catch (error) {
    showAlert("Error al guardar", "danger");
  }
}

// ===============================
// BUSCADOR (LOCAL - RÁPIDO)
// ===============================
function filtrarTrabajadores(texto) {
  texto = texto.toLowerCase();

  const filtrados = trabajadoresCache.filter(t =>
    `${t.nombre} ${t.apellido}`.toLowerCase().includes(texto) ||
    String(t.cedula).includes(texto) ||
    (t.correo || "").toLowerCase().includes(texto)
  );

  renderTrabajadores(filtrados);
}

// ===============================
// INIT (MUY IMPORTANTE)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Trabajadores.js Android OK");

  cargarTrabajadores();

  // Buscar
  document.getElementById("buscadorTrabajadores")?.addEventListener("input", e => {
    filtrarTrabajadores(e.target.value);
  });

  // Guardar
  document.getElementById("formularioTrabajador")?.addEventListener("submit", guardarTrabajador);

  // Confirmar eliminar
  document.getElementById("confirmDeleteBtn")?.addEventListener("click", eliminarTrabajador);
});