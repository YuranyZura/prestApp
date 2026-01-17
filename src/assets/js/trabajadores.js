

function showAlert(message, type = "success", duration = 3000) {
  const container = document.getElementById("alert-container");

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  container.appendChild(alert);


  setTimeout(() => {
    alert.classList.remove("show");
    alert.classList.add("hide");
    alert.addEventListener("transitionend", () => alert.remove());
  }, duration);
}





// Abre el modal
const modal = new bootstrap.Modal(document.getElementById('modalAgregarTrabajador'));

// Cerrar modal
modal.hide();

// Cache local de trabajadores para búsqueda/filtrado en cliente
let trabajadoresCache = [];


document.addEventListener("DOMContentLoaded", () => {
  const btnGuardar = document.getElementById("btnGuardarTrabajador");
  const formulario = document.getElementById("formularioTrabajador");

  // Función para validar inputs
  function validarFormulario() {
    let valido = true;

    const cedula = document.getElementById("cedula");
    const nombre = document.getElementById("nombre");
    const celular = document.getElementById("celular");
    const correo = document.getElementById("correo");
    const fechaNacimiento = document.getElementById("fechaNacimiento");
    const foto = document.getElementById("foto");



    // Limpiar errores anteriores
    [cedula, nombre].forEach(input => {
      input.classList.remove("is-invalid");
      input.nextElementSibling.textContent = "";
    });

    // Validación cédula
    if (!/^\d{10,}$/.test(cedula.value.trim())) {
      cedula.classList.add("is-invalid");
      document.getElementById("cedulaFeedback").textContent = "La cédula debe tener mínimo 10 dígitos.";
      valido = false;
    }

    // Validación nombre
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{2,}$/.test(nombre.value.trim())) {
      nombre.classList.add("is-invalid");
      document.getElementById("nombreFeedback").textContent = "El nombre debe tener al menos 2 letras.";
      valido = false;
    }


    // Validación celular
    if (!/^\d{10,}$/.test(celular.value.trim())) {
    celular.classList.add("is-invalid");
    document.getElementById("celularFeedback").textContent = "El celular debe tener mínimo 10 dígitos.";
    valido = false;
  }

    // Validación correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim())) {
      correo.classList.add("is-invalid");
      document.getElementById("correoFeedback").textContent = "Ingrese un correo electrónico válido.";
      valido = false;
    }


    
  // Fecha de nacimiento: mayor de 18 años
  if (fechaNacimiento.value) {
    const fecha = new Date(fechaNacimiento.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    const dia = hoy.getDate() - fecha.getDate();

    if (edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)))) {
      fechaNacimiento.classList.add("is-invalid");
      document.getElementById("fechaNacimientoFeedback").textContent = "Debe ser mayor de 18 años.";
      valido = false;
    }
  } else {
    fechaNacimiento.classList.add("is-invalid");
    document.getElementById("fechaNacimientoFeedback").textContent = "Debe ingresar una fecha de nacimiento.";
    valido = false;
  }



    // Foto: opcional, pero si hay archivo debe ser imagen
  if (foto.files.length > 0) {
    const archivo = foto.files[0];
    if (!archivo.type.startsWith("image/")) {
      foto.classList.add("is-invalid");
      document.getElementById("fotoFeedback").textContent = "El archivo debe ser una imagen (jpg, png, etc.).";
      valido = false;
    }
  }
    return valido;
  }

  btnGuardar.addEventListener("click", async (event) => {
    event.preventDefault();

    if (!validarFormulario()) return;

    // Crear objeto FormData
    const id = document.getElementById("trabajadorId").value;
    // Usamos el form para facilitar edición (pero mapeamos campos para la ruta PUT)
    const formData = new FormData();
    formData.append("cedula", document.getElementById("cedula").value);
    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("apellido", document.getElementById("apellido").value);
    formData.append("direccion", document.getElementById("direccion").value);
    formData.append("correo", document.getElementById("correo").value);
    // campo de creación usa 'celular' y 'fechaNacimiento' en tu POST backend; para PUT el servidor espera 'telefono' y 'fecha_nacimiento'
    const celular = document.getElementById("celular").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const foto = document.getElementById("foto").files[0];
    try {
      let response;

      if (id) {
        // EDITAR: usar ruta PUT correcta: /api/trabajadores/trabajadores/:id (coincide con router.put)
        const putData = new FormData();
        putData.append("cedula", document.getElementById("cedula").value);
        putData.append("nombre", document.getElementById("nombre").value);
        putData.append("apellido", document.getElementById("apellido").value);
        putData.append("telefono", celular);
        putData.append("correo", document.getElementById("correo").value);
        putData.append("direccion", document.getElementById("direccion").value);
        putData.append("fecha_nacimiento", fechaNacimiento);
        if (foto) putData.append("foto", foto);

        response = await fetch(`http://localhost:3000/api/trabajadores/trabajadores/${id}`, {
          method: "PUT",
          body: putData,
        });
      } else {
        // CREAR: usar la ruta POST existente
        const postData = new FormData();
        postData.append("cedula", document.getElementById("cedula").value);
        postData.append("fechaNacimiento", fechaNacimiento);
        postData.append("nombre", document.getElementById("nombre").value);
        postData.append("apellido", document.getElementById("apellido").value);
        postData.append("direccion", document.getElementById("direccion").value);
        postData.append("celular", celular);
        postData.append("correo", document.getElementById("correo").value);
        if (foto) postData.append("foto", foto);

        response = await fetch("http://localhost:3000/api/trabajadores/trabajadores", {
          method: "POST",
          body: postData,
        });
      }

      if (!response.ok) throw new Error("Error al guardar el trabajador");

      const data = await response.json();
      console.log(id ? "Trabajador actualizado:" : "Trabajador guardado:", data);

      const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregarTrabajador"));
      modal.hide();

      mostrarAlerta("¡Éxito!", id ? "El trabajador fue actualizado correctamente." : "El trabajador fue guardado correctamente.", "success");
      cargarTrabajadores();
      formulario.reset();
      document.getElementById("vistaPrevia").innerHTML = "";
      document.getElementById("trabajadorId").value = "";

    } catch (error) {
      console.error("Error:", error);
      mostrarAlerta("Error", "No se pudo guardar el trabajador.", "danger");
    }
  });

  function mostrarAlerta(titulo, mensaje, tipo = "success") {
    const alertContainer = document.getElementById("alertContainer");
    alertContainer.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show small mb-0" role="alert" style="min-width: 200px; max-width: 300px;">
        <strong>${titulo}</strong> ${mensaje}
        <button type="button" class="btn-close btn-sm" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }
});



// Render function: crea las filas a partir de una lista de trabajadores
function renderTrabajadores(list) {
  const tabla = document.getElementById("tablaTrabajadores");
  const mensajeSinResultados = document.getElementById("mensajeSinResultados");
  tabla.innerHTML = "";

  if (!list || list.length === 0) {
    mensajeSinResultados.classList.remove("d-none");
    return;
  }

  mensajeSinResultados.classList.add("d-none");

  list.forEach(trabajador => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td><img src="${trabajador.foto ? '/uploads/' + trabajador.foto : 'img/default.png'}" class="rounded-circle" style="width:50px; height:50px; object-fit:cover;"></td>
      <td>${trabajador.cedula}</td>
      <td>${trabajador.nombre} ${trabajador.apellido}</td>
      <td>${trabajador.telefono || ''}</td>
      <td>${trabajador.correo || ''}</td>
      <td>
        <button class="btn btn-sm btn-primary" data-id="${trabajador.id_trabajador}">Editar</button>
        <button class="btn btn-sm btn-danger" data-id="${trabajador.id_trabajador}">Eliminar</button>
      </td>
    `;

    fila.style.cursor = "pointer";
    fila.addEventListener("click", () => {
      window.location.href = `detalle-trabajador.html?id=${trabajador.id_trabajador}`;
    });

    tabla.appendChild(fila);

    const btnEditar = fila.querySelector(".btn-primary");
    const btnEliminar = fila.querySelector(".btn-danger");

    btnEditar.addEventListener("click", (event) => {
      event.stopPropagation();
      abrirModalEditar(trabajador.id_trabajador);
    });

    btnEliminar.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      trabajadorAEliminar = trabajador;
      const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));
      confirmModal.show();
    });
  });
}

// Variable para el trabajador a eliminar (se usa desde el modal de confirmación)
let trabajadorAEliminar = null;

// Confirmación global para eliminar (usa trabajadorAEliminar)
document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
  const confirmModalEl = document.getElementById("confirmModal");
  const confirmModal = bootstrap.Modal.getInstance(confirmModalEl);
  confirmModal.hide();

  try {
    if (!trabajadorAEliminar) throw new Error('No hay trabajador seleccionado para eliminar');
    const response = await fetch(`http://localhost:3000/api/trabajadores/${trabajadorAEliminar.id_trabajador}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("No se pudo eliminar al trabajador");

    cargarTrabajadores();
    showAlert("¡Éxito! Se eliminó trabajador.", "success");
  } catch (error) {
    console.error("Error:", error);
    showAlert("Error al eliminar el trabajador.", "danger");
  }
});


// Función para cargar los trabajadores desde la API y almacenar en cache
async function cargarTrabajadores() {
  try {
    const response = await fetch("http://localhost:3000/api/trabajadores/trabajadores");
    if (!response.ok) throw new Error("Error al cargar trabajadores");

    const trabajadores = await response.json();
    // Guardar en cache para búsquedas locales
    trabajadoresCache = trabajadores;
    renderTrabajadores(trabajadoresCache);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Iniciar carga y conectar input de búsqueda
document.addEventListener("DOMContentLoaded", () => {
  cargarTrabajadores();

  const buscador = document.getElementById("buscadorTrabajadores");
  if (buscador) {
    buscador.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) return renderTrabajadores(trabajadoresCache);

      const filtrados = trabajadoresCache.filter(t => {
        const nombreCompleto = `${t.nombre || ''} ${t.apellido || ''}`.toLowerCase();
        const ced = String(t.cedula || '');
        const correo = (t.correo || '').toLowerCase();
        return nombreCompleto.includes(q) || ced.includes(q) || correo.includes(q);
      });

      renderTrabajadores(filtrados);
    });
  }
});


async function abrirModalEditar(id_trabajador) {
  try {
    const response = await fetch(`http://localhost:3000/api/trabajadores/${id_trabajador}`);
    if (!response.ok) throw new Error("No se pudo cargar el trabajador");

    const trabajador = await response.json();

  // Llenar los campos del formulario
  // usar id_trabajador que devuelve la API
  document.getElementById("trabajadorId").value = trabajador.id_trabajador || trabajador.id;
    document.getElementById("cedula").value = trabajador.cedula;
    document.getElementById("nombre").value = trabajador.nombre;
    document.getElementById("apellido").value = trabajador.apellido;
    document.getElementById("celular").value = trabajador.telefono;
    document.getElementById("correo").value = trabajador.correo;
    document.getElementById("direccion").value = trabajador.direccion;
    document.getElementById("fechaNacimiento").value = trabajador.fecha_nacimiento.split("T")[0]; 

    // Vista previa foto
    const vistaPrevia = document.getElementById("vistaPrevia");
    vistaPrevia.innerHTML = trabajador.foto
      ? `<img src="/uploads/${trabajador.foto}" class="rounded-circle" style="width:100px; height:100px; object-fit:cover;">`
      : "";

    // 👇 Abrir modal de formulario
    const modal = new bootstrap.Modal(document.getElementById("modalAgregarTrabajador"));
    modal.show();

  } catch (error) {
    console.error("Error al cargar trabajador:", error);
    alert("Error al cargar el trabajador");
  }
}
