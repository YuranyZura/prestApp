/**
 * Módulo para mostrar el resumen de cuotas pagadas hoy
 * Solicita datos al backend y los muestra en tablas y estadísticas
 */

document.addEventListener('DOMContentLoaded', function () {
  // Establecer la fecha de hoy en el input del filtro
  const filtroFecha = document.getElementById('filtroFecha');
  if (filtroFecha) {
    filtroFecha.value = new Date().toISOString().split('T')[0];
  }

  cargarResumenCuotasHoy();
  actualizarResumenPeriodicamente();
});

/**
 * Obtiene el resumen de cuotas pagadas hoy desde el backend
 */
async function cargarResumenCuotasHoy() {
  try {
    const response = await fetch('http://localhost:3000/api/pagos/resumen-hoy', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      console.error('Error al cargar resumen:', response.status);
      mostrarErrorResumen();
      return;
    }

    const data = await response.json();
    actualizarVistaResumen(data);
  } catch (error) {
    console.error('Error:', error);
    mostrarErrorResumen();
  }
}

/**
 * Carga el resumen para una fecha específica
 */
async function cargarResumenPorFecha() {
  const filtroFecha = document.getElementById('filtroFecha');
  if (!filtroFecha || !filtroFecha.value) {
    alert('Por favor selecciona una fecha');
    return;
  }

  const fecha = filtroFecha.value;
  
  try {
    const response = await fetch(`http://localhost:3000/api/pagos/resumen-dia?fecha=${fecha}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      console.error('Error al cargar resumen:', response.status);
      mostrarErrorResumen();
      return;
    }

    const data = await response.json();
    actualizarVistaResumen(data);
  } catch (error) {
    console.error('Error:', error);
    mostrarErrorResumen();
  }
}

/**
 * Actualiza la vista con los datos del resumen
 */
function actualizarVistaResumen(data) {
  // Actualizar estadísticas
  actualizarEstadisticas(data);
  
  // Actualizar tabla de cuotas
  actualizarTablaCuotas(data.cuotas || []);
  
  // Actualizar tabla de clientes
  actualizarTablaClientes(data.clientes || []);
}

/**
 * Actualiza las tarjetas de estadísticas
 */
function actualizarEstadisticas(data) {
  const estadisticas = {
    totalRecaudado: data.totalRecaudado || 0,
    totalCuotas: data.totalCuotas || 0,
    clientesAtendidos: data.clientesAtendidos || 0,
    promedioXCliente: data.promedioXCliente || 0
  };

  // Total Cobrado (usando IDs de Rol2_trabajador.html)
  const elemTotalCobrado = document.getElementById('totalCobrado');
  if (elemTotalCobrado) {
    elemTotalCobrado.textContent = `$${formatearNumero(estadisticas.totalRecaudado)}`;
  }

  // Total Pendiente (mostrar lo que falta por cobrar)
  const elemTotalPendiente = document.getElementById('totalPendiente');
  if (elemTotalPendiente) {
    elemTotalPendiente.textContent = `$${formatearNumero(0)}`; // Se calcularía del negocio real
  }

  // Clientes Visitados
  const elemClientes = document.getElementById('clientesVisitados');
  if (elemClientes) {
    elemClientes.textContent = estadisticas.clientesAtendidos;
  }
}

/**
 * Actualiza la tabla de cuotas pagadas hoy
 */
function actualizarTablaCuotas(cuotas) {
  const contenedor = document.getElementById('desgloseCobrosList');
  if (!contenedor) return;

  if (!cuotas || cuotas.length === 0) {
    contenedor.innerHTML = `
      <div class="text-center py-4">
        <i class="ti ti-receipt" style="font-size: 2rem; color: #B3B3B3;"></i>
        <p class="text-muted mt-2">No hay cobros registrados hoy</p>
      </div>
    `;
    return;
  }

  let html = '<div class="list-group">';
  
  cuotas.forEach((cuota, index) => {
    html += `
      <div class="list-group-item">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1 fw-semibold">
              <span class="badge bg-primary me-2">#${index + 1}</span>
              ${cuota.nombreCliente}
            </h6>
            <p class="mb-1 text-muted small">
              <i class="ti ti-id"></i> ${cuota.cedula}
            </p>
            <p class="mb-0 text-muted small">
              <i class="ti ti-clock"></i> ${cuota.hora} | 
              <i class="ti ti-coin"></i> ${cuota.metodo}
            </p>
          </div>
          <div class="text-end">
            <span class="badge bg-success fs-6">$${formatearNumero(cuota.monto)}</span>
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>';
  contenedor.innerHTML = html;
}

/**
 * Actualiza la tabla de clientes atendidos hoy
 */
function actualizarTablaClientes(clientes) {
  // Nota: En Rol2_trabajador.html no hay una tabla separada de clientes
  // pero esta función queda disponible para futura expansión
  console.log('Clientes atendidos:', clientes);
}

/**
 * Formatea números con separador de miles
 */
function formatearNumero(numero) {
  if (!numero) return '0.00';
  return parseFloat(numero).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Muestra mensaje de error en la vista
 */
function mostrarErrorResumen() {
  const tbody = document.getElementById('tablaCuotasHoy');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-danger">
          <i class="ti ti-alert-circle" style="font-size: 2rem; display: block; margin-bottom: 10px;"></i>
          Error al cargar el resumen. Intenta de nuevo más tarde.
        </td>
      </tr>
    `;
  }
}

/**
 * Actualiza el resumen cada 30 segundos
 */
function actualizarResumenPeriodicamente() {
  setInterval(() => {
    cargarResumenCuotasHoy();
  }, 30000); // Cada 30 segundos
}



/**
 * Abre el resumen en una nueva ventana para imprimir
 */
function imprimirResumen() {
  const printWindow = window.open('', '', 'height=600,width=800');
  const fecha = new Date().toLocaleDateString('es-CO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const contenido = document.querySelector('#desgloseCobrosList');
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resumen de Cobros - ${fecha}</title>
      <link rel="stylesheet" href="../assets/css/styles.min.css" />
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { color: #5D87FF; text-align: center; margin-bottom: 5px; }
        .fecha { text-align: center; color: #666; margin-bottom: 20px; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 28px; font-weight: bold; color: #5D87FF; }
        .list-group-item { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
        .fw-semibold { font-weight: 600; }
      </style>
    </head>
    <body>
      <h2>RESUMEN DE COBROS DEL DÍA</h2>
      <p class="fecha">Fecha: ${fecha}</p>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-label">Total Cobrado:</div>
          <div class="stat-value">${document.getElementById('totalCobrado')?.textContent || '$0.00'}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Clientes Visitados:</div>
          <div class="stat-value">${document.getElementById('clientesVisitados')?.textContent || '0'}</div>
        </div>
      </div>

      <h3 style="margin-top: 30px; color: #333;">Desglose de Cobros</h3>
      ${contenido ? contenido.innerHTML : '<p>Sin datos</p>'}
      
      <script>
        window.print();
        setTimeout(() => window.close(), 500);
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
