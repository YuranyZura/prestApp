import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 🔐 Middleware de verificación de token
export function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No hay header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token requerido",
      });
    }

    // ❌ Formato incorrecto
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido",
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔒 Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 📌 Guardar usuario en request
    req.usuario = decoded;

    next();

  } catch (error) {
    console.error("❌ Error verificando token:", error.message);

    return res.status(403).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
}