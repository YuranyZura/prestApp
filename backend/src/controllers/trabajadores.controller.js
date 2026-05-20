export const obtenerTrabajadores = async (req, res) => {
  res.json({ mensaje: "Obtener trabajadores" });
};

export const obtenerTrabajadorPorId = async (req, res) => {
  res.json({ mensaje: "Obtener trabajador por ID" });
};

export const crearTrabajador = async (req, res) => {
  res.json({ mensaje: "Crear trabajador" });
};

export const actualizarTrabajador = async (req, res) => {
  res.json({ mensaje: "Actualizar trabajador" });
};

export const eliminarTrabajador = async (req, res) => {
  res.json({ mensaje: "Eliminar trabajador" });
};