import express from "express";

import {
  login,
  perfil,
  validarToken
} from "../controllers/auth.controller.js";

import {
  verificarToken
} from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// AUTH
// ==========================================

// LOGIN
router.post("/login", login);

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