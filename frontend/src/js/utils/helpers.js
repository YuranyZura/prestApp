// =====================================
// FORMATEAR FECHA
// =====================================

export function formatearFecha(
  fecha
) {

  if (!fecha) return "-";

  try {

    const date =
      new Date(fecha);

    return date.toLocaleDateString(
      "es-CO",
      {

        year: "numeric",

        month: "2-digit",

        day: "2-digit"
      }
    );

  } catch {

    return fecha;
  }
}

// =====================================
// FORMATEAR MONEDA
// =====================================

export function formatearMoneda(
  valor = 0
) {

  return new Intl.NumberFormat(
    "es-CO",
    {

      style: "currency",

      currency: "COP",

      minimumFractionDigits: 0
    }
  ).format(valor);
}

// =====================================
// FORMATEAR NÚMERO
// =====================================

export function formatearNumero(
  numero = 0
) {

  return new Intl.NumberFormat(
    "es-CO"
  ).format(numero);
}

// =====================================
// CAPITALIZAR TEXTO
// =====================================

export function capitalizar(
  texto = ""
) {

  return texto
    .toLowerCase()
    .replace(
      /\b\w/g,
      letra => letra.toUpperCase()
    );
}

// =====================================
// GENERAR ID
// =====================================

export function generarId() {

  return Math.random()
    .toString(36)
    .substring(2, 10);
}

// =====================================
// ESPERAR
// =====================================

export function sleep(ms) {

  return new Promise(resolve => {

    setTimeout(
      resolve,
      ms
    );
  });
}

// =====================================
// DEBOUNCE
// =====================================

export function debounce(
  callback,
  delay = 300
) {

  let timeout;

  return (...args) => {

    clearTimeout(timeout);

    timeout = setTimeout(() => {

      callback(...args);

    }, delay);
  };
}

// =====================================
// COPIAR TEXTO
// =====================================

export async function copiarTexto(
  texto
) {

  try {

    await navigator.clipboard.writeText(
      texto
    );

    return true;

  } catch (error) {

    console.error(
      "Error copiando:",
      error
    );

    return false;
  }
}

// =====================================
// DESCARGAR JSON
// =====================================

export function descargarJSON(
  data,
  nombreArchivo = "archivo.json"
) {

  const blob =
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:
          "application/json"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    nombreArchivo;

  a.click();

  URL.revokeObjectURL(url);
}

// =====================================
// OBTENER QUERY PARAM
// =====================================

export function getQueryParam(
  param
) {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get(param);
}

// =====================================
// REDIRECCIONAR
// =====================================

export function redireccionar(
  ruta
) {

  window.location.href =
    ruta;
}

// =====================================
// RECARGAR PÁGINA
// =====================================

export function recargarPagina() {

  window.location.reload();
}

// =====================================
// SCROLL TOP
// =====================================

export function scrollTop() {

  window.scrollTo({

    top: 0,

    behavior: "smooth"
  });
}

// =====================================
// VALIDAR MÓVIL
// =====================================

export function esMovil() {

  return (
    /Android|iPhone|iPad|iPod/i
    .test(
      navigator.userAgent
    )
  );
}

// =====================================
// VALIDAR ONLINE
// =====================================

export function estaOnline() {

  return navigator.onLine;
}

// =====================================
// OBTENER INITIALS
// =====================================

export function obtenerIniciales(
  nombre = ""
) {

  return nombre
    .split(" ")
    .map(p =>
      p.charAt(0)
    )
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

// =====================================
// FORMATEAR ESTADO
// =====================================

export function formatearEstado(
  estado = ""
) {

  const estados = {

    activo:
      "Activo",

    pendiente:
      "Pendiente",

    pagado:
      "Pagado",

    vencido:
      "Vencido",

    cancelado:
      "Cancelado"
  };

  return (
    estados[
      estado.toLowerCase()
    ] || estado
  );
}

// =====================================
// CONVERTIR A MAYÚSCULAS
// =====================================

export function mayusculas(
  texto = ""
) {

  return texto.toUpperCase();
}

// =====================================
// CONVERTIR A MINÚSCULAS
// =====================================

export function minusculas(
  texto = ""
) {

  return texto.toLowerCase();
}

// =====================================
// TRUNCAR TEXTO
// =====================================

export function truncarTexto(
  texto = "",
  longitud = 50
) {

  if (
    texto.length <= longitud
  ) {

    return texto;
  }

  return (
    texto.substring(
      0,
      longitud
    ) + "..."
  );
}

// =====================================
// OBTENER HORA ACTUAL
// =====================================

export function obtenerHora() {

  return new Date()
    .toLocaleTimeString(
      "es-CO"
    );
}

// =====================================
// OBTENER FECHA ACTUAL
// =====================================

export function obtenerFechaActual() {

  return new Date()
    .toISOString()
    .split("T")[0];
}