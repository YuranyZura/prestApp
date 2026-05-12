import "../auth/authGuard.js";
import "../auth/logout.js";

import { API_URL }
from "../config/config.js";

// =====================================
// ELEMENTOS
// =====================================

const tablaPagos =
  document.getElementById(
    "tablaPagos"
  );

const buscarPago =
  document.getElementById(
    "buscarPago"
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

let pagos = [];

// =====================================
// INICIO
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarUsuario();

    obtenerPagos();

    iniciarBuscador();

    iniciarFiltroEstado();
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
      usuario.nombre || "Administrador";
  }
}

// =====================================
// OBTENER PAGOS
// =====================================

async function obtenerPagos() {

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

      pagos =
        data.pagos || [];

      renderPagos(pagos);

    } else {

      mostrarMensaje(
        data.message ||
        "No se pudieron cargar pagos"
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

function renderPagos(lista) {

  if (!tablaPagos) return;

  tablaPagos.innerHTML = "";

  if (lista.length === 0) {

    tablaPagos.innerHTML = `

      <tr>

        <td colspan="7">
          No hay pagos registrados
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
        ${pago.id_pago || "-"}
      </td>

      <td>
        ${pago.cliente_nombre || "-"}
      </td>

      <td>
        $${pago.monto || 0}
      </td>

      <td>
        ${pago.metodo_pago || "-"}
      </td>

      <td>
        ${pago.fecha_pago || "-"}
      </td>

      <td>

        <span class="
          estado
          ${pago.estado || "pendiente"}
        ">

          ${pago.estado || "pendiente"}

        </span>

      </td>

      <td>

        <button
          class="btn-ver"
          data-id="${pago.id_pago}"
        >
          Ver
        </button>

        <button
          class="btn-eliminar"
          data-id="${pago.id_pago}"
        >
          Eliminar
        </button>

      </td>
    `;

    tablaPagos.appendChild(tr);
  });

  iniciarEventos();
}

// =====================================
// BUSCADOR
// =====================================

function iniciarBuscador() {

  if (!buscarPago) return;

  buscarPago.addEventListener(
    "input",
    aplicarFiltros
  );
}

// =====================================
// FILTRO ESTADO
// =====================================

function iniciarFiltroEstado() {

  if (!filtroEstado) return;

  filtroEstado.addEventListener(
    "change",
    aplicarFiltros
  );
}

// =====================================
// APLICAR FILTROS
// =====================================

function aplicarFiltros() {

  const texto =
    buscarPago.value
      .toLowerCase()
      .trim();

  const estado =
    filtroEstado.value;

  const filtrados =
    pagos.filter(pago => {

      const cliente =
        (
          pago.cliente_nombre || ""
        ).toLowerCase();

      const coincideTexto =
        cliente.includes(texto);

      const coincideEstado =
        !estado ||
        pago.estado === estado;

      return (
        coincideTexto &&
        coincideEstado
      );
    });

  renderPagos(filtrados);
}

// =====================================
// EVENTOS BOTONES
// =====================================

function iniciarEventos() {

  // VER

  document
    .querySelectorAll(".btn-ver")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const id =
            btn.dataset.id;

          verPago(id);
        }
      );
    });

  // ELIMINAR

  document
    .querySelectorAll(".btn-eliminar")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const id =
            btn.dataset.id;

          eliminarPago(id);
        }
      );
    });
}

// =====================================
// VER PAGO
// =====================================

function verPago(id) {

  console.log(
    "Ver pago:",
    id
  );

  alert(
    `Ver pago ${id}`
  );
}

// =====================================
// ELIMINAR PAGO
// =====================================

async function eliminarPago(id) {

  const confirmar =
    confirm(
      "¿Eliminar pago?"
    );

  if (!confirmar) return;

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/pagos/${id}`,
        {

          method: "DELETE",

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    if (data.success) {

      mostrarMensaje(
        "Pago eliminado",
        "success"
      );

      obtenerPagos();

    } else {

      mostrarMensaje(
        data.message ||
        "No se pudo eliminar"
      );
    }

  } catch (error) {

    console.error(error);

    mostrarMensaje(
      "Error eliminando pago"
    );
  }
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