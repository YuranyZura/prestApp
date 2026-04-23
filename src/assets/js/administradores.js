document.addEventListener("DOMContentLoaded", () => {
  console.log("Administrador cargado");

  // ===============================
  // CONFIGURACIÓN BASE (IMPORTANTE)
  // ===============================
  const API_URL = "http://192.168.1.10:4000/api"; // ⚠️ CAMBIA POR TU IP

  // ===============================
  // VALIDAR SESIÓN
  // ===============================
  const rol = sessionStorage.getItem("user_role");

  if (!rol) {
    console.warn("No hay sesión activa");
    window.location.href = "./login.html";
    return;
  }

  if (rol !== "administrador") {
    console.warn("Acceso denegado: no es administrador");
    window.location.href = "./login.html";
    return;
  }

  console.log("Usuario administrador verificado");

  // ===============================
  // FUNCIÓN TOAST (REUTILIZABLE)
  // ===============================
  function mostrarToast(mensaje, tipo = "info") {
    const body = document.getElementById("toastAdminBody");
    const toastEl = document.getElementById("toastAdmin");

    if (body) body.textContent = mensaje;

    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    } else {
      alert(mensaje); // fallback
    }
  }

  // ===============================
  // OBTENER DATOS DEL DASHBOARD
  // ===============================
  async function cargarDashboard() {
    try {
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();
      console.log("Datos dashboard:", data);

      if (!data.success) {
        mostrarToast("Error cargando datos", "error");
        return;
      }

      // 👉 Ejemplo de renderizado
      document.getElementById("totalUsuarios").textContent = data.totalUsuarios || 0;
      document.getElementById("totalVentas").textContent = data.totalVentas || 0;

    } catch (error) {
      console.error("Error dashboard:", error);
      mostrarToast("Error de conexión", "error");
    }
  }

  // ===============================
  // CARGAR USUARIOS
  // ===============================
  async function cargarUsuarios() {
    try {
      const response = await fetch(`${API_URL}/admin/usuarios`, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();

      if (!data.success) {
        mostrarToast("Error al cargar usuarios", "error");
        return;
      }

      const tabla = document.getElementById("tablaUsuarios");
      if (!tabla) return;

      tabla.innerHTML = "";

      data.usuarios.forEach(user => {
        const fila = `
          <tr>
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.correo}</td>
            <td>${user.rol}</td>
          </tr>
        `;
        tabla.innerHTML += fila;
      });

    } catch (error) {
      console.error("Error usuarios:", error);
      mostrarToast("Error de conexión", "error");
    }
  }

  // ===============================
  // CERRAR SESIÓN
  // ===============================
  const btnLogout = document.getElementById("btnLogout");

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include"
        });

      } catch (error) {
        console.warn("Error al cerrar sesión en servidor");
      }

      // Limpiar sesión local
      sessionStorage.clear();

      // Redirigir
      window.location.href = "./login.html";
    });
  }

  // ===============================
  // INICIALIZAR TODO
  // ===============================
  cargarDashboard();
  cargarUsuarios();

});