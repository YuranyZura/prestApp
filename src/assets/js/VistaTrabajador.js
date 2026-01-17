 // Navigation
        function showSection(sectionName) {
            document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.app-nav-item').forEach(i => i.classList.remove('active'));
            
            document.getElementById(`section-${sectionName}`).classList.add('active');
            // Find the button that triggered the event and add the active class to it
            const activeNavItem = document.querySelector(`.app-nav-item[onclick*="${sectionName}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }

            const subtitles = {
                clientes: 'Gestión de Clientes',
                prestamos: 'Registro de Préstamos',
                pagos: 'Pagos y Cobros',
                ruta: 'Ruta de Cobro',
                resumen: 'Resumen del Día'
            };
            document.getElementById('headerSubtitle').textContent = subtitles[sectionName] || 'Dashboard';
        }

        function cerrarSesion() {
            // Implement actual logout logic here (e.g., clear local storage, redirect)
            alert('Cerrando sesión...');
            // For demonstration purposes, let's simulate a redirect to a login page
            // window.location.href = 'login.html';
        }

        // Clientes Form Handler
        document.getElementById('clienteForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const clientData = Object.fromEntries(formData);
            clientData.id = Date.now(); // Simple unique ID
            clientData.fechaRegistro = new Date().toISOString().split('T')[0]; // Store date in YYYY-MM-DD format
            
            let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            clientes.push(clientData);
            localStorage.setItem('clientes', JSON.stringify(clientes));
            
            this.reset();
            actualizarListaClientes();
            // Optionally, refresh client select options in other forms
            actualizarSelectClientesEnPrestamos();
            actualizarSelectClientesEnPagos();
        });

        function actualizarListaClientes() {
            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            const container = document.getElementById('clientesList');
            
            if (clientes.length === 0) {
                container.innerHTML = '<div class="text-center py-4 text-muted"><i class="fas fa-inbox fa-2x mb-2" style="opacity: 0.3;"></i><p>No hay clientes registrados</p></div>';
                return;
            }

            let html = '<div class="list-group">';
            // Sort clients by name
            clientes.sort((a, b) => a.nombreCliente.localeCompare(b.nombreCliente));
            clientes.forEach(c => {
                html += `
                    <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${c.nombreCliente}</h6>
                            <small class="text-muted">${c.telefonoCliente} • ${c.ciudadCliente}</small>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="verDetalleCliente(${c.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarCliente(${c.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.innerHTML = html;
        }

        function eliminarCliente(id) {
            if (confirm('¿Estás seguro de que deseas eliminar a este cliente? Esto también eliminará sus préstamos asociados.')) {
                let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
                clientes = clientes.filter(c => c.id !== id);
                localStorage.setItem('clientes', JSON.stringify(clientes));

                // Also remove any associated loans, payments, etc. (for a real app, this would be more complex)
                let prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
                prestamos = prestamos.filter(p => p.clienteId !== id);
                localStorage.setItem('prestamos', JSON.stringify(prestamos));
                
                actualizarListaClientes();
                actualizarSelectClientesEnPrestamos();
                actualizarSelectClientesEnPagos();
                actualizarRutaContainer(); // Refresh route if client was part of it
                generarResumen(); // Refresh summary
            }
        }

        function verDetalleCliente(id) {
            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            const cliente = clientes.find(c => c.id === id);
            if (cliente) {
                // For simplicity, display in an alert. In a real app, this would be a modal or a dedicated detail view.
                let details = `Nombre: ${cliente.nombreCliente}\n`;
                details += `Cédula: ${cliente.cedulaCliente}\n`;
                details += `Teléfono: ${cliente.telefonoCliente}\n`;
                if (cliente.emailCliente) details += `Email: ${cliente.emailCliente}\n`;
                details += `Dirección: ${cliente.direccion}, ${cliente.ciudadCliente}\n`;
                if (cliente.puntoReferencia) details += `Referencia: ${cliente.puntoReferencia}\n`;
                details += `Registrado: ${cliente.fechaRegistro}`;
                alert(details);
            }
        }

        // --- Prestamos Form Handler & Logic ---
        document.getElementById('prestamoForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const prestamoData = Object.fromEntries(formData);
            prestamoData.id = Date.now();
            prestamoData.fechaCreacion = new Date().toISOString().split('T')[0];
            prestamoData.estado = 'activo'; // Default status

            let prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
            prestamos.push(prestamoData);
            localStorage.setItem('prestamos', JSON.stringify(prestamos));
            
            this.reset();
            alert('Préstamo creado exitosamente.');
            // Update summary and route if applicable
            generarResumen();
            actualizarRutaContainer();
        });

        // --- Payment Form Handlers ---
        document.getElementById('pagosForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const pagoData = Object.fromEntries(formData);
            pagoData.id = Date.now();
            pagoData.fechaRegistro = new Date().toISOString().split('T')[0];
            pagoData.tipo = 'regular';

            let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
            pagos.push(pagoData);
            localStorage.setItem('pagos', JSON.stringify(pagos));
            
            this.reset();
            alert('Pago regular registrado.');
            generarResumen();
            actualizarRutaContainer();
        });

        document.getElementById('pagoAdelantadoForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const pagoData = Object.fromEntries(formData);
            pagoData.id = Date.now();
            pagoData.fechaRegistro = new Date().toISOString().split('T')[0];
            pagoData.tipo = 'adelantado';

            let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
            pagos.push(pagoData);
            localStorage.setItem('pagos', JSON.stringify(pagos));
            
            this.reset();
            alert('Pago adelantado registrado.');
            generarResumen();
            actualizarRutaContainer();
        });

        document.getElementById('pagoAtrasadoForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const pagoData = Object.fromEntries(formData);
            pagoData.id = Date.now();
            pagoData.fechaRegistro = new Date().toISOString().split('T')[0];
            pagoData.tipo = 'atrasado';

            let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
            pagos.push(pagoData);
            localStorage.setItem('pagos', JSON.stringify(pagos));
            
            this.reset();
            alert('Pago atrasado registrado.');
            generarResumen();
            actualizarRutaContainer();
        });


        // --- Helper functions to populate selects ---
        function actualizarSelectClientesEnPrestamos() {
            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            const select = document.querySelector('#section-prestamos select[name="clienteSelect"]');
            select.innerHTML = '<option value="">Elige un cliente...</option>'; // Reset options
            clientes.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id;
                option.textContent = `${c.nombreCliente} (${c.ciudadCliente})`;
                select.appendChild(option);
            });
        }

        function actualizarSelectClientesEnPagos() {
            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            const selects = document.querySelectorAll('#section-pagos select[name^="cliente"]');
            selects.forEach(select => {
                select.innerHTML = '<option value="">Selecciona cliente...</option>'; // Reset options
                clientes.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.id;
                    option.textContent = `${c.nombreCliente} (${c.ciudadCliente})`;
                    select.appendChild(option);
                });
            });
        }

        // --- Route Section Logic ---
        document.getElementById('filterStatus').addEventListener('change', actualizarRutaContainer);

        function actualizarRutaContainer() {
            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            const prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
            const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
            const filter = document.getElementById('filterStatus').value;
            const container = document.getElementById('rutaContainer');

            let rutaItems = [];
            
            // For now, let's just show all clients as potential route items.
            // In a real app, you'd fetch today's route assignments.
            clientes.forEach(cliente => {
                const clientePrestamos = prestamos.filter(p => p.clienteId === cliente.id);
                if (clientePrestamos.length === 0) return; // Skip if no loans

                // Simple logic: consider a client for the route if they have active loans and no payment recorded for today (for simplicity)
                const lastPaymentDate = pagos.filter(p => p.clientePago === cliente.id).map(p => p.fechaRegistro).sort().pop();
                const today = new Date().toISOString().split('T')[0];
                
                let status = 'pendiente';
                let isCompletedToday = false;
                if (lastPaymentDate === today) {
                    status = 'completado';
                    isCompletedToday = true;
                } else {
                    // Check if any loan is overdue
                    clientePrestamos.forEach(p => {
                        const diasVencidos = Math.floor((new Date(today) - new Date(p.fechaInicio)) / (1000 * 60 * 60 * 24)) - p.diasPlazo;
                        if (diasVencidos > 0) {
                            status = 'mora';
                        }
                    });
                }

                if (filter === 'todos' || filter === status) {
                    rutaItems.push({ ...cliente, status });
                }
            });

            if (rutaItems.length === 0) {
                container.innerHTML = '<div class="text-center py-4 text-muted"><i class="fas fa-inbox fa-2x mb-2" style="opacity: 0.3;"></i><p>No hay clientes en la ruta hoy.</p></div>';
                return;
            }

            let html = '';
            rutaItems.forEach(item => {
                const itemStatusClass = item.status === 'completado' ? 'completed' : (item.status === 'mora' ? 'delayed' : '');
                html += `
                    <div class="route-item ${itemStatusClass}">
                        <div class="route-item-name">${item.nombreCliente}</div>
                        <div class="route-item-info">
                            <div class="route-item-info-item"><i class="fas fa-phone"></i> ${item.telefonoCliente}</div>
                            <div class="route-item-info-item"><i class="fas fa-map-marker-alt"></i> ${item.direccion}, ${item.ciudadCliente}</div>
                        </div>
                        <div class="route-item-actions">
                            <button class="btn btn-sm btn-primary flex-fill" onclick="marcarComoCobrado(${item.id})">
                                <i class="fas fa-check"></i> Cobrado
                            </button>
                            <button class="btn btn-sm btn-warning flex-fill" onclick="registrarPagoParcial(${item.id})">
                                <i class="fas fa-money-bill-alt"></i> Pago Parcial
                            </button>
                            <button class="btn btn-sm btn-danger flex-fill" onclick="registrarAtraso(${item.id})">
                                <i class="fas fa-exclamation-triangle"></i> Atraso
                            </button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }

        function marcarComoCobrado(clienteId) {
            // Placeholder: In a real app, this would record a payment, update status, etc.
            alert(`Marcando cliente ${clienteId} como cobrado.`);
            // For demonstration, let's simulate a payment registration
            const pagoData = {
                id: Date.now(),
                clientePago: clienteId,
                montoPago: '0.00', // Needs real value
                fechaPago: new Date().toISOString().split('T')[0],
                metodoPago: 'efectivo',
                tipo: 'regular',
                fechaRegistro: new Date().toISOString().split('T')[0]
            };
            let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
            pagos.push(pagoData);
            localStorage.setItem('pagos', JSON.stringify(pagos));
            
            actualizarRutaContainer();
            generarResumen();
        }

        function registrarPagoParcial(clienteId) {
            alert(`Registrando pago parcial para cliente ${clienteId}.`);
            // Would open a form or modal to input amount and method
        }

        function registrarAtraso(clienteId) {
            alert(`Registrando atraso para cliente ${clienteId}.`);
            // Would likely update loan status or log a follow-up action
            // Could pre-fill the atrasado payment form if needed
            showSection('pagos'); // Switch to payments tab
            document.getElementById('tab-pago-atrasado').click(); // Activate atrasado tab
            document.querySelector('#pagoAtrasadoForm select[name="clienteAtrasado"]').value = clienteId;
        }


        // --- Summary Section Logic ---
        function generarResumen() {
            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            const prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
            const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
            const today = new Date().toISOString().split('T')[0];

            let totalCobrado = 0;
            let totalPendiente = 0;
            let totalMora = 0;
            let visitadosHoy = 0;

            const clientesConPrestamos = clientes.filter(c => prestamos.some(p => p.clienteId === c.id));
            
            const resumenTableBody = document.querySelector('#resumenTable tbody');
            resumenTableBody.innerHTML = '';

            clientesConPrestamos.forEach(cliente => {
                const clientePrestamos = prestamos.filter(p => p.clienteId === cliente.id);
                let clientePendiente = 0;
                let clienteMora = 0;
                let estadoCliente = 'Pendiente';
                let visitadoHoy = false;

                clientePrestamos.forEach(prestamo => {
                    const pagosDelPrestamo = pagos.filter(p => p.clientePago === cliente.id && p.tipo === 'regular'); // Simplified for now
                    
                    // Calculate remaining balance (simplified: assumes no interest/fees for this example)
                    const montoPagado = pagosDelPrestamo.reduce((sum, p) => sum + parseFloat(p.montoPago || 0), 0);
                    const saldoPrestamo = parseFloat(prestamo.montoPrestamo) - montoPagado;

                    if (saldoPrestamo > 0) {
                        clientePendiente += saldoPrestamo;
                        const diasVencidos = Math.floor((new Date(today) - new Date(prestamo.fechaInicio)) / (1000 * 60 * 60 * 24)) - prestamo.diasPlazo;
                        if (diasVencidos > 0) {
                            clienteMora += saldoPrestamo;
                            estadoCliente = 'En Mora';
                        } else {
                            estadoCliente = 'Pendiente';
                        }
                    } else {
                        estadoCliente = 'Pagado';
                    }
                });

                if (pagos.some(p => p.clientePago === cliente.id && p.fechaRegistro === today && p.tipo !== 'atrasado')) {
                    visitadoHoy = true;
                }

                totalPendiente += clientePendiente;
                totalMora += clienteMora;
                
                // For 'Total Cobrado', we'd sum up all payments made today or for today's expected payments
                // This is complex and requires more sophisticated loan tracking.
                // For now, let's approximate with payments made today.
                const pagosHoy = pagos.filter(p => p.clientePago === cliente.id && p.fechaRegistro === today && p.tipo !== 'atrasado');
                totalCobrado += pagosHoy.reduce((sum, p) => sum + parseFloat(p.montoPago || 0), 0);

                if (estadoCliente !== 'Pagado') {
                    resumenTableBody.innerHTML += `
                        <tr>
                            <td><strong>${cliente.nombreCliente}</strong></td>
                            <td><span class="badge ${estadoCliente === 'En Mora' ? 'bg-danger' : 'bg-warning'}">${estadoCliente}</span></td>
                            <td>$${clientePendiente.toFixed(2)}</td>
                        </tr>
                    `;
                }
                if (visitadoHoy) {
                    visitadosHoy++;
                }
            });

            document.getElementById('resumenCobrado').textContent = '$' + totalCobrado.toFixed(2);
            document.getElementById('resumenPendiente').textContent = '$' + totalPendiente.toFixed(2);
            document.getElementById('resumenMora').textContent = '$' + totalMora.toFixed(2);
            document.getElementById('resumenVisitados').textContent = visitadosHoy;
        }

        function imprimirResumen() {
            // Add a header/footer for printing if needed
            const printContents = document.getElementById('section-resumen').innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents; // Restore original body
            location.reload(); // Refresh to re-initialize event listeners etc.
        }

        function guardarResumen() {
            // Logic to save summary, e.g., to a report file or backend
            alert('Resumen guardado.');
        }

        // --- Initial Load ---
        document.addEventListener('DOMContentLoaded', () => {
            actualizarListaClientes();
            actualizarSelectClientesEnPrestamos();
            actualizarSelectClientesEnPagos();
            actualizarRutaContainer();
            generarResumen();

            // Set initial date for forms if applicable
            const today = new Date().toISOString().split('T')[0];
            document.querySelectorAll('input[type="date"]').forEach(input => {
                if (!input.value) {
                    input.value = today;
                }
            });
        });

        // Example of how to make showSection work when clicking nav items
        document.querySelectorAll('.app-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Prevent default if it's a link (though it's a button here)
                e.preventDefault();
                // Extract section name from onclick attribute
                const onclickHandler = item.getAttribute('onclick');
                const sectionNameMatch = onclickHandler.match(/showSection$$'([^']+)'$$/);
                if (sectionNameMatch && sectionNameMatch[1]) {
                    showSection(sectionNameMatch[1]);
                }
            });
        });