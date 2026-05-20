import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//dotenv.config();

// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET =
  process.env.JWT_SECRET;

// ==========================================
// VALIDAR SECRET
// ==========================================

if (!JWT_SECRET) {

  console.error(
    "❌ JWT_SECRET no definido"
  );

  process.exit(1);
}

// ==========================================
// VERIFICAR TOKEN
// ==========================================

export async function verificarToken(
  req,
  res,
  next
) {

  try {

    // ==========================================
    // OBTENER HEADER
    // ==========================================

    const authHeader =
      req.headers.authorization;

    // ==========================================
    // VALIDAR HEADER
    // ==========================================

    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Token requerido"
      });
    }

    // ==========================================
    // VALIDAR FORMATO
    // ==========================================

    const parts =
      authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0].toLowerCase() !== "bearer"
    ) {

      return res.status(401).json({
        success: false,
        message: "Formato de token inválido"
      });
    }

    // ==========================================
    // OBTENER TOKEN
    // ==========================================

    const token =
      parts[1];

    // ==========================================
    // VALIDAR TOKEN VACÍO
    // ==========================================

    if (
      !token ||
      token === "undefined" ||
      token === "null"
    ) {

      return res.status(401).json({
        success: false,
        message: "Token inválido"
      });
    }

    // ==========================================
    // VERIFICAR JWT
    // ==========================================

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    // ==========================================
    // VALIDAR PAYLOAD
    // ==========================================

    if (
      !decoded ||
      !decoded.id
    ) {

      return res.status(401).json({
        success: false,
        message: "Payload inválido"
      });
    }

    // ==========================================
    // INYECTAR USUARIO
    // ==========================================

    req.usuario =
      decoded;

    // ==========================================
    // CONTINUAR
    // ==========================================

    next();

  } catch (error) {

    console.error(
      "❌ ERROR AUTH:",
      error.message
    );

    // ==========================================
    // TOKEN EXPIRADO
    // ==========================================

    if (
      error.name ===
      "TokenExpiredError"
    ) {

      return res.status(401).json({
        success: false,
        message: "Token expirado"
      });
    }

    // ==========================================
    // TOKEN INVÁLIDO
    // ==========================================

    return res.status(403).json({
      success: false,
      message: "Token inválido"
    });
  }
}

// ==========================================
// VERIFICAR ROLES
// ==========================================

const verificarRol =
  (...rolesPermitidos) => {

    return (
      req,
      res,
      next
    ) => {

      // ======================================
      // VALIDAR USUARIO
      // ======================================

      if (!req.usuario) {

        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado"
        });
      }

      // ======================================
      // VALIDAR ROL
      // ======================================

      if (
        rolesPermitidos.includes(
          req.usuario.rol
        )
      ) {

        return next();
      }

      console.warn(
        "⚠️ Acceso denegado:",
        {
          usuario:
            req.usuario.id,

          rol:
            req.usuario.rol,

          ruta:
            req.originalUrl
        }
      );

      return res.status(403).json({
        success: false,
        message: "No tienes permisos"
      });
    };
  };

// ==========================================
// ROLES
// ==========================================

export const soloSuperAdmin =
  verificarRol(
    "super_admin"
  );

export const soloAdmin =
  verificarRol(
    "administrador",
    "super_admin"
  );

export const soloTrabajador =
  verificarRol(
    "trabajador"
  );