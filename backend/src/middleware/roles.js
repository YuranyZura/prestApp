// middleware/roles.js

// 🔐 Middleware genérico para validar roles
export const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {

    // 🔒 Verificar que el usuario exista (viene del JWT)
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
    }

    // 🔒 Verificar si el rol está permitido
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para acceder"
      });
    }

    next();
  };
};

// usos:
export const soloAdmin = verificarRol("administrador", "super_admin");
export const soloSuperAdmin = verificarRol("super_admin");
export const soloTrabajador = verificarRol("trabajador");