import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Verifica token
export function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token requerido"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Formato inválido"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decoded;

    next();

  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token inválido o expirado"
    });
  }
}

// Solo admin
export function soloAdmin(req, res, next) {
  if (req.usuario?.rol === "admin") return next();

  return res.status(403).json({
    success: false,
    message: "Acceso solo administrador"
  });
}

// Solo cobrador
export function soloCobrador(req, res, next) {
  if (req.usuario?.rol === "cobrador") return next();

  return res.status(403).json({
    success: false,
    message: "Acceso solo cobrador"
  });
}