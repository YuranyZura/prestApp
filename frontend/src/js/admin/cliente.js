import "../auth/authGuard.js";
import "../auth/logout.js";

import { API_URL }
from "../config/config.js";

// =====================================
// VARIABLES
// =====================================

const tablaClientes =
  document.getElementById(
    "tablaClientes"
  );

const buscarCliente =
  document.getElementById(
    "buscarCliente"
  );

const nombreUsuario =
  document.getElementById(
    "nombreUsuario"
  );

let clientes = [];

// =====================================
// INICIO
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarUsuario();

    obtenerClientes();

    iniciarBuscador();
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
// OBTENER CLIENTES
// =====================================

async function obtenerClientes() {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/clientes`,
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

      clientes =
        data.clientes || [];

      renderClientes(clientes);

    } else {

      mostrarMensaje(
        data.message ||
        "No se pudieron cargar clientes"
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
// RENDER CLIENTES
// =====================================

function renderClientes(lista) {

  if (!tablaClientes) return;

  tablaClientes.innerHTML = "";

  if (lista.length === 0) {

    tablaClientes.innerHTML = `
      <tr>
        <td colspan="6">
          No hay clientes
        </td>
      </tr>
    `;

    return;
  }

  lista.forEach(cliente => {

    const tr =
      document.createElement("tr");

    tr.innerHTML = `

      <td>
        ${cliente.id_cliente || "-"}
      </td>

      <td>
        ${cliente.nombre || ""}
        ${cliente.apellido || ""}
      </td>

      <td>
        ${cliente.telefono || "-"}
      </td>

      <td>
        ${cliente.direccion || "-"}
      </td>

      <td>

        <span class="
          estado
          ${cliente.estado || "activo"}
        ">

          ${cliente.estado || "activo"}

        </span>

      </td>

      <td>

        <button
          class="btn-ver"
          data-id="${cliente.id_cliente}"
        >
          Ver
        </button>

        <button
          class="btn-editar"
          data-id="${cliente.id_cliente}"
        >
          Editar
        </button>

        <button
          class="btn-eliminar"
          data-id="${cliente.id_cliente}"
        >
          Eliminar
        </button>

      </td>
    `;

    tablaClientes.appendChild(tr);
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
    (e) => {

      const texto =
        e.target.value.toLowerCase();

      const filtrados =
        clientes.filter(cliente => {

          const nombre =
            `${cliente.nombre}
            ${cliente.apellido}`
            .toLowerCase();

          return nombre.includes(texto);
        });

      renderClientes(filtrados);
    }
  );
}

// =====================================
// EVENTOS BOTONES
// =====================================

function iniciarEventos() {

  // =====================================
  // VER
  // =====================================

  document
    .querySelectorAll(".btn-ver")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const id =
            btn.dataset.id;

          verCliente(id);
        }
      );
    });

  // =====================================
  // EDITAR
  // =====================================

  document
    .querySelectorAll(".btn-editar")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const id =
            btn.dataset.id;

          editarCliente(id);
        }
      );
    });

  // =====================================
  // ELIMINAR
  // =====================================

  document
    .querySelectorAll(".btn-eliminar")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const id =
            btn.dataset.id;

          eliminarCliente(id);
        }
      );
    });
}

// =====================================
// VER CLIENTE
// =====================================

function verCliente(id) {

  console.log(
    "Ver cliente:",
    id
  );

  alert(
    `Ver cliente ${id}`
  );
}

// =====================================
// EDITAR CLIENTE
// =====================================

function editarCliente(id) {

  console.log(
    "Editar cliente:",
    id
  );

  alert(
    `Editar cliente ${id}`
  );
}

// =====================================
// ELIMINAR CLIENTE
// =====================================

async function eliminarCliente(id) {

  const confirmar =
    confirm(
      "¿Eliminar cliente?"
    );

  if (!confirmar) return;

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/clientes/${id}`,
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
        "Cliente eliminado",
        "success"
      );

      obtenerClientes();

    } else {

      mostrarMensaje(
        data.message ||
        "No se pudo eliminar"
      );
    }

  } catch (error) {

    console.error(error);

    mostrarMensaje(
      "Error eliminando cliente"
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