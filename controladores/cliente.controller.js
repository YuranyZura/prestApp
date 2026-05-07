export const obtenerClientes = async (req, res) => {
  try {
    const data = await clienteService.getClientes();

    res.json({
      success: true,
      clientes: data
    });

  } catch (error) {
    console.error("Error en obtenerClientes:", error);

    res.status(500).json({
      success: false,
      message: "Error obteniendo clientes"
    });
  }
};