import { Router } from "express";

import {
  obtenerAdmins,
  obtenerAdminPorId,
  crearAdmin,
  actualizarAdmin,
  eliminarAdmin
} from "../controllers/admin.controller.js";

import { verificarToken } from "../middleware/auth.middleware.js";
import { soloAdmin } from "../middleware/roles.js";

const router = Router();

router.use(verificarToken, soloAdmin);

router.get("/", obtenerAdmins);

router.get("/:id", obtenerAdminPorId);

router.post("/", crearAdmin);

router.put("/:id", actualizarAdmin);

router.delete("/:id", eliminarAdmin);

export default router;