// =====================================
// BOTÓN LOGOUT
// =====================================

const btnLogout =
  document.getElementById(
    "btnLogout"
  );

// =====================================
// CERRAR SESIÓN
// =====================================

if (btnLogout) {

  btnLogout.addEventListener(
    "click",
    () => {

      // ELIMINAR DATOS

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "usuario"
      );

      // LIMPIAR TODO

      localStorage.clear();

      // REDIRECCIONAR

      window.location.href =
        "/src/html/auth/login.html";
    }
  );
}

// =====================================
// AUTO LOGOUT SI NO HAY TOKEN
// =====================================

const token =
  localStorage.getItem("token");

if (!token) {

  window.location.href =
    "/src/html/auth/login.html";
}