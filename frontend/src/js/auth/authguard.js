const token =
  localStorage.getItem("token");

const usuario =
  JSON.parse(
    localStorage.getItem("usuario")
  );

if (!token || !usuario) {

  window.location.href =
    "/src/html/auth/login.html";
}

// VALIDAR ROL

const rutaActual =
  window.location.pathname;

if (
  rutaActual.includes("/admin/")
) {

  if (
    usuario.rol !== "administrador" &&
    usuario.rol !== "super_admin"
  ) {

    window.location.href =
      "/src/html/auth/login.html";
  }
}

if (
  rutaActual.includes("/trabajador/")
) {

  if (
    usuario.rol !== "trabajador"
  ) {

    window.location.href =
      "/src/html/auth/login.html";
  }
}