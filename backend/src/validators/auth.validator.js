import { body, validationResult } from "express-validator";

// ==========================================
// MANEJADOR DE ERRORES
// ==========================================

export const validarCampos = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errores.array(),
    });
  }

  next();
};

// ==========================================
// VALIDACIONES REGISTRO
// ==========================================

export const validarRegistro = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio"),

  body("cedula")
    .trim()
    .notEmpty()
    .withMessage("La cédula es obligatoria"),

  body("telefono")
    .trim()
    .notEmpty()
    .withMessage("El teléfono es obligatorio"),

  body("correo")
    .isEmail()
    .withMessage("Correo electrónico inválido"),

  body("contrasena")
    .isLength({ min: 6 })
    .withMessage(
      "La contraseña debe tener mínimo 6 caracteres"
    ),

  validarCampos,
];

// ==========================================
// VALIDACIONES LOGIN
// ==========================================

export const validarLogin = [
  body("correo")
    .isEmail()
    .withMessage("Correo inválido"),

  body("contrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),

  validarCampos,
];