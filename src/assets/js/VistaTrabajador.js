 // ===============================
// CONFIG GENERAL
// ===============================
const STORAGE = {
  clientes: "clientes",
  prestamos: "prestamos",
  pagos: "pagos"
};

// ===============================
// UTILIDADES
// ===============================
function getData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function hoy() {
  return new Date().toISOString().split("T")[0];
}

// ===============================
// ALERTA (MEJOR PARA ANDROID)
// ===============================
function showAlert(msg, type = "success") {
  const container = document.getElementById("alert-container");
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert-${type} fade show">
      ${msg}
    </div>
  `;

  setTimeout(() => {
    container.innerHTML = "";
  }, 2500);
}

// ===============================
// NAVEGACIÓN (OPTIMIZADA)
// ===============================
function showSection(section) {
  document.querySelectorAll(".app-section").forEach(s => s.classList.remove("active"));
  document.getElementById(`section-${section}`)?.classList.add("active");

  document.querySelectorAll(".app-nav-item").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`[data-section="${section}"]`)?.classList.add("active");

  const titles = {
    clientes: "Gestión de Clientes",
    prestamos: "Préstamos",
    pagos: "Pagos",
    ruta: "Ruta",
    resumen: "Resumen"
  };

  document.getElementById("headerSubtitle").textContent = titles[section] || "Panel";
}

// ===============================
// CLIENTES
// ===============================
function actualizarListaClientes() {
  const clientes = getData(STORAGE.clientes);
  const cont = document.getElementById("clientesList");

  if (!clientes.length) {
    cont.innerHTML = "<p class='text-center text-muted'>Sin clientes</p>";
    return;
  }

  cont.innerHTML = clientes.map(c => `
    <div class="list-group-item d-flex justify-content-between">
      <div>
        <strong>${c.nombreCliente}</strong><br>
        <small>${c.telefonoCliente}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-danger" data-del="${c.id}">🗑</button>
      </div>
    </div>
  `).join("");
}

// ===============================
// ELIMINAR CLIENTE
// ===============================
function eliminarCliente(id) {
  let clientes = getData(STORAGE.clientes).filter(c => c.id !== id);
  setData(STORAGE.clientes, clientes);

  // eliminar prestamos relacionados
  let prestamos = getData(STORAGE.prestamos).filter(p => p.clienteId !== id);
  setData(STORAGE.prestamos, prestamos);

  actualizarListaClientes();
  showAlert("Cliente eliminado", "warning");
}

// ===============================
// REGISTRAR CLIENTE
// ===============================
function registrarCliente(e) {
  e.preventDefault();

  const form = e.target;
  const data = Object.fromEntries(new FormData(form));

  data.id = Date.now();
  data.fechaRegistro = hoy();

  const clientes = getData(STORAGE.clientes);
  clientes.push(data);
  setData(STORAGE.clientes, clientes);

  form.reset();
  actualizarListaClientes();
  showAlert("Cliente guardado");
}

// ===============================
// PRÉSTAMOS
// ===============================
function registrarPrestamo(e) {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));
  data.id = Date.now();
  data.fechaCreacion = hoy();

  const prestamos = getData(STORAGE.prestamos);
  prestamos.push(data);
  setData(STORAGE.prestamos, prestamos);

  e.target.reset();
  showAlert("Préstamo creado");
}

// ===============================
// PAGOS
// ===============================
function registrarPago(e, tipo = "regular") {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));
  data.id = Date.now();
  data.fechaRegistro = hoy();
  data.tipo = tipo;

  const pagos = getData(STORAGE.pagos);
  pagos.push(data);
  setData(STORAGE.pagos, pagos);

  e.target.reset();
  showAlert("Pago registrado");
  generarResumen();
}

// ===============================
// RUTA (OPTIMIZADA)
// ===============================
function actualizarRuta() {
  const clientes = getData(STORAGE.clientes);
  const cont = document.getElementById("rutaContainer");

  if (!clientes.length) {
    cont.innerHTML = "<p class='text-center'>Sin ruta</p>";
    return;
  }

  cont.innerHTML = clientes.map(c => `
    <div class="route-item">
      <strong>${c.nombreCliente}</strong>
      <button class="btn btn-sm btn-success" data-cobro="${c.id}">Cobrar</button>
    </div>
  `).join("");
}

// ===============================
// RESUMEN (OPTIMIZADO)
// ===============================
function generarResumen() {
  const pagos = getData(STORAGE.pagos);
  const hoyFecha = hoy();

  const total = pagos
    .filter(p => p.fechaRegistro === hoyFecha)
    .reduce((sum, p) => sum + parseFloat(p.montoPago || 0), 0);

  document.getElementById("resumenCobrado").textContent = `$${total.toFixed(2)}`;
}

// ===============================
// EVENTOS (IMPORTANTE ANDROID)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // navegación
  document.querySelectorAll(".app-nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      showSection(btn.dataset.section);
    });
  });

  // formularios
  document.getElementById("clienteForm")?.addEventListener("submit", registrarCliente);
  document.getElementById("prestamoForm")?.addEventListener("submit", registrarPrestamo);

  document.getElementById("pagosForm")?.addEventListener("submit", e => registrarPago(e, "regular"));
  document.getElementById("pagoAdelantadoForm")?.addEventListener("submit", e => registrarPago(e, "adelantado"));
  document.getElementById("pagoAtrasadoForm")?.addEventListener("submit", e => registrarPago(e, "atrasado"));

  // eliminar cliente (delegación)
  document.getElementById("clientesList")?.addEventListener("click", e => {
    if (e.target.dataset.del) {
      eliminarCliente(Number(e.target.dataset.del));
    }
  });

  // init
  actualizarListaClientes();
  actualizarRuta();
  generarResumen();

  // fecha automática
  document.querySelectorAll("input[type='date']").forEach(i => {
    if (!i.value) i.value = hoy();
  });

});