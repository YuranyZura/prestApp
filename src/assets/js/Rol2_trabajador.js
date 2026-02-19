        // Variables globales (aquí conectarías con tu backend)
        let clienteSeleccionado = null;
        let clientesData = [];
        let prestamosData = [];
        let pagosHoyData = [];

        // Al cargar la página, obtener perfil del trabajador
        document.addEventListener("DOMContentLoaded", async () => {
            console.log("Rol2_trabajador.js iniciado");
            await cargarPerfil();
            cargarRutaDia(); 
        });

        // Cargar perfil del trabajador logueado
        async function cargarPerfil() {
            try {
                const response = await fetch("http://localhost:3000/api/cobrador/perfil", {
                    method: "GET",
                    credentials: "include"
                });

                const data = await response.json();

                if (data.success && data.trabajador) {
                    const trabajador = data.trabajador;

                    // Actualizar avatar con iniciales
                    const avatarEl = document.getElementById("userAvatar");
                    if (avatarEl) {
                        avatarEl.textContent = trabajador.iniciales;
                    }

                    // Actualizar nombre completo
                    const nameEl = document.getElementById("userName");
                    if (nameEl) {
                        nameEl.textContent = trabajador.nombreCompleto;
                    }

                    // Si tiene foto, reemplazar el avatar con la imagen
                    if (trabajador.foto) {
                        if (avatarEl) {
                            avatarEl.style.backgroundImage = `url('${trabajador.foto}')`;
                            avatarEl.style.backgroundSize = "cover";
                            avatarEl.style.backgroundPosition = "center";
                            avatarEl.textContent = ""; // Quitar iniciales
                        }
                    }

                    console.log("Perfil cargado:", trabajador);
                } else {
                    console.error("No se pudo cargar el perfil:", data.message);
                    if (response.status === 401) {
                        window.location.href = "/login";
                    }
                }

            } catch (error) {
                console.error("Error al cargar perfil:", error);
            }
        }

        // Cerrar sesión
        async function cerrarSesion() {
            try {
                const response = await fetch("http://localhost:3000/api/auth/logout", {
                    method: "POST",
                    credentials: "include"
                });

                if (response.ok) {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                window.location.href = "/login";
            }
        }



        // ====Función para cambiar entre secciones=======
        function cambiarSeccion(seccion, btnEl) {
            document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
            document.getElementById('section-' + seccion)?.classList.add('active');

            // Toggle active on bottom nav buttons
            document.querySelectorAll('.app-nav-item').forEach(n => n.classList.remove('active'));
            if (btnEl) {
                btnEl.classList.add('active');
            }

            if (seccion === 'ruta') cargarRutaDia();
            if (seccion === 'prestamos') cargarPrestamosActivos();
            if (seccion === 'resumen') cargarResumenDia();
            if (seccion === 'clientes') cargarTodosClientes();
        }

        async function cargarRutaDia() {
            try {
                const response = await fetch('http://localhost:3000/api/cobrador/ruta', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Error al cargar ruta');
                }

                const todosClientes = data.clientes || [];
                
                // Filtrar solo clientes con pendiente > 0
                const clientes = todosClientes.filter(c => c.pendientePagar > 0);

                // Calcular estadísticas
                const pagados = todosClientes.filter(c => c.pendientePagar <= 0).length;
                const pendientes = todosClientes.filter(c => c.pendientePagar > 0).length;
                const mora = 0; // Implementar lógica de mora si es necesario

                document.getElementById('statPagados').textContent = pagados;
                document.getElementById('statPendientes').textContent = pendientes;
                document.getElementById('statMora').textContent = mora;

                const container = document.getElementById('rutaClientesList');

                if (clientes.length === 0) {
                    container.innerHTML = `
                        <div class="text-center py-4">
                            <i class="ti ti-calendar-check" style="font-size: 2rem; color: #B3B3B3;"></i>
                            <p class="text-muted mt-2">No hay cobros pendientes para hoy</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = clientes.map(cliente => `
                    <div class="client-item ${cliente.pendientePagar > 0 ? 'pendiente' : 'pagado'}" id="cliente-${cliente.id_clientes}">
                        <div class="client-item-header">
                            <div class="client-item-name">${cliente.nombreCliente}</div>
                            <img src="${cliente.foto ? '../uploads/' + cliente.foto : '../assets/images/profile/user-1.jpg'}" 
                                 alt="${cliente.nombreCliente}" 
                                 class="client-avatar">
                        </div>
                        <div class="client-item-info">
                            <div><strong>Teléfono:</strong> ${cliente.telefono || 'N/A'}</div>
                            <div><strong>Dirección:</strong> ${cliente.direccion || 'N/A'}</div>
                            <div><strong>Cuota Diaria:</strong> $${parseFloat(cliente.cuotaDiaria).toFixed(2)}</div>
                            <div><strong>Pendiente:</strong> <span style="color: ${cliente.pendientePagar > 0 ? '#d32f2f' : '#2e7d32'}; font-weight: bold;">$${parseFloat(cliente.pendientePagar).toFixed(2)}</span></div>
                        </div>
                        <button class="btn btn-sm btn-primary mt-2" onclick="abrirRegistroPagoCliente(${cliente.id_clientes}, '${cliente.nombreCliente}', ${cliente.pendientePagar})">
                            <i class="ti ti-coin"></i> Registrar Pago
                        </button>
                    </div>
                `).join('');

            } catch (error) {
                console.error('Error al cargar ruta:', error);
                const container = document.getElementById('rutaClientesList');
                container.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="ti ti-alert-triangle"></i> Error al cargar la ruta: ${error.message}
                    </div>
                `;
            }
        }



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



        // Variable para almacenar el cliente actual del pago y cuota diaria
        let clientePagoActual = null;
        let cuotaDiariaActual = 0;

        // Abrir modal de registro de pago
        function abrirRegistroPagoCliente(clienteId, nombreCliente, pendiente) {
            // Guardar referencia del cliente
            clientePagoActual = clienteId;

            // Rellenar información del cliente en el modal
            document.getElementById('pagoNombreCliente').textContent = nombreCliente;
            
            // Buscar el cliente en el DOM para obtener la cuota diaria
            const clienteCard = document.getElementById(`cliente-${clienteId}`);
            let cuotaDiaria = pendiente;
            
            if (clienteCard) {
                const cuotaText = clienteCard.querySelector('.client-item-info div:nth-child(4)')?.textContent || '';
                const cuotaMatch = cuotaText.match(/\$([\d,.]+)/);
                if (cuotaMatch) {
                    cuotaDiaria = parseFloat(cuotaMatch[1].replace(',', ''));
                }
            }

            cuotaDiariaActual = cuotaDiaria;

            document.getElementById('pagoCuotaDiaria').textContent = `$${cuotaDiaria.toFixed(2)}`;
            document.getElementById('pagoPendiente').textContent = `$${parseFloat(pendiente).toFixed(2)}`;
            document.getElementById('pagoMontoMaximo').textContent = `$${parseFloat(pendiente).toFixed(2)}`;
            
            // Pre-llenar el monto con el valor pendiente para pago completo
            document.getElementById('pagoMonto').value = parseFloat(pendiente).toFixed(2);
            document.getElementById('pagoMonto').max = parseFloat(pendiente).toFixed(2);

            // Resetear el tipo de pago a "completo"
            document.getElementById('tipoPagoCompleto').checked = true;
            
            // Limpiar otros campos
            document.getElementById('pagoMetodo').value = '';
            document.getElementById('pagoNota').value = '';

            // Configurar eventos para cambio de tipo de pago
            configurarCambioTipoPago();

            // Mostrar campos de pago inicialmente
            document.getElementById('camposPago').style.display = 'block';
            document.getElementById('labelNota').textContent = 'Nota (Opcional)';

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('modalRegistroPago'));
            modal.show();
        }

        // Configurar eventos de cambio de tipo de pago
        function configurarCambioTipoPago() {
            const tipoPagoRadios = document.querySelectorAll('input[name="tipoPago"]');
            
            tipoPagoRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const camposPago = document.getElementById('camposPago');
                    const pagoMonto = document.getElementById('pagoMonto');
                    const labelNota = document.getElementById('labelNota');
                    const pagoNota = document.getElementById('pagoNota');
                    const pendiente = parseFloat(document.getElementById('pagoPendiente').textContent.replace('$', ''));

                    if (this.value === 'completo') {
                        // Pago Completo
                        camposPago.style.display = 'block';
                        pagoMonto.value = pendiente.toFixed(2);
                        pagoMonto.readOnly = true;
                        labelNota.textContent = 'Nota (Opcional)';
                        pagoNota.placeholder = 'Comentarios adicionales...';
                        
                    } else if (this.value === 'parcial') {
                        // Abono Parcial
                        camposPago.style.display = 'block';
                        pagoMonto.value = '';
                        pagoMonto.readOnly = false;
                        labelNota.textContent = 'Nota (Opcional)';
                        pagoNota.placeholder = 'Ej: Cliente pagó $50, promete el resto mañana...';
                        
                    } else if (this.value === 'nopago') {
                        // No Pagó / Aplazado
                        camposPago.style.display = 'none';
                        labelNota.innerHTML = 'Motivo <span class="text-danger">(Requerido)</span>';
                        pagoNota.placeholder = 'Ej: Cliente enfermo, promete pagar mañana...';
                    }
                });
            });
        }

        //  botón de guardar pago
        document.getElementById('btnGuardarPago')?.addEventListener('click', async function() {
            const tipoPago = document.querySelector('input[name="tipoPago"]:checked')?.value;
            const nota = document.getElementById('pagoNota').value.trim();
            const pendiente = parseFloat(document.getElementById('pagoPendiente').textContent.replace('$', ''));

            if (!tipoPago) {
                mostrarNotificacion('Por favor seleccione un tipo de pago', 'warning');
                return;
            }

            if (!clientePagoActual) {
                mostrarNotificacion('Error: No se identificó el cliente', 'danger');
                return;
            }

            let monto = 0;
            let metodo = '';

            if (tipoPago === 'completo') {
                monto = pendiente;
                metodo = document.getElementById('pagoMetodo').value;
                
                if (!metodo) {
                    mostrarNotificacion('Por favor seleccione un método de pago', 'warning');
                    return;
                }

            } else if (tipoPago === 'parcial') {
                monto = parseFloat(document.getElementById('pagoMonto').value);
                metodo = document.getElementById('pagoMetodo').value;

                if (!monto || monto <= 0) {
                    mostrarNotificacion('Por favor ingrese un monto válido', 'warning');
                    return;
                }

                if (monto > pendiente) {
                    mostrarNotificacion('El monto no puede ser mayor al pendiente', 'warning');
                    return;
                }

                if (!metodo) {
                    mostrarNotificacion('Por favor seleccione un método de pago', 'warning');
                    return;
                }

            } else if (tipoPago === 'nopago') {
                monto = 0;
                metodo = 'ninguno';

                if (!nota) {
                    mostrarNotificacion('Por favor ingrese el motivo del aplazamiento', 'warning');
                    return;
                }
            }

            // Deshabilitar boton mientras se procesa
            const btnGuardar = document.getElementById('btnGuardarPago');
            btnGuardar.disabled = true;
            btnGuardar.innerHTML = '<i class="ti ti-loader"></i> Guardando...';

            try {
                const response = await fetch('http://localhost:3000/api/cobrador/pagos', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        clienteId: clientePagoActual,
                        monto: monto,
                        metodoPago: metodo,
                        tipoPago: tipoPago,
                        nota: nota || null
                    })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Error al registrar el pago');
                }

                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistroPago'));
                modal.hide();

                // Mostrar notificación según el tipo
                let mensaje = '';
                if (tipoPago === 'completo') {
                    mensaje = 'Pago completo registrado exitosamente';
                } else if (tipoPago === 'parcial') {
                    mensaje = `Abono de $${monto.toFixed(2)} registrado exitosamente`;
                } else {
                    mensaje = 'Aplazamiento registrado exitosamente';
                }
                
                mostrarNotificacion(mensaje, 'success');

                // Recargar la ruta para actualizar los datos
                await cargarRutaDia();

                // Limpiar referencia del cliente
                clientePagoActual = null;

            } catch (error) {
                console.error('Error al registrar pago:', error);
                mostrarNotificacion('Error al registrar el pago: ' + error.message, 'danger');
            } finally {
                // Rehabilitar botón
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = '<i class="ti ti-device-floppy"></i> Guardar';
            }
        });





        // ====crear un prestamo====
        async function cargarPrestamosActivos() {
            try {
                // Obtener clientes del backend
                const response = await fetch('http://localhost:3000/api/clientes', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok && data.success && data.clientes) {
                    const clienteSelect = document.getElementById('clienteSelect');
                    const options = clienteSelect.options;
                    for (let i = options.length - 1; i > 0; i--) {
                        options[i].remove();
                    }

                    // Agregar opciones de clientes
                    data.clientes.forEach(cliente => {
                        const option = document.createElement('option');
                        option.value = cliente.id_clientes;
                        option.textContent = cliente.nombreCompleto || `${cliente.nombre} ${cliente.apellido}`;
                        clienteSelect.appendChild(option);
                    });
                } else {
                    console.error("Error al cargar clientes:", data.message);
                }
            } catch (error) {
                console.error("Error al cargar préstamos:", error);
                mostrarNotificacion("Error al cargar clientes", "danger");
            }
        }

        // Simulación de préstamo en tiempo real
        document.getElementById('montoPrestamo')?.addEventListener('input', calcularSimulacion);
        document.getElementById('diasPlazo')?.addEventListener('input', calcularSimulacion);
        document.getElementById('fechaInicio')?.addEventListener('change', calcularSimulacion);
        document.getElementById('frecuenciaPago')?.addEventListener('change', calcularSimulacion);

        function calcularSimulacion() {
            const monto = parseFloat(document.getElementById('montoPrestamo').value) || 0;
            const dias = parseInt(document.getElementById('diasPlazo').value) || 0;
            const frecuencia = document.getElementById('frecuenciaPago').value;
            const fechaInicio = document.getElementById('fechaInicio').value;

            if (monto > 0 && dias > 0 && frecuencia && fechaInicio) {
                const tasaInteres = 10; 
                const interes = monto * (tasaInteres / 100);
                const totalPagar = monto + interes;
                
                let numCuotas;
                switch(frecuencia) {
                    case 'diario': numCuotas = dias; break;
                    case 'semanal': numCuotas = Math.ceil(dias / 7); break;
                    case 'quincenal': numCuotas = Math.ceil(dias / 15); break;
                    case 'mensual': numCuotas = Math.ceil(dias / 30); break;
                    default: numCuotas = dias;
                }
                
                // Evitar división por cero si numCuotas es 0 o inválido
                const cuota = numCuotas > 0 ? totalPagar / numCuotas : 0;
                
                const fecha = new Date(fechaInicio);
                fecha.setDate(fecha.getDate() + dias);
                const fechaFinal = fecha.toLocaleDateString('es-ES');
                
                document.getElementById('simMontoPrestado').textContent = `$${monto.toFixed(2)}`;
                document.getElementById('simTasaInteres').textContent = tasaInteres;
                document.getElementById('simInteres').textContent = `$${interes.toFixed(2)}`;
                document.getElementById('simTotalPagar').textContent = `$${totalPagar.toFixed(2)}`;
                document.getElementById('simCuota').textContent = `$${cuota.toFixed(2)}`;
                document.getElementById('simNumCuotas').textContent = numCuotas;
                document.getElementById('simFechaFinal').textContent = fechaFinal;
                document.getElementById('simulacionBox').style.display = 'block';
            } else {
                document.getElementById('simulacionBox').style.display = 'none';
            }
        }


        function limpiarFormularioPrestamo() {
            document.getElementById('prestamoForm').reset();
            document.getElementById('simulacionBox').style.display = 'none';
        }

        document.getElementById('prestamoForm')?.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const clienteId = document.getElementById('clienteSelect').value;
            const monto = parseFloat(document.getElementById('montoPrestamo').value);
            const plazo = parseInt(document.getElementById('diasPlazo').value);
            const fechaInicio = document.getElementById('fechaInicio').value;
            const frecuencia = document.getElementById('frecuenciaPago').value;
            
            // Validar que todos los campos estén completos
            if (!clienteId || !monto || !plazo || !fechaInicio || !frecuencia) {
                mostrarNotificacion('Por favor completa todos los campos', 'warning');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/cobrador/prestamos', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        clienteId: parseInt(clienteId),
                        monto,
                        plazo,
                        fechaInicio,
                        frecuencia,
                        interes: 10 
                    })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Error al crear el préstamo');
                }

                mostrarNotificacion('Préstamo registrado exitosamente', 'success');
                this.reset();
                document.getElementById('simulacionBox').style.display = 'none';
                cargarPrestamosActivos();

            } catch (error) {
                console.error('Error al crear préstamo:', error);
                mostrarNotificacion('Error al registrar el préstamo: ' + error.message, 'danger');
            }
        });



        function cargarResumenDia() {
            const hoy = new Date();
            document.getElementById('fechaHoy').textContent = hoy.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            // Simular datos del resumen del día
            document.getElementById('totalCobrado').textContent = '$150.50';
            document.getElementById('totalPendiente').textContent = '$85.00';
            document.getElementById('clientesVisitados').textContent = '8';
        }

        async function cargarTodosClientes() {
            try {
                const response = await fetch("http://localhost:3000/api/clientes", {
                    method: "GET",
                    credentials: "include"
                });

                const data = await response.json();

                if (data.success && data.clientes) {
                    const todosClientes = data.clientes;
                    
                    document.getElementById('totalClientesBadge').textContent = todosClientes.length;
                    const container = document.getElementById('todosClientesList');
                    
                    if (todosClientes.length === 0) {
                        container.innerHTML = '<div class="empty-state"><i class="ti ti-users"></i><p>No hay clientes registrados</p></div>';
                        return;
                    }

                    container.innerHTML = todosClientes.map(cliente => `
                        <div class="cliente-card">
                            <button class="btn btn-sm btn-primary me-2" onclick="verCliente(${cliente.id_clientes})" title="Ver detalle">
                                <i class="ti ti-eye"></i>
                            </button>
                            <div class="cliente-card-info">
                                <div class="cliente-card-name">${cliente.nombreCompleto}</div>
                                <div class="cliente-card-details">Cédula: ${cliente.cedula} | Tel: ${cliente.telefono}</div>
                            </div>
                        </div>
                    `).join('');
                } else {
                    console.error("Error al cargar clientes:", data.message);
                    mostrarNotificacion("Error al cargar clientes", "danger");
                }

            } catch (error) {
                console.error("Error al cargar clientes:", error);
                mostrarNotificacion("Error de conexión al cargar clientes", "danger");
            }
        }

        let clienteAEliminar = null;

        function verCliente(idCliente) {
            if (!idCliente) return;
            window.location.href = `/detalle-cliente.html?id=${idCliente}`;
        }

        async function eliminarCliente(idCliente) {
            clienteAEliminar = idCliente;
            const modal = new bootstrap.Modal(document.getElementById('modalConfirmarEliminar'));
            modal.show();
        }

        // Confirmar eliminación desde el modal
        document.getElementById('btnConfirmarEliminar')?.addEventListener('click', async function() {
            if (!clienteAEliminar) return;

            const modal = bootstrap.Modal.getInstance(document.getElementById('modalConfirmarEliminar'));
            modal.hide();

            try {
                const response = await fetch(`http://localhost:3000/api/clientes/${clienteAEliminar}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                const data = await response.json();

                if (data.success) {
                    mostrarNotificacion("Cliente eliminado exitosamente", "success");
                    cargarTodosClientes();
                } else {
                    mostrarNotificacion(data.message || "Error al eliminar cliente", "danger");
                }

            } catch (error) {
                console.error("Error al eliminar cliente:", error);
                mostrarNotificacion("Error de conexión", "danger");
            } finally {
                clienteAEliminar = null;
            }
        });


        // FUNCION AGREGAR CLIENTES
        document.getElementById('clienteForm')?.addEventListener('submit', async function(e) {
            e.preventDefault();

            const btnGuardar = document.getElementById('btnGuardarCliente');
            btnGuardar.disabled = true;
            btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

            const formData = {
                nombreCompleto: this.nombre.value.trim(),
                cedula: this.cedula.value.trim(),
                telefono: this.telefono.value.trim(),
                direccion: this.direccion.value.trim(),
                ciudad: this.ciudad.value.trim()
            };

            try {
                const response = await fetch("http://localhost:3000/api/clientes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    mostrarNotificacion("Cliente registrado exitosamente", "success");
                    this.reset();
                    cargarTodosClientes();
                } else {
                    mostrarNotificacion(data.message || "Error al registrar cliente", "danger");
                }

            } catch (error) {
                console.error("Error al registrar cliente:", error);
                mostrarNotificacion("Error de conexión con el servidor", "danger");
            } finally {
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = '<i class="ti ti-device-floppy"></i> Guardar';
            }
        });


        
        function filtrarClientes(filtro, btnEl) {
            document.querySelectorAll('#section-clientes .btn-group button').forEach(btn => {
                btn.classList.remove('active');
            });
            if (btnEl) btnEl.classList.add('active');
            console.log("Filtro aplicado:", filtro);
        }

        function cerrarSesion() {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                window.location.href = 'login.html'; 
            }
        }

        function generarReporte() {
            imprimirResumen();
        }

        // Inicialización al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            cambiarSeccion('ruta');
            
            const hoy = new Date().toISOString().split('T')[0];
            if (document.getElementById('fechaInicio')) {
                document.getElementById('fechaInicio').value = hoy;
                calcularSimulacion(); 
            }

            const nombreUsuario = document.getElementById('userName').textContent;
            const iniciales = nombreUsuario.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
            document.getElementById('userAvatar').textContent = iniciales;
        });
