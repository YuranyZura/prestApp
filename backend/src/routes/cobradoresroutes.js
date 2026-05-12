import { Router } from "express";

import {
  obtenerCobradores,
  crearCobrador,
  eliminarCobrador
} from "../controllers/cobradoresController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();
router.use(verificarToken);

router.get("/", obtenerCobradores);

router.post("/", crearCobrador);

router.delete("/:id", eliminarCobrador);
export default router;