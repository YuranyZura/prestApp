import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET no definido");
  process.exit(1);
}

// 🔐 VERIFICAR TOKEN
export function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token requerido"
      });
    }

    // 🔥 Validar formato Bearer
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido"
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.usuario = decoded;

    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado"
      });
    }

    return res.status(403).json({
      success: false,
      message: "Token inválido"
    });
  }
}

// 🔐 GENERADOR DE ROLES DINÁMICO
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {

    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
    }

    if (rolesPermitidos.includes(req.usuario.rol)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "No tienes permisos"
    });
  };
};

// 🎯 ROLES
export const soloSuperAdmin = verificarRol("super_admin");
export const soloAdmin = verificarRol("administrador", "super_admin");
export const soloTrabajador = verificarRol("trabajador");