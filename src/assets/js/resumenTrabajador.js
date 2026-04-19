// =============================
// INICIO
// =============================
let intervaloResumen = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log("ResumenCobros.js cargado");

  setFechaActual();
  cargarResumenHoy();
  iniciarAutoRefresh();
  controlarVisibilidadApp(); // 🔥 IMPORTANTE PARA ANDROID
});

// =============================
// FECHA ACTUAL
// =============================
function setFechaActual() {
  const input = document.getElementById('filtroFecha');
  if (input) {
    input.value = new Date().toISOString().split('T')[0];
  }
}

// =============================
// API
// =============================
async function cargarResumenHoy() {
  try {
    const data = await apiFetch("/pagos/resumen-hoy", {
      method: "GET"
    });

    actualizarVista(data);

  } catch (error) {
    console.error("Error resumen hoy:", error);
    mostrarError();
  }
}

async function cargarResumenPorFecha() {
  const input = document.getElementById('filtroFecha');

  if (!input || !input.value) {
    mostrarToast("Selecciona una fecha", "warning");
    return;
  }

  try {
    const data = await apiFetch(`/pagos/resumen-dia?fecha=${input.value}`, {
      method: "GET"
    });

    actualizarVista(data);

  } catch (error) {
    console.error("Error resumen fecha:", error);
    mostrarError();
  }
}

// =============================
// UI
// =============================
function actualizarVista(data) {
  actualizarEstadisticas(data);
  renderListaCobros(data.cuotas || []);
}

// =============================
// ESTADÍSTICAS
// =============================
function actualizarEstadisticas(data) {
  setText("totalCobrado", `$${formatear(data.totalRecaudado)}`);
  setText("clientesVisitados", data.clientesAtendidos || 0);
  setText("totalPendiente", `$${formatear(data.totalPendiente || 0)}`);
}

// =============================
// LISTA
// =============================
function renderListaCobros(cuotas) {
  const contenedor = document.getElementById('desgloseCobrosList');
  if (!contenedor) return;

  if (!cuotas.length) {
    contenedor.innerHTML = `
      <div class="text-center py-4">
        <i class="ti ti-receipt fs-1 text-muted"></i>
        <p class="text-muted">No hay cobros hoy</p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = cuotas.map((c, i) => `
    <div class="list-group-item">
      <div class="d-flex justify-content-between">
        <div>
          <h6 class="fw-semibold">
            <span class="badge bg-primary me-2">#${i + 1}</span>
            ${c.nombreCliente}
          </h6>
          <small class="text-muted">
            ${c.cedula} • ${c.hora} • ${c.metodo}
          </small>
        </div>
        <span class="badge bg-success">$${formatear(c.monto)}</span>
      </div>
    </div>
  `).join('');
}

// =============================
// UTILIDADES
// =============================
function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function formatear(num) {
  return Number(num || 0).toLocaleString('es-CO', {
    minimumFractionDigits: 2
  });
}

// =============================
// ERRORES
// =============================
function mostrarError() {
  const contenedor = document.getElementById('desgloseCobrosList');
  if (contenedor) {
    contenedor.innerHTML = `
      <div class="text-center text-danger py-4">
        <i class="ti ti-alert-circle fs-1"></i>
        <p>Error al cargar datos</p>
      </div>
    `;
  }
}

// =============================
// AUTO REFRESH INTELIGENTE
// =============================
function iniciarAutoRefresh() {
  if (intervaloResumen) clearInterval(intervaloResumen);

  intervaloResumen = setInterval(() => {
    console.log("Actualizando resumen...");
    cargarResumenHoy();
  }, 30000);
}

// 🔥 CLAVE PARA ANDROID
function controlarVisibilidadApp() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      console.log("App en segundo plano → detener refresh");
      clearInterval(intervaloResumen);
    } else {
      console.log("App activa → reanudar refresh");
      iniciarAutoRefresh();
      cargarResumenHoy();
    }
  });
}

// =============================
// IMPRIMIR
// =============================
function imprimirResumen() {
  const fecha = new Date().toLocaleDateString('es-CO');
  const contenido = document.getElementById('desgloseCobrosList')?.innerHTML;

  const win = window.open('', '_blank');

  win.document.write(`
    <html>
      <head>
        <title>Resumen ${fecha}</title>
        <style>
          body { font-family: Arial; padding:20px }
          h2 { text-align:center }
        </style>
      </head>
      <body>
        <h2>Resumen de Cobros</h2>
        <p>${fecha}</p>
        ${contenido || 'Sin datos'}
        <script>
          window.print();
          setTimeout(()=>window.close(),500);
        </script>
      </body>
    </html>
  `);

  win.document.close();
}