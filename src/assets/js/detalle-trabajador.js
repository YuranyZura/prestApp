// Obtener parámetros de la URL
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idTrabajador = params.get("id");
  console.log("ID Trabajador:", idTrabajador); // prueba que esté llegando
});


async function cargarDetalle() {
  const params = new URLSearchParams(window.location.search);
  const idTrabajador = params.get("id");

  try {
    const response = await fetch(`http://localhost:3000/api/trabajadores/${idTrabajador}`);
    if (!response.ok) throw new Error("Trabajador no encontrado");

    const trabajador = await response.json();

    // Mostrar los datos en el HTML
    document.getElementById("fotoTrabajador").src = trabajador.foto ? `/uploads/${trabajador.foto}` : '../assets/images/profile/user-1.jpg';
    document.getElementById("nombreCompleto").textContent = `${trabajador.nombre} ${trabajador.apellido}`;
    document.getElementById("cedulaDetalle").textContent = trabajador.cedula;
    document.getElementById("fechaNacimientoDetalle").textContent = new Date(trabajador.fecha_nacimiento).toLocaleDateString();
    document.getElementById("celularDetalle").textContent = trabajador.telefono;
    document.getElementById("correoDetalle").textContent = trabajador.correo;
    document.getElementById("direccionDetalle").textContent = trabajador.direccion;

    // Llamar a la función para cargar los clientes asociados al trabajador
    cargarClientesTrabajador(idTrabajador);

    // Si el trabajador ya está vinculado a un usuario, obtener info de usuario
    if (trabajador.id_usuario) {
      try {
        const resUser = await fetch(`http://localhost:3000/api/auth/user/${trabajador.id_usuario}`);
        if (resUser.ok) {
          const user = await resUser.json();

          // Mostrar sección de credenciales existentes
          document.getElementById('usuarioExistente').value = user.correo || '';
          // No podemos recuperar contraseñas si están hasheadas; mostrar marcador
          document.getElementById('contrasenaExistente').value = '********';
          document.getElementById('credencialesExistentes').classList.remove('d-none');
          document.getElementById('formularioCredenciales').classList.add('d-none');

          // Estado
          const estadoBadge = document.getElementById('estadoTrabajador');
          const btnToggle = document.getElementById('btnToggleAcceso');
          if (user.verificado) {
            estadoBadge.textContent = 'Activo';
            estadoBadge.classList.remove('bg-danger');
            estadoBadge.classList.add('bg-success');
            if (btnToggle) btnToggle.textContent = 'Inactivar acceso';
          } else {
            estadoBadge.textContent = 'Inactivo';
            estadoBadge.classList.remove('bg-success');
            estadoBadge.classList.add('bg-danger');
            if (btnToggle) btnToggle.textContent = 'Activar acceso';
          }

          // Mostrar botón para revelar contraseña (si el backend lo permite)
          const btnMostrar = document.getElementById('btnMostrarContrasena');
          if (btnMostrar) {
            btnMostrar.addEventListener('click', async () => {
              try {
                const resPass = await fetch(`http://localhost:3000/api/auth/user-password/${trabajador.id_usuario}`);
                if (!resPass.ok) {
                  // intentar leer JSON, si falla usar texto (hay casos donde el servidor devuelve HTML)
                  let errMsg = 'No es posible mostrar la contraseña';
                  try {
                    const errJson = await resPass.json();
                    errMsg = errJson.message || errMsg;
                  } catch (_) {
                    const txt = await resPass.text();
                    errMsg = txt || errMsg;
                  }
                  return alert(errMsg);
                }
                // respuesta OK: intentar parsear JSON
                let data;
                try {
                  data = await resPass.json();
                } catch (e) {
                  const txt = await resPass.text();
                  console.warn('user-password returned non-json:', txt);
                  return alert('Respuesta inesperada del servidor');
                }
                document.getElementById('contrasenaExistente').value = data.contrasena;
              } catch (err) {
                console.error(err);
                alert('Error al recuperar la contraseña');
              }
            });
          }

          // Toggle acceso
          if (btnToggle) {
            btnToggle.addEventListener('click', async () => {
              const activar = user.verificado ? false : true;
              try {
                const res = await fetch('http://localhost:3000/api/auth/toggle-acceso', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id_usuarios: trabajador.id_usuario, activo: activar })
                });

                if (!res.ok) {
                  let errMsg = 'Error cambiando estado';
                  try {
                    const errJson = await res.json();
                    errMsg = errJson.message || errMsg;
                  } catch (_) {
                    errMsg = await res.text();
                  }
                  throw new Error(errMsg);
                }

                const data = await res.json();
                // Usar modal de notificación en lugar de alert
                showNotificationModal('Estado de acceso', data.message || 'Estado cambiado', () => {
                  window.location.reload();
                });
              } catch (err) {
                console.error(err);
                // Mostrar error en modal también
                showNotificationModal('Error', err.message || 'Error al cambiar acceso');
              }
            });
          }
        }
      } catch (err) {
        console.error('Error al obtener usuario asociado:', err);
      }
    } else {
      // Pre-llenar el campo de usuario con el correo del trabajador
      const usuarioInput = document.getElementById('usuarioAcceso');
      if (usuarioInput) usuarioInput.value = trabajador.correo || '';
    }

  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

document.addEventListener("DOMContentLoaded", cargarDetalle);

// Mostrar modal de notificación reutilizable
function showNotificationModal(title, message, onHide) {
  const modalEl = document.getElementById('modalNotificacion');
  if (!modalEl) {
    alert(message);
    if (onHide) onHide();
    return;
  }

  const titleEl = document.getElementById('modalNotificacionTitle');
  const bodyEl = document.getElementById('modalNotificacionBody');
  if (titleEl) titleEl.textContent = title || 'Notificación';
  if (bodyEl) bodyEl.textContent = message || '';

  const bsModal = new bootstrap.Modal(modalEl);
  // attach hide handler once
  const handler = () => {
    modalEl.removeEventListener('hidden.bs.modal', handler);
    if (onHide) onHide();
  };
  modalEl.addEventListener('hidden.bs.modal', handler);

  bsModal.show();
}



// Generar contraseña aleatoria y colocarla en los campos
function generarContrasena() {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
  let contrasena = "";
  for (let i = 0; i < 10; i++) {
    contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  document.getElementById("contrasenaAcceso").value = contrasena;
  document.getElementById("confirmarContrasena").value = contrasena;
}

function mostrarFormularioCredenciales() {
  document.getElementById("credencialesExistentes").classList.add("d-none");
  document.getElementById("formularioCredenciales").classList.remove("d-none");
}

async function copiarTexto(idElemento) {
  const elemento = document.getElementById(idElemento);
  try {
    await navigator.clipboard.writeText(elemento.value);
  } catch (err) {
    // fallback
    elemento.select();
    document.execCommand('copy');
  }
}

// Manejo del envío del formulario de credenciales
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCredenciales');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const idTrabajador = params.get('id');

    const correo = document.getElementById('usuarioAcceso').value.trim();
    const contrasena = document.getElementById('contrasenaAcceso').value;
    const confirmar = document.getElementById('confirmarContrasena').value;

    if (contrasena.length < 8) return alert('La contraseña debe tener al menos 8 caracteres');
    if (contrasena !== confirmar) return alert('Las contraseñas no coinciden');

    try {
      const res = await fetch('http://localhost:3000/api/auth/create-credenciales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_trabajador: idTrabajador, correo, contrasena })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al guardar credenciales');

      // Mostrar credenciales guardadas (mostramos la contraseña generada en esta sesión)
      document.getElementById('usuarioExistente').value = correo;
      document.getElementById('contrasenaExistente').value = contrasena;
      document.getElementById('formularioCredenciales').classList.add('d-none');
      document.getElementById('credencialesExistentes').classList.remove('d-none');

      alert('Credenciales guardadas correctamente. Ahora el trabajador puede iniciar sesión con su correo y contraseña.');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al crear credenciales');
    }
  });
});




// ======muestra los clientes asociados al trabajador========
async function cargarClientesTrabajador(idTrabajador) {
  const tbody = document.getElementById('clientesTrabajador');
  try {
    const res = await fetch(`http://localhost:3000/api/clientes/trabajador/${idTrabajador}`);
    if (!res.ok) throw new Error('No hay clientes');
    const clientes = await res.json();
    tbody.innerHTML = '';
    if (clientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">No hay clientes</td></tr>';
      return;
    }
    clientes.forEach(c => {
      const tr = document.createElement('tr');
      const fecha = c.fecha_prestamo ? new Date(c.fecha_prestamo).toLocaleDateString('es-ES') : '';
      tr.innerHTML = `
        <td>${c.nombre_completo}</td>
        <td>${fecha}</td>
        <td>$${Number(c.monto_prestado).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="3">Error al cargar clientes</td></tr>';
  }
}



