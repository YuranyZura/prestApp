import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  jwt.verify(token, "mi_secreto_ultra_seguro", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }
    req.user = user;
    next();
  });
}
