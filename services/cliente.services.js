import * as model from "../models/clientes.model.js";

export const getClientes = async () => {
  const clientes = await model.getAll();

  return clientes.map(c => ({
    ...c,
    nombreCompleto: `${c.nombre} ${c.apellido || ""}`,
    estado: "activo"
  }));
};

export const getCliente = async (id) => {
  const cliente = await model.getById(id);

  if (!cliente) {
    throw new Error("Cliente no encontrado");
  }

  return cliente;
};