import "../auth/authGuard.js";
import "../auth/logout.js";

import { API_URL }
from "../config/config.js";

// =====================================
// ELEMENTOS
// =====================================

const tablaPrestamos =
  document.getElementById(
    "tablaPrestamos"
  );

const buscarPrestamo =
  document.getElementById(
    "buscarPrestamo"
  );

const nombreUsuario =
  document.getElementById(
    "nombreUsuario"
  );

const btnNuevoPrestamo =
  document.getElementById(
    "btnNuevoPrestamo"
  );

// =====================================
// VARIABLES
// =====================================

let prestamos = [];

// =====================================
// INICIO
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarUsuario();

    obtenerPrestamos();

    iniciarBuscador();

    iniciarNuevoPrestamo();
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
// OBTENER PRÉSTAMOS
// =====================================

async function obtenerPrestamos() {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/prestamos`,
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

      prestamos =
        data.prestamos || [];

      renderPrestamos(prestamos);

    } else {

      mostrarMensaje(
        data.message ||
        "No se pudieron cargar préstamos"
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

function renderPrestamos(lista) {

  if (!tablaPrestamos) return;

  tablaPrestamos.innerHTML = "";

  if (lista.length === 0) {

    tablaPrestamos.innerHTML = `

      <tr>

        <td colspan="8">
          No hay préstamos registrados
        </td>

      </tr>
    `;

    return;
  }

  lista.forEach(prestamo => {

    const tr =
      document.createElement("tr");

    tr.innerHTML = `

      <td>
        ${prestamo.id_prestamo || "-"}
      </td>

      <td>
        ${prestamo.cliente_nombre || "-"}
      </td>

      <td>
        $${prestamo.monto || 0}
      </td>

      <td>
        ${prestamo.interes || 0}%
      </td>

      <td>
        ${prestamo.cuotas || 0}
      </td>

      <td>

        <span class="
          estado
          ${prestamo.estado || "activo"}
        ">

          ${prestamo.estado || "activo"}

        </span>

      </td>

      <td>
        ${prestamo.fecha || "-"}
      </td>

      <td>

        <button
          class="btn-ver"
          data-id="${prestamo.id_prestamo}"
        >
          Ver
        </button>

        <button
          class="btn-editar"
          data-id="${prestamo.id_prestamo}"
        >
          Editar
        </button>

        <button
          class="btn-eliminar"
          data-id="${prestamo.id_prestamo}"
        >
          Eliminar
        </button>

      </td>
    `;

    tablaPrestamos.appendChild(tr);
  });

  iniciarEventos();
}

// =====================================
// BUSCADOR
// =====================================

function iniciarBuscador() {

  if (!buscarPrestamo) return;

  buscarPrestamo.addEventListener(
    "input",
    (e) => {

      const texto =
        e.target.value.toLowerCase();

      const filtrados =
        prestamos.filter(prestamo => {

          const cliente =
            (
              prestamo.cliente_nombre || ""
            ).toLowerCase();

          return cliente.includes(texto);
        });

      renderPrestamos(filtrados);
    }
  );
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

          verPrestamo(id);
        }
      );
    });

  // EDITAR

  document
    .querySelectorAll(".btn-editar")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const id =
            btn.dataset.id;

          editarPrestamo(id);
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

          eliminarPrestamo(id);
        }
      );
    });
}

// =====================================
// VER PRÉSTAMO
// =====================================

function verPrestamo(id) {

  console.log(
    "Ver préstamo:",
    id
  );

  alert(
    `Ver préstamo ${id}`
  );
}

// =====================================
// EDITAR PRÉSTAMO
// =====================================

function editarPrestamo(id) {

  console.log(
    "Editar préstamo:",
    id
  );

  alert(
    `Editar préstamo ${id}`
  );
}

// =====================================
// ELIMINAR PRÉSTAMO
// =====================================

async function eliminarPrestamo(id) {

  const confirmar =
    confirm(
      "¿Eliminar préstamo?"
    );

  if (!confirmar) return;

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/prestamos/${id}`,
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
        "Préstamo eliminado",
        "success"
      );

      obtenerPrestamos();

    } else {

      mostrarMensaje(
        data.message ||
        "No se pudo eliminar"
      );
    }

  } catch (error) {

    console.error(error);

    mostrarMensaje(
      "Error eliminando préstamo"
    );
  }
}

// =====================================
// NUEVO PRÉSTAMO
// =====================================

function iniciarNuevoPrestamo() {

  if (!btnNuevoPrestamo)
    return;

  btnNuevoPrestamo
    .addEventListener(
      "click",
      () => {

        window.location.href =
          "/src/html/admin/crear-prestamo.html";
      }
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