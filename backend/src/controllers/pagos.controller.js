

import { Router } from "express";

import {
  obtenerDashboard,
  obtenerResumen,
  obtenerMetricas
} from "./dashboard.controller.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

/* ==========================================
MIDDLEWARE
========================================== */

router.use(verificarToken);

/* ==========================================
RUTAS
========================================== */

router.get("/", obtenerDashboard);

router.get("/resumen", obtenerResumen);

router.get("/metricas", obtenerMetricas);

/* ==========================================
EXPORT
========================================== */

export default router;

export const obtenerPagos = async (req, res) => {
  try {
    res.json({
      mensaje: "Lista de pagos",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const obtenerPagoPorId = async (req, res) => {
  try {
    res.json({
      mensaje: "Pago encontrado",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const crearPago = async (req, res) => {
  try {
    res.status(201).json({
      mensaje: "Pago creado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const actualizarPago = async (req, res) => {
  try {
    res.json({
      mensaje: "Pago actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const eliminarPago = async (req, res) => {
  try {
    res.json({
      mensaje: "Pago eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};