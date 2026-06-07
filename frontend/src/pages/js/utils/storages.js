// =====================================
// STORAGE KEYS
// =====================================

const KEYS = {

  TOKEN:
    "token",

  USUARIO:
    "usuario",

  CONFIG:
    "config",

  TEMA:
    "tema",

  IDIOMA:
    "idioma"
};

// =====================================
// GUARDAR LOCAL
// =====================================

export function setLocal(
  key,
  value
) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  } catch (error) {

    console.error(
      "Error guardando localStorage:",
      error
    );
  }
}

// =====================================
// OBTENER LOCAL
// =====================================

export function getLocal(
  key
) {

  try {

    const data =
      localStorage.getItem(
        key
      );

    return data
      ? JSON.parse(data)
      : null;

  } catch (error) {

    console.error(
      "Error leyendo localStorage:",
      error
    );

    return null;
  }
}

// =====================================
// ELIMINAR LOCAL
// =====================================

export function removeLocal(
  key
) {

  try {

    localStorage.removeItem(
      key
    );

  } catch (error) {

    console.error(
      "Error eliminando localStorage:",
      error
    );
  }
}

// =====================================
// LIMPIAR LOCAL
// =====================================

export function clearLocal() {

  try {

    localStorage.clear();

  } catch (error) {

    console.error(
      "Error limpiando localStorage:",
      error
    );
  }
}

// =====================================
// SESSION STORAGE
// =====================================

export function setSession(
  key,
  value
) {

  try {

    sessionStorage.setItem(
      key,
      JSON.stringify(value)
    );

  } catch (error) {

    console.error(
      "Error guardando sessionStorage:",
      error
    );
  }
}

export function getSession(
  key
) {

  try {

    const data =
      sessionStorage.getItem(
        key
      );

    return data
      ? JSON.parse(data)
      : null;

  } catch (error) {

    console.error(
      "Error leyendo sessionStorage:",
      error
    );

    return null;
  }
}

export function removeSession(
  key
) {

  try {

    sessionStorage.removeItem(
      key
    );

  } catch (error) {

    console.error(
      "Error eliminando sessionStorage:",
      error
    );
  }
}

export function clearSession() {

  try {

    sessionStorage.clear();

  } catch (error) {

    console.error(
      "Error limpiando sessionStorage:",
      error
    );
  }
}

// =====================================
// TOKEN
// =====================================

export function guardarToken(
  token
) {

  setLocal(
    KEYS.TOKEN,
    token
  );
}

export function obtenerToken() {

  return getLocal(
    KEYS.TOKEN
  );
}

export function eliminarToken() {

  removeLocal(
    KEYS.TOKEN
  );
}

// =====================================
// USUARIO
// =====================================

export function guardarUsuario(
  usuario
) {

  setLocal(
    KEYS.USUARIO,
    usuario
  );
}

export function obtenerUsuario() {

  return getLocal(
    KEYS.USUARIO
  );
}

export function eliminarUsuario() {

  removeLocal(
    KEYS.USUARIO
  );
}

// =====================================
// ROL USUARIO
// =====================================

export function obtenerRol() {

  const usuario =
    obtenerUsuario();

  return usuario?.rol || null;
}

// =====================================
// LOGIN STATUS
// =====================================

export function estaLogueado() {

  return !!obtenerToken();
}

// =====================================
// CERRAR SESIÓN
// =====================================

export function cerrarSesion() {

  eliminarToken();

  eliminarUsuario();

  clearSession();

  window.location.href =
    "/src/html/auth/login.html";
}

// =====================================
// CONFIGURACIÓN APP
// =====================================

export function guardarConfig(
  config
) {

  setLocal(
    KEYS.CONFIG,
    config
  );
}

export function obtenerConfig() {

  return getLocal(
    KEYS.CONFIG
  );
}

// =====================================
// TEMA
// =====================================

export function guardarTema(
  tema
) {

  setLocal(
    KEYS.TEMA,
    tema
  );
}

export function obtenerTema() {

  return getLocal(
    KEYS.TEMA
  ) || "light";
}

// =====================================
// IDIOMA
// =====================================

export function guardarIdioma(
  idioma
) {

  setLocal(
    KEYS.IDIOMA,
    idioma
  );
}

export function obtenerIdioma() {

  return getLocal(
    KEYS.IDIOMA
  ) || "es";
}