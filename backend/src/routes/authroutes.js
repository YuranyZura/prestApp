import { Router } from "express";

import {
  login,
  perfil,
  validarToken
} from "../controllers/authController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

// LOGIN
router.post("/login", login);

// PERFIL
router.get(
  "/perfil",
  verificarToken,
  perfil
);

// VALIDAR TOKEN
router.get(
  "/validar",
  verificarToken,
  validarToken
);

export default router;