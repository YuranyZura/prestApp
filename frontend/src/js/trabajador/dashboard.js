import "../auth/authGuard.js";
import "../auth/logout.js";

import { API_URL }
from "../config/config.js";

// =====================================
// ELEMENTOS
// =====================================

const nombreUsuario =
  document.getElementById(
    "nombreUsuario"
  );

const clientesAsignados =
  document.getElementById(
    "clientesAsignados"
  );

const cobrosHoy =
  document.getElementById(
    "cobrosHoy"
  );

const totalRecaudado =
  document.getElementById(
    "totalRecaudado"
  );

const prestamosActivos =
  document.getElementById(
    "prestamosActivos"
  );

const tablaActividad =
  document.getElementById(
    "tablaActividad"
  );

// =====================================
// INICIO
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "Dashboard Trabajador iniciado"
    );

    cargarUsuario();

    obtenerResumen();

    obtenerActividadReciente();

    iniciarGraficoCobros();
  }
);

// =====================================
// CARGAR USUARIO
// =====================================

function cargarUsuario() {

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuario"
      )
    );

  if (
    usuario &&
    nombreUsuario
  ) {

    nombreUsuario.textContent =
      usuario.nombre || "Trabajador";
  }
}

// =====================================
// OBTENER RESUMEN
// =====================================

async function obtenerResumen() {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/dashboard/trabajador`,
        {

          method: "GET",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    console.log(data);

    if (data.success) {

      if (clientesAsignados) {

        clientesAsignados.textContent =
          data.resumen
            ?.clientes || 0;
      }

      if (cobrosHoy) {

        cobrosHoy.textContent =
          `$${data.resumen?.cobros_hoy || 0}`;
      }

      if (totalRecaudado) {

        totalRecaudado.textContent =
          `$${data.resumen?.total_recaudado || 0}`;
      }

      if (prestamosActivos) {

        prestamosActivos.textContent =
          data.resumen
            ?.prestamos || 0;
      }

    }

  } catch (error) {

    console.error(error);

    mostrarMensaje(
      "Error cargando dashboard"
    );
  }
}

// =====================================
// ACTIVIDAD RECIENTE
// =====================================

async function obtenerActividadReciente() {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/pagos/recientes`,
        {

          method: "GET",

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    if (data.success) {

      renderActividad(
        data.pagos || []
      );
    }

  } catch (error) {

    console.error(error);
  }
}

// =====================================
// RENDER ACTIVIDAD
// =====================================

function renderActividad(lista) {

  if (!tablaActividad) return;

  tablaActividad.innerHTML = "";

  if (lista.length === 0) {

    tablaActividad.innerHTML = `

      <tr>

        <td colspan="4">
          Sin actividad reciente
        </td>

      </tr>
    `;

    return;
  }

  lista.forEach(pago => {

    const tr =
      document.createElement("tr");

    tr.innerHTML = `

      <td>
        ${pago.cliente || "-"}
      </td>

      <td>
        $${pago.monto || 0}
      </td>

      <td>
        ${pago.fecha || "-"}
      </td>

      <td>

        <span class="
          estado
          ${pago.estado || "pagado"}
        ">

          ${pago.estado || "pagado"}

        </span>

      </td>
    `;

    tablaActividad.appendChild(tr);
  });
}

// =====================================
// GRÁFICO
// =====================================

function iniciarGraficoCobros() {

  const chartEl =
    document.querySelector(
      "#graficoCobros"
    );

  if (!chartEl) return;

  const chart =
    new ApexCharts(chartEl, {

      series: [
        {
          name: "Cobros",

          data: [
            120,
            150,
            180,
            90,
            200,
            160,
            210
          ]
        }
      ],

      chart: {

        type: "area",

        height: 320,

        toolbar: {
          show: false
        }
      },

      dataLabels: {
        enabled: false
      },

      stroke: {
        curve: "smooth",
        width: 3
      },

      xaxis: {

        categories: [
          "Lun",
          "Mar",
          "Mié",
          "Jue",
          "Vie",
          "Sáb",
          "Dom"
        ]
      }
    });

  chart.render();
}

// =====================================
// MENSAJES
// =====================================

function mostrarMensaje(
  texto,
  tipo = "error"
) {

  console.log(
    `[${tipo}] ${texto}`
  );

  alert(texto);
}