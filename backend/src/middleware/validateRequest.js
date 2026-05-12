export const validarCampos = (campos) => {
  return (req, res, next) => {
    for (let campo of campos) {
      if (!req.body[campo]) {
        return res.status(400).json({
          success: false,
          message: `Falta el campo: ${campo}`
        });
      }
    }
    next();
  };
};