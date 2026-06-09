export const validarLogin = (
  req,
  res,
  next
) => {

  const {
    correo,
    contrasena
  } = req.body;

  if (
    !correo ||
    !contrasena
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Correo y contraseña son obligatorios"
    });
  }

  next();
};

export const validarRegistro = (
  req,
  res,
  next
) => {

  const {
    nombre,
    apellido,
    cedula,
    telefono,
    correo,
    contrasena
  } = req.body;

  if (
    !nombre ||
    !apellido ||
    !cedula ||
    !telefono ||
    !correo ||
    !contrasena
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Todos los campos son obligatorios"
    });
  }

  next();
};