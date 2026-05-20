import { Router } from "express";

import {
  obtenerCobradores,
  crearCobrador,
  eliminarCobrador
} from "../controllers/cobradores.controller.js";

import {
  verificarToken
} from "../middleware/auth.middleware.js";

const router = Router();
router.use(verificarToken);

router.get("/", obtenerCobradores);

router.post("/", crearCobrador);

router.delete("/:id", eliminarCobrador);
export default router;