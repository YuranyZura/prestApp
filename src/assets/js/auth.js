async function login(email, password) {
  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
  correo: email,
  contrasena: password
})
    });

    if (data && data.success) {
      mostrarNotificacion("Inicio de sesión exitoso", "success");

      // Redirigir según rol (opcional)
      if (data.user?.rol === "super_admin"){
        window.location.href = "/admin/dashboard.html";
      } else {
        window.location.href = "/html/trabajador/Rol2_trabajador.html";
      }
    }

  } catch (error) {
    console.error("Error login:", error);
    mostrarNotificacion("Credenciales incorrectas", "danger");
  }
}

// 🚪 LOGOUT
async function logout() {
  try {
    await apiFetch("/auth/logout", {
      method: "POST"
    });

    mostrarNotificacion("Sesión cerrada", "info");

    // Redirigir al login
    window.location.href = "/login.html";

  } catch (error) {
    console.error("Error logout:", error);
    mostrarNotificacion("Error al cerrar sesión", "danger");
  }
}

// 🔎 VERIFICAR SESIÓN
async function checkSession() {
  try {
    const data = await apiFetch("/auth/check");

    if (!data || !data.success) {
      redirigirLogin();
    }

  } catch (error) {
    redirigirLogin();
  }
}

// 🔁 REDIRECCIÓN SEGURA
function redirigirLogin() {
  window.location.href = "/login.html";
}

// 🧠 PROTEGER PÁGINAS
function protegerRuta() {
  document.addEventListener("DOMContentLoaded", () => {
    checkSession();
  });
}

// 🔘 BOTONES AUTOMÁTICOS
document.addEventListener("DOMContentLoaded", () => {

  // Botón logout
  const btnLogout = document.getElementById("btnCerrarSesion");
  if (btnLogout) {
    btnLogout.addEventListener("click", logout);
  }

});