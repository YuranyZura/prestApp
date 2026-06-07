import {Router} from "express";

import {
  login,
  perfil,
  validarToken,
  register
} from "../controllers/auth.controller.js";

import {
  verificarToken
} from "../middleware/auth.middleware.js";

import {
  validarLogin,
  validarRegistro
} from "../validators/auth.validator.js";

const router = Router();

// ==========================================
// AUTH
// ==========================================

// LOGIN
router.post("/login", validarLogin, login);

// REGISTER
router.post("/register", validarRegistro, register);

// VALIDAR TOKEN
router.get(
  "/validar",
  verificarToken,
  validarToken
);

// PERFIL USUARIO
router.get(
  "/perfil",
  verificarToken,
  perfil
);

export default router;