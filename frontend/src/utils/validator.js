// =====================================
// VALIDAR EMAIL
// =====================================

export function validarEmail(
  email
) {

  if (!email) return false;

  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(
    email.trim()
  );
}

// =====================================
// VALIDAR PASSWORD
// =====================================

export function validarPassword(
  password
) {

  if (!password) return false;

  // mínimo 8 caracteres
  return (
    password.length >= 8
  );
}

// =====================================
// VALIDAR TELÉFONO
// =====================================

export function validarTelefono(
  telefono
) {

  if (!telefono) return false;

  const regex =
    /^[0-9]{10}$/;

  return regex.test(
    telefono.trim()
  );
}

// =====================================
// VALIDAR CÉDULA
// =====================================

export function validarCedula(
  cedula
) {

  if (!cedula) return false;

  const regex =
     /^[1-9][0-9]{4,19}$/;

  return regex.test(
    cedula.trim()
  );
}

// =====================================
// VALIDAR NOMBRE
// =====================================

export function validarNombre(
  nombre
) {

  if (!nombre) return false;

  return (
    nombre.trim().length >= 2
  );
}

// =====================================
// VALIDAR TEXTO VACÍO
// =====================================

export function validarRequerido(
  valor
) {

  return (
    valor &&
    valor.trim() !== ""
  );
}

// =====================================
// VALIDAR NÚMEROS
// =====================================

export function validarNumero(
  valor
) {

  return (
    !isNaN(valor) &&
    valor !== ""
  );
}

// =====================================
// VALIDAR MONTO
// =====================================

export function validarMonto(
  monto
) {

  return (
    validarNumero(monto) &&
    Number(monto) > 0
  );
}

// =====================================
// VALIDAR FECHA
// =====================================

export function validarFecha(
  fecha
) {

  if (!fecha) return false;

  const date =
    new Date(fecha);

  return (
    !isNaN(date.getTime())
  );
}

// =====================================
// VALIDAR URL
// =====================================

export function validarURL(
  url
) {

  try {

    new URL(url);

    return true;

  } catch {

    return false;
  }
}

// =====================================
// VALIDAR FORMULARIO
// =====================================

export function validarFormulario(
  campos = []
) {

  const errores = [];

  campos.forEach(campo => {

    const {

      nombre,
      valor,
      tipo
    } = campo;

    // REQUERIDO

    if (
      !validarRequerido(valor)
    ) {

      errores.push(
        `${nombre} es obligatorio`
      );

      return;
    }

    // EMAIL

    if (
      tipo === "email" &&
      !validarEmail(valor)
    ) {

      errores.push(
        `${nombre} inválido`
      );
    }

    // PASSWORD

    if (
      tipo === "password" &&
      !validarPassword(valor)
    ) {

      errores.push(
        `${nombre} mínimo 8 caracteres`
      );
    }

    // TELÉFONO

    if (
      tipo === "telefono" &&
      !validarTelefono(valor)
    ) {

      errores.push(
        `${nombre} inválido`
      );
    }

    // CÉDULA

    if (
      tipo === "cedula" &&
      !validarCedula(valor)
    ) {

      errores.push(
        `${nombre} inválida`
      );
    }

    // MONTO

    if (
      tipo === "monto" &&
      !validarMonto(valor)
    ) {

      errores.push(
        `${nombre} inválido`
      );
    }
  });

  return {

    valido:
      errores.length === 0,

    errores
  };
}

// =====================================
// VALIDAR INPUT HTML
// =====================================

export function marcarErrorInput(
  input,
  mensaje = ""
) {

  if (!input) return;

  input.classList.add(
    "input-error"
  );

  input.style.border =
    "1px solid red";

  // mensaje

  let error =
    input.parentNode.querySelector(
      ".error-text"
    );

  if (!error) {

    error =
      document.createElement("small");

    error.className =
      "error-text";

    error.style.color =
      "red";

    error.style.display =
      "block";

    error.style.marginTop =
      "4px";

    input.parentNode.appendChild(
      error
    );
  }

  error.textContent =
    mensaje;
}

// =====================================
// LIMPIAR ERROR INPUT
// =====================================

export function limpiarErrorInput(
  input
) {

  if (!input) return;

  input.classList.remove(
    "input-error"
  );

  input.style.border = "";

  const error =
    input.parentNode.querySelector(
      ".error-text"
    );

  if (error) {

    error.remove();
  }
}

// =====================================
// LIMPIAR FORMULARIO
// =====================================

export function limpiarFormulario(
  form
) {

  if (!form) return;

  form.reset();

  form
    .querySelectorAll("input")
    .forEach(input => {

      limpiarErrorInput(
        input
      );
    });
}