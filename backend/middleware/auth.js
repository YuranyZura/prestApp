import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // ✅ Validar header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token requerido (Bearer)" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Usar variable de entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (error) {
    console.error("Error verificando token:", error.message);

    return res.status(403).json({
      message: "Token inválido o expirado"
    });
  }
}
