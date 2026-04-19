 // =============================
// VARIABLES GLOBALES
// =============================
let clientePagoActual = null;

// =============================
// INICIO APP
// =============================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("App Trabajador iniciada");

  await cargarPerfil();
  cambiarSeccion("ruta");

  setFechaHoy();
});

// =============================
// PERFIL USUARIO
// =============================
async function cargarPerfil() {
  try {
    const data = await apiFetch("/cobrador/perfil");

    if (!data.success) throw new Error(data.message);

    const user = data.trabajador;

    setText("userName", user.nombreCompleto);

    const avatar = document.getElementById("userAvatar");
    if (avatar) {
      avatar.textContent = user.iniciales;

      if (user.foto) {
        avatar.style.backgroundImage = `url(${user.foto})`;
        avatar.textContent = "";
      }
    }

  } catch (err) {
    console.error(err);
    redirigirLogin();
  }
}

// =============================
// NAVEGACIÓN
// =============================
function cambiarSeccion(seccion) {
  document.querySelectorAll(".app-section").forEach(s => s.classList.remove("active"));
  document.getElementById(`section-${seccion}`)?.classList.add("active");

  if (seccion === "ruta") cargarRuta();
  if (seccion === "clientes") cargarClientes();
  if (seccion === "prestamos") cargarClientesSelect();
  if (seccion === "resumen") cargarResumen();
}

// =============================
// RUTA DEL DÍA
// =============================
async function cargarRuta() {
  try {
    const data = await apiFetch("/cobrador/ruta");

    const clientes = data.clientes.filter(c => c.pendientePagar > 0);

    setText("statPendientes", clientes.length);

    renderRuta(clientes);

  } catch (err) {
    mostrarError("rutaClientesList");
  }
}

function renderRuta(clientes) {
  const cont = document.getElementById("rutaClientesList");

  if (!clientes.length) {
    cont.innerHTML = "<p>No hay clientes</p>";
    return;
  }

  cont.innerHTML = clientes.map(c => `
    <div class="client-item">
      <h6>${c.nombreCliente}</h6>
      <p>$${c.pendientePagar}</p>

      <button onclick="abrirPago(${c.id_clientes}, '${c.nombreCliente}', ${c.pendientePagar})">
        Pagar
      </button>
    </div>
  `).join("");
}

// =============================
// PAGOS
// =============================
function abrirPago(id, nombre, pendiente) {
  clientePagoActual = id;

  setText("pagoNombreCliente", nombre);
  setText("pagoPendiente", `$${pendiente}`);

  document.getElementById("pagoMonto").value = pendiente;

  new bootstrap.Modal("#modalRegistroPago").show();
}

async function guardarPago() {
  const monto = parseFloat(document.getElementById("pagoMonto").value);

  if (!monto) return mostrarToast("Monto inválido", "warning");

  try {
    await apiFetch("/cobrador/pagos", {
      method: "POST",
      body: JSON.stringify({
        clienteId: clientePagoActual,
        monto
      })
    });

    mostrarToast("Pago registrado", "success");

    cargarRuta();

  } catch (err) {
    mostrarToast(err.message, "danger");
  }
}

// =============================
// CLIENTES
// =============================
async function cargarClientes() {
  try {
    const data = await apiFetch("/clientes");

    const cont = document.getElementById("todosClientesList");

    cont.innerHTML = data.clientes.map(c => `
      <div class="cliente-card">
        <span>${c.nombreCompleto}</span>
        <button onclick="verCliente(${c.id_clientes})">Ver</button>
      </div>
    `).join("");

  } catch (err) {
    mostrarError("todosClientesList");
  }
}

// =============================
// PRESTAMOS
// =============================
async function cargarClientesSelect() {
  try {
    const data = await apiFetch("/clientes");

    const select = document.getElementById("clienteSelect");

    select.innerHTML += data.clientes.map(c => `
      <option value="${c.id_clientes}">
        ${c.nombreCompleto}
      </option>
    `).join("");

  } catch (err) {
    console.error(err);
  }
}

document.getElementById("prestamoForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    clienteId: document.getElementById("clienteSelect").value,
    monto: document.getElementById("montoPrestamo").value,
    plazo: document.getElementById("diasPlazo").value
  };

  try {
    await apiFetch("/cobrador/prestamos", {
      method: "POST",
      body: JSON.stringify(data)
    });

    mostrarToast("Préstamo creado", "success");

  } catch (err) {
    mostrarToast(err.message, "danger");
  }
});

// =============================
// RESUMEN
// =============================
async function cargarResumen() {
  try {
    const data = await apiFetch("/pagos/resumen-hoy");

    setText("totalCobrado", `$${formatear(data.totalRecaudado)}`);
    setText("clientesVisitados", data.clientesAtendidos);

  } catch {
    mostrarError("desgloseCobrosList");
  }
}

// =============================
// UTILIDADES
// =============================
function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function formatear(num) {
  return Number(num || 0).toLocaleString("es-CO");
}

function mostrarError(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = "Error al cargar datos";
}

function setFechaHoy() {
  const f = document.getElementById("fechaInicio");
  if (f) f.value = new Date().toISOString().split("T")[0];
}       