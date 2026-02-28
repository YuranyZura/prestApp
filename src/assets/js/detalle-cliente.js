// Variables globales
let clienteId = null;
let mapaInstance = null;

// Función para mostrar notificaciones toast
function mostrarNotificacion(mensaje, tipo = 'success') {
  const toastEl = document.getElementById('toastNotificacion');
  const toastHeader = document.getElementById('toastHeader');
  const toastIcon = document.getElementById('toastIcon');
  const toastTitle = document.getElementById('toastTitle');
  const toastBody = document.getElementById('toastBody');

  // Configurar colores e iconos según el tipo
  if (tipo === 'success') {
    toastHeader.className = 'toast-header bg-success text-white';
    toastIcon.className = 'ti ti-checks me-2';
    toastTitle.textContent = 'Éxito';
  } else if (tipo === 'danger') {
    toastHeader.className = 'toast-header bg-danger text-white';
    toastIcon.className = 'ti ti-alert-circle me-2';
    toastTitle.textContent = 'Error';
  } else if (tipo === 'warning') {
    toastHeader.className = 'toast-header bg-warning text-white';
    toastIcon.className = 'ti ti-alert-triangle me-2';
    toastTitle.textContent = 'Advertencia';
  } else {
    toastHeader.className = 'toast-header bg-info text-white';
    toastIcon.className = 'ti ti-info-circle me-2';
    toastTitle.textContent = 'Información';
  }

  toastBody.textContent = mensaje;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

// Al cargar la página, obtener ID del cliente desde URL
document.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.location.search);
  clienteId = params.get("id");
  
  if (clienteId) {
    cargarDetalleCliente();
    // También cargar el resumen de cuotas/agregados
    cargarResumenCuotas();
    // Cargar historial de cuotas
    cargarHistorialCuotas();
  } else {
    console.error("ID de cliente no especificado");
    mostrarError("No se especificó el cliente a consultar.");
  }

  // Establecer fecha actual por defecto
  const fechaPagoEl = document.getElementById("fechaPago");
  if (fechaPagoEl) {
    fechaPagoEl.valueAsDate = new Date();
  }
});



// Cargar detalle del cliente desde el backend
async function cargarDetalleCliente() {
  try {
    const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el cliente");
    }

    const data = await response.json();

    if (!data.success || !data.cliente) {
      throw new Error(data.message || "Cliente no encontrado");
    }

    const cliente = data.cliente;
    const nombreCompleto = (cliente.nombreCompleto || `${cliente.nombre || ""} ${cliente.apellido || ""}`).trim() || "Sin nombre";
    const fotoUrl = cliente.foto
      ? (cliente.foto.startsWith("http") ? cliente.foto : `/uploads/${cliente.foto}`)
      : "https://via.placeholder.com/150?text=Cliente";

    console.log("Cliente cargado:", cliente);

    // Datos principales
    document.getElementById("nombreCliente").textContent = nombreCompleto;
    document.getElementById("nombreClienteModal").textContent = nombreCompleto;
    document.getElementById("cedulaCliente").textContent = cliente.cedula || "No registra";
    document.getElementById("telefonoCliente").textContent = cliente.telefono || "No registra";
    document.getElementById("direccionCliente").textContent = cliente.direccion || "Sin dirección";
    document.getElementById("fotoCliente").src = fotoUrl;

    // Marcadores de estado
    document.getElementById("totalPrestado").textContent = Number(cliente.totalPrestado || 0).toFixed(2);
    document.getElementById("totalPendiente").textContent = Number(cliente.totalPendiente || 0).toFixed(2);
    document.getElementById("totalPrestamos").textContent = Number(cliente.totalPrestamos || 0);

    // Estado del sistema
    document.getElementById("fechaRegistro").textContent = formatearFecha(cliente.fecha_creacion);
    document.getElementById("ultimaActualizacion").textContent = formatearFecha(cliente.fecha_actualizacion);
    actualizarBadgeEstado(cliente.estado);

    // Cargar préstamos
    if (data.prestamos && data.prestamos.length > 0) {
      cargarPrestamos(data.prestamos);
    }

    // Mapa: si existen coordenadas, usarlas; si no, intentar geocodificar
    const lat = cliente.latitud || cliente.latitude;
    const lng = cliente.longitud || cliente.longitude;
    
    if (lat && lng) {
      console.log("Usando coordenadas guardadas:", lat, lng);
      inicializarMapa(parseFloat(lat), parseFloat(lng), cliente.direccion || "Ubicación del cliente");
    } else {
      console.log("Coordenadas nulas, intentando geocodificar:", cliente.direccion);
      if (cliente.direccion) {
        geocodificarDireccionYMostrarMapa(cliente.direccion);
      } else {
        document.getElementById("mapaCliente").innerHTML = `
          <div class="text-muted text-center py-4">
            <i class="ti ti-map-off"></i> Ubicación no registrada
          </div>
        `;
      }
    }

  } catch (error) {
    console.error("Error al cargar cliente:", error);
    mostrarError("No se pudo cargar la información del cliente.");
  }
}

// Cargar resumen de cuotas y agregados del cliente
async function cargarResumenCuotas() {
  try {
    const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}/cuotas`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el resumen de cuotas");
    }

    const data = await response.json();
    if (!data.success || !data.resumen) {
      throw new Error(data.message || "Resumen no disponible");
    }

    const r = data.resumen;

    // Actualizar tarjetas de resumen de cuotas
    const cuotasPagadasEl = document.getElementById("cuotasPagadas");
    const cuotasPendientesEl = document.getElementById("cuotasPendientes");
    const cuotasMoraEl = document.getElementById("cuotasMora");
    const porcentajePagoEl = document.getElementById("porcentajePago");
    const barraProgresoEl = document.getElementById("barraProgreso");

    if (cuotasPagadasEl) cuotasPagadasEl.textContent = parseInt(r.cuotasPagadas || 0);
    if (cuotasPendientesEl) cuotasPendientesEl.textContent = parseInt(r.cuotasPendientes || 0);
    if (cuotasMoraEl) cuotasMoraEl.textContent = parseInt(r.cuotasMora || 0);
    if (porcentajePagoEl) porcentajePagoEl.textContent = parseInt(r.porcentajePago || 0);
    if (barraProgresoEl) barraProgresoEl.style.width = `${parseInt(r.porcentajePago || 0)}%`;

    // Actualizar agregados superiores (Total Prestado / Pendiente)
    const totalPrestadoEl = document.getElementById("totalPrestado");
    const totalPendienteEl = document.getElementById("totalPendiente");
    if (totalPrestadoEl) totalPrestadoEl.textContent = Number(r.totalPrestado || 0).toFixed(2);
    if (totalPendienteEl) totalPendienteEl.textContent = Number(r.totalPendiente || 0).toFixed(2);

    // Si existe elemento para Total Pagado, podríamos mostrarlo en algún sitio futuro
    // const totalPagadoEl = document.getElementById("totalPagado");
    // if (totalPagadoEl) totalPagadoEl.textContent = Number(r.totalPagado || 0).toFixed(2);

  } catch (error) {
    console.error("Error al cargar resumen de cuotas:", error);
    // No interrumpir la página; mostrar una notificación ligera
    mostrarNotificacion("No se pudo cargar el resumen de cuotas.", "warning");
  }
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return "-";
  const fecha = new Date(fechaISO);
  return isNaN(fecha.getTime()) ? "-" : fecha.toLocaleDateString("es-ES");
}

async function geocodificarDireccionYMostrarMapa(direccion) {
  try {
    console.log("Geocodificando:", direccion);
    
    // Intentar varias variaciones de la dirección
    const variaciones = [
      direccion + ", Colombia",  // Agregar país
      direccion,                 // Dirección original
      extraerCiudad(direccion)   // Solo la ciudad
    ];
    
    for (let i = 0; i < variaciones.length; i++) {
      const direccionIntento = variaciones[i];
      if (!direccionIntento) continue;
      
      console.log(`Intento ${i + 1}: ${direccionIntento}`);
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(direccionIntento)}`;
      
      const resp = await fetch(url, { 
        headers: { 
          "Accept-Language": "es",
          "User-Agent": "PrestApp/1.0"
        } 
      });
      
      if (resp.ok) {
        const resultados = await resp.json();
        console.log(`Resultados intento ${i + 1}:`, resultados);
        
        if (Array.isArray(resultados) && resultados.length > 0) {
          const lat = parseFloat(resultados[0].lat);
          const lon = parseFloat(resultados[0].lon);
          console.log("✓ Geocodificación exitosa:", lat, lon);
          inicializarMapa(lat, lon, direccion);
          return; // Salir si encontramos
        }
      }
      
      // Esperar un poco entre intentos
      if (i < variaciones.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Si llegamos aquí, no se encontró nada
    console.log("No se encontraron coordenadas después de todos los intentos");
    document.getElementById("mapaCliente").innerHTML = `
      <div class="text-muted text-center py-4">
        <i class="ti ti-map-off"></i> No se pudo geolocalizar la dirección.
        <br><small>Intenta editar el cliente y agregar una dirección más específica.</small>
      </div>
    `;
    
  } catch (e) {
    console.error("Fallo geocodificación cliente-side:", e);
    document.getElementById("mapaCliente").innerHTML = `
      <div class="text-muted text-center py-4">
        <i class="ti ti-map-off"></i> Error al geolocalizar: ${e.message}
      </div>
    `;
  }
}

function extraerCiudad(direccion) {
  // Intentar extraer solo la ciudad de la dirección
  if (!direccion) return null;
  
  const partes = direccion.split(',');
  if (partes.length > 1) {
    // Última parte suele ser la ciudad
    const ciudad = partes[partes.length - 1].trim();
    return ciudad + ", Colombia";
  }
  
  // Buscar palabras clave de ciudades colombianas
  const ciudades = ['bogota', 'medellin', 'cali', 'barranquilla', 'cartagena', 'cucuta', 'bucaramanga'];
  const dirLower = direccion.toLowerCase();
  for (const ciudad of ciudades) {
    if (dirLower.includes(ciudad)) {
      return ciudad.charAt(0).toUpperCase() + ciudad.slice(1) + ", Colombia";
    }
  }
  
  return null;
}

function actualizarBadgeEstado(estado = "Activo") {
  const badge = document.getElementById("estadoCliente");
  if (badge) {
    badge.textContent = estado;
    badge.className = `badge ${estado.toLowerCase() === "activo" ? "bg-success" : "bg-secondary"}`;
  }
}

function cargarPrestamos(prestamos) {
  const tabla = document.getElementById("tablaPrestamos");
  
  if (!prestamos || prestamos.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">
          <p class="text-muted mb-0">
            <i class="ti ti-inbox"></i> No hay préstamos registrados
          </p>
        </td>
      </tr>
    `;
    return;
  }

  tabla.innerHTML = prestamos.map(prestamo => {
    const totalPagar = prestamo.totalPagar || (prestamo.monto * (1 + prestamo.interes / 100));
    const fechaVencimiento = prestamo.fecha_vencimiento || new Date(new Date(prestamo.fecha_inicio).getTime() + prestamo.plazo * 24 * 60 * 60 * 1000);
    
    // Determinar el badge de estado
    let estadoBadge = '';
    let estadoColor = '';
    
    if (prestamo.estado === 'pagado' || prestamo.estado_formateado === 'Pagado') {
      estadoBadge = 'Pagado';
      estadoColor = 'bg-success';
    } else if (prestamo.estado_formateado === 'Vencido') {
      estadoBadge = 'Vencido';
      estadoColor = 'bg-danger';
    } else if (prestamo.estado === 'en_proceso' || prestamo.estado_formateado === 'En Proceso') {
      estadoBadge = 'En Proceso';
      estadoColor = 'bg-warning';
    } else {
      estadoBadge = 'Activo';
      estadoColor = 'bg-info';
    }

    return `
      <tr>
        <td class="fw-semibold">$${parseFloat(prestamo.monto).toFixed(2)}</td>
        <td>${formatearFecha(prestamo.fecha_inicio)}</td>
        <td>${prestamo.plazo} días</td>
        <td class="fw-semibold">$${parseFloat(totalPagar).toFixed(2)}</td>
        <td>
          <span class="badge ${estadoColor}">${estadoBadge}</span>
        </td>
      </tr>
    `;
  }).join('');
}

function mostrarError(mensaje) {
  document.getElementById("nombreCliente").textContent = mensaje;
  document.getElementById("cedulaCliente").textContent = "-";
  document.getElementById("telefonoCliente").textContent = "-";
  document.getElementById("direccionCliente").textContent = "-";
}

function inicializarMapa(lat, lng, direccion) {
  console.log("Inicializando mapa en:", lat, lng);
  
  const mapaDiv = document.getElementById("mapaCliente");
  if (!mapaDiv) {
    console.error("No se encontró el div mapaCliente");
    return;
  }

  // Limpiar el contenido anterior
  mapaDiv.innerHTML = "";

  if (mapaInstance) {
    mapaInstance.remove();
  }

  try {
    mapaInstance = L.map("mapaCliente").setView([lat, lng], 15);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19
    }).addTo(mapaInstance);

    L.marker([lat, lng])
      .bindPopup(`<b>${direccion}</b><br>Ubicación del cliente`)
      .addTo(mapaInstance)
      .openPopup();

    console.log("Mapa inicializado correctamente");
  } catch (e) {
    console.error("Error al inicializar mapa Leaflet:", e);
    document.getElementById("mapaCliente").innerHTML = `
      <div class="text-muted text-center py-4">
        <i class="ti ti-map-off"></i> Error al cargar el mapa.
      </div>
    `;
  }
}

    // Funciones de acciones
    function abrirRegistroPago() {
      const modal = new bootstrap.Modal(document.getElementById("modalRegistroPago"));
      modal.show();
    }

    function guardarPago() {
      const monto = document.getElementById("montoPago").value;
      if (!monto || monto <= 0) {
        alert("Ingresa un monto válido");
        return;
      }
      alert("Pago registrado: $" + monto);
    }

    function abrirNuevoPrestamo() {
      alert("Abrir formulario de nuevo préstamo");
    }

    function abrirEditar() {
      // Cargar datos actuales del cliente en el modal
      const clienteData = {
        nombreCompleto: document.getElementById("nombreCliente").textContent,
        cedula: document.getElementById("cedulaCliente").textContent,
        telefono: document.getElementById("telefonoCliente").textContent,
        direccion: document.getElementById("direccionCliente").textContent,
        foto: document.getElementById("fotoCliente").src
      };

      document.getElementById("editNombre").value = clienteData.nombreCompleto;
      document.getElementById("editCedula").value = clienteData.cedula !== "No registra" ? clienteData.cedula : "";
      document.getElementById("editTelefono").value = clienteData.telefono !== "No registra" ? clienteData.telefono : "";
      document.getElementById("editDireccion").value = clienteData.direccion !== "Sin dirección" ? clienteData.direccion : "";
      
      // Mostrar la foto actual en el preview
      document.getElementById("editFotoPreview").src = clienteData.foto;

      // Extraer ciudad si está en la dirección
      const direccionParts = clienteData.direccion.split(",");
      if (direccionParts.length > 1) {
        const ciudad = direccionParts[direccionParts.length - 1].trim();
        document.getElementById("editCiudad").value = ciudad;
        document.getElementById("editDireccion").value = direccionParts.slice(0, -1).join(",").trim();
      }

      const modal = new bootstrap.Modal(document.getElementById("modalEditarCliente"));
      modal.show();
    }

    function previsualizarFoto(input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
          mostrarNotificacion("La imagen es demasiado grande. El tamaño máximo es 5MB.", "warning");
          input.value = "";
          return;
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
          mostrarNotificacion("Por favor selecciona un archivo de imagen válido.", "warning");
          input.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("editFotoPreview").src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }



    
    async function guardarEdicionCliente() {
      const nombreCompleto = document.getElementById("editNombre").value.trim();
      const cedula = document.getElementById("editCedula").value.trim();
      const telefono = document.getElementById("editTelefono").value.trim();
      const direccion = document.getElementById("editDireccion").value.trim();
      const ciudad = document.getElementById("editCiudad").value.trim();
      const fechaNacimiento = document.getElementById("editFechaNacimiento").value;
      const fotoInput = document.getElementById("editFoto");

      if (!nombreCompleto || !cedula || !telefono || !direccion) {
        mostrarNotificacion("Por favor completa todos los campos obligatorios (*)", "warning");
        return;
      }

      try {
        // Usar FormData para enviar archivos
        const formData = new FormData();
        formData.append("nombreCompleto", nombreCompleto);
        formData.append("cedula", cedula);
        formData.append("telefono", telefono);
        formData.append("direccion", direccion);
        if (ciudad) formData.append("ciudad", ciudad);
        if (fechaNacimiento) formData.append("fechaNacimiento", fechaNacimiento);
        
        // Agregar foto si se seleccionó una nueva
        if (fotoInput.files && fotoInput.files[0]) {
          formData.append("foto", fotoInput.files[0]);
        }

        const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}`, {
          method: "PUT",
          credentials: "include",
          body: formData 
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error al actualizar cliente");
        }

        // Cerrar modal
        const modalEl = document.getElementById("modalEditarCliente");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        // Mostrar mensaje de éxito con toast
        mostrarNotificacion("Cliente actualizado exitosamente", "success");

        // Recargar la página después de un breve delay para que se vea el toast
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } catch (error) {
        console.error("Error al actualizar cliente:", error);
        mostrarNotificacion("Error al actualizar cliente: " + error.message, "danger");
      }
    }



    async function abrirEliminar() {
      const nombreCliente = document.getElementById("nombreCliente").textContent;
      
      const confirmacion = confirm(
        `¿Estás seguro de que deseas eliminar al cliente "${nombreCliente}"?\n\n` +
        `Esta acción no se puede deshacer y eliminará:\n` +
        `- Todos los datos del cliente\n` +
        `- Historial de préstamos\n` +
        `- Pagos registrados\n\n` +
        `¿Deseas continuar?`
      );

      if (!confirmacion) return;

      try {
        const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}`, {
          method: "DELETE",
          credentials: "include"
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error al eliminar cliente");
        }

        mostrarNotificacion("Cliente eliminado exitosamente", "success");
        
        // Redirigir a la lista de clientes después de mostrar el toast
        setTimeout(() => {
          window.location.href = "./Rol2_trabajador.html";
        }, 1500);

      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        mostrarNotificacion("Error al eliminar cliente: " + error.message, "danger");
      }
    }

    
// HISTORIAL DE CUOTAS

// Cargar historial de cuotas del cliente
async function cargarHistorialCuotas() {
  try {
    const response = await fetch(`http://localhost:3000/api/pagos/cliente/${clienteId}`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el historial de cuotas");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al cargar historial");
    }

    const cuotas = data.cuotas || [];
    const tbody = document.getElementById("tablaCuotas");
    
    if (cuotas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4">
            <p class="text-muted mb-0">
              <i class="ti ti-inbox"></i> No hay cuotas registradas
            </p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = cuotas.map((cuota, index) => {
      const fecha = new Date(cuota.fecha_pago);
      const fechaFormateada = fecha.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      const estadoBadge = cuota.estado_prestamos === 'activo' 
        ? '<span class="badge bg-success">Activo</span>'
        : cuota.estado_prestamos === 'completado'
        ? '<span class="badge bg-primary">Completado</span>'
        : '<span class="badge bg-warning">Mora</span>';

      const metodoPago = cuota.metodo_pago || 'Efectivo';
      const metodoBadge = metodoPago === 'Efectivo' 
        ? '<span class="badge bg-info">Efectivo</span>'
        : metodoPago === 'Transferencia'
        ? '<span class="badge bg-primary">Transferencia</span>'
        : `<span class="badge bg-secondary">${metodoPago}</span>`;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${fechaFormateada}</td>
          <td class="fw-semibold">$${parseFloat(cuota.monto_pagos).toLocaleString('es-CO', {minimumFractionDigits: 2})}</td>
          <td>${metodoBadge}</td>
           <td>${estadoBadge}</td>
        </tr>
      `;
    }).join('');

  } catch (error) {
    console.error("Error al cargar historial de cuotas:", error);
    mostrarNotificacion("No se pudo cargar el historial de cuotas", "warning");
  }
}

// Enviar historial por correo
async function enviarHistorialCorreo() {
  try {
    mostrarNotificacion("Preparando correo con el historial...", "info");
    
    const response = await fetch(`http://localhost:3000/api/pagos/cliente/${clienteId}`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el historial");
    }

    const data = await response.json();
    const cuotas = data.cuotas || [];

    if (cuotas.length === 0) {
      mostrarNotificacion("No hay cuotas para enviar", "warning");
      return;
    }

    // Aquí se implementaría el envío por correo
    mostrarNotificacion("Funcionalidad de correo en desarrollo", "info");

  } catch (error) {
    console.error("Error al enviar por correo:", error);
    mostrarNotificacion("Error al preparar el correo", "danger");
  }
}

// Enviar historial por WhatsApp
async function enviarHistorialWhatsApp() {
  try {
    const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener la información del cliente");
    }

    const clienteData = await response.json();
    const cliente = clienteData.cliente;
    
    if (!cliente.telefono) {
      mostrarNotificacion("Este cliente no tiene número de teléfono registrado", "warning");
      return;
    }

    const responseCuotas = await fetch(`http://localhost:3000/api/pagos/cliente/${clienteId}`, {
      method: "GET",
      credentials: "include"
    });

    const dataCuotas = await responseCuotas.json();
    const cuotas = dataCuotas.cuotas || [];

    if (cuotas.length === 0) {
      mostrarNotificacion("No hay cuotas para enviar", "warning");
      return;
    }

    // Generar mensaje con el historial
    let mensaje = `*Historial de Cuotas*\n\n`;
    mensaje += `Cliente: ${cliente.nombreCompleto || cliente.nombre}\n`;
    mensaje += `Cédula: ${cliente.cedula}\n\n`;
    mensaje += `*Cuotas Pagadas:*\n`;
    
    let total = 0;
    cuotas.forEach((cuota, index) => {
      const fecha = new Date(cuota.fecha_pago).toLocaleDateString('es-CO');
      const monto = parseFloat(cuota.monto_pagos);
      total += monto;
      mensaje += `${index + 1}. ${fecha} - $${monto.toLocaleString('es-CO')}\n`;
    });

    mensaje += `\n*Total Pagado:* $${total.toLocaleString('es-CO')}`;

    const telefono = cliente.telefono.replace(/\D/g, '');
    const url = `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp
    window.open(url, '_blank');
    mostrarNotificacion("Abriendo WhatsApp...", "success");

  } catch (error) {
    console.error("Error al enviar por WhatsApp:", error);
    mostrarNotificacion("Error al preparar el mensaje de WhatsApp", "danger");
  }
}