import "../auth/authGuard.js";
import "../auth/logout.js";

import { API_URL }
from "../config/config.js";

// =====================================
// ELEMENTOS
// =====================================

const tablaCobranza =
  document.getElementById(
    "tablaCobranza"
  );

const buscarCliente =
  document.getElementById(
    "buscarCliente"
  );

const filtroEstado =
  document.getElementById(
    "filtroEstado"
  );

const nombreUsuario =
  document.getElementById(
    "nombreUsuario"
  );

// =====================================
// VARIABLES
// =====================================

let cobranzas = [];

// =====================================
// INICIO
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "Cobranza.js iniciado"
    );

    cargarUsuario();

    obtenerCobranza();

    iniciarBuscador();

    iniciarFiltro();
  }
);

// =====================================
// USUARIO
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
// OBTENER COBRANZAS
// =====================================

async function obtenerCobranza() {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/pagos`,
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

      cobranzas =
        data.pagos || [];

      renderCobranza(cobranzas);

    } else {

      mostrarMensaje(
        data.message ||
        "No se pudo cargar cobranza"
      );
    }

  } catch (error) {

    console.error(error);

    mostrarMensaje(
      "Error conectando servidor"
    );
  }
}

// =====================================
// RENDER TABLA
// =====================================

function renderCobranza(lista) {

  if (!tablaCobranza) return;

  tablaCobranza.innerHTML = "";

  if (lista.length === 0) {

    tablaCobranza.innerHTML = `

      <tr>

        <td colspan="7">
          No hay cobros registrados
        </td>

      </tr>
    `;

    return;
  }

  lista.forEach(item => {

    const tr =
      document.createElement("tr");

    tr.innerHTML = `

      <td>
        ${item.cliente_nombre || "-"}
      </td>

      <td>
        ${item.telefono || "-"}
      </td>

      <td>
        $${item.monto || 0}
      </td>

      <td>
        ${item.fecha_pago || "-"}
      </td>

      <td>

        <span class="
          estado
          ${item.estado || "pendiente"}
        ">

          ${item.estado || "pendiente"}

        </span>

      </td>

      <td>
        ${item.metodo_pago || "-"}
      </td>

      <td>

        <button
          class="btn-cobrar"
          data-id="${item.id_pago}"
        >
          Cobrar
        </button>

        <button
          class="btn-detalle"
          data-id="${item.id_pago}"
        >
          Detalle
        </button>

      </td>
    `;

    tablaCobranza.appendChild(tr);
  });

  iniciarEventos();
}

// =====================================
// BUSCADOR
// =====================================

function iniciarBuscador() {

  if (!buscarCliente) return;

  buscarCliente.addEventListener(
    "input",
    aplicarFiltros
  );
}

// =====================================
// FILTRO
// =====================================

function iniciarFiltro() {

  if (!filtroEstado) return;

  filtroEstado.addEventListener(
    "change",
    aplicarFiltros
  );
}

// =====================================
// FILTRAR
// =====================================

function aplicarFiltros() {

  const texto =
    buscarCliente.value
      .toLowerCase()
      .trim();

  const estado =
    filtroEstado.value;

  const filtrados =
    cobranzas.filter(item => {

      const cliente =
        (
          item.cliente_nombre || ""
        ).toLowerCase();

      const coincideTexto =
        cliente.includes(texto);

      const coincideEstado =
        !estado ||
        item.estado === estado;

      return (
        coincideTexto &&
        coincideEstado
      );
    });

  renderCobranza(filtrados);
}

// =====================================
// EVENTOS BOTONES
// =====================================

function iniciarEventos() {

  // COBRAR

  document
    .querySelectorAll(".btn-cobrar")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const id =
            btn.dataset.id;

          registrarCobro(id);
        }
      );
    });

  // DETALLE

  document
    .querySelectorAll(".btn-detalle")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const id =
            btn.dataset.id;

          verDetalle(id);
        }
      );
    });
}

// =====================================
// REGISTRAR COBRO
// =====================================

async function registrarCobro(id) {

  const confirmar =
    confirm(
      "¿Registrar este pago?"
    );

  if (!confirmar) return;

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/pagos/${id}/cobrar`,
        {

          method: "PUT",

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

    if (data.success) {

      mostrarMensaje(
        "Pago registrado",
        "success"
      );

      obtenerCobranza();

    } else {

      mostrarMensaje(
        data.message ||
        "No se pudo registrar"
      );
    }

  } catch (error) {

    console.error(error);

    mostrarMensaje(
      "Error registrando cobro"
    );
  }
}

// =====================================
// VER DETALLE
// =====================================

function verDetalle(id) {

  console.log(
    "Detalle:",
    id
  );

  alert(
    `Detalle del pago ${id}`
  );
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