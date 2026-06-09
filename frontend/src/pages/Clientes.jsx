import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from "../services/clienteservices";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    direccion: "",
    correo: ""
  });

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const data = await obtenerClientes();
      setClientes(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleOpenModal = (cliente = null) => {
    setClienteActual(cliente);
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        cedula: cliente.cedula || "",
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
        correo: cliente.correo || ""
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        cedula: "",
        telefono: "",
        direccion: "",
        correo: ""
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setClienteActual(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.cedula || !formData.telefono) {
      alert("Por favor, completa los campos requeridos (Nombre, Apellido, Cédula, Teléfono)");
      return;
    }

    try {
      if (clienteActual) {
        const res = await actualizarCliente(clienteActual.id_cliente, formData);
        if (res && res.success) {
          alert("Cliente actualizado correctamente");
          handleCloseModal();
          fetchClientes();
        } else {
          alert(res?.message || "Error al actualizar cliente");
        }
      } else {
        const res = await crearCliente(formData);
        if (res && res.success) {
          alert("Cliente registrado correctamente");
          handleCloseModal();
          fetchClientes();
        } else {
          alert(res?.message || "Error al registrar cliente");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error en el servidor");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        const res = await eliminarCliente(id);
        if (res && res.success) {
          alert("Cliente eliminado correctamente");
          fetchClientes();
        } else {
          alert(res?.message || "Error al eliminar cliente");
        }
      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al eliminar el cliente");
      }
    }
  };

  const clientesFiltrados = clientes.filter((c) => {
    const term = busqueda.toLowerCase();
    const nombreCompleto = `${c.nombre} ${c.apellido}`.toLowerCase();
    return (
      nombreCompleto.includes(term) ||
      (c.cedula && String(c.cedula).toLowerCase().includes(term)) ||
      (c.telefono && String(c.telefono).toLowerCase().includes(term))
    );
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9"
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto"
        }}
      >
        <Navbar />

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "25px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
          }}
        >
          <h1 style={{ margin: 0, color: "#0f172a" }}>👥 Gestión de Clientes</h1>
          <p style={{ color: "#64748b", marginTop: "10px" }}>
            Administra los clientes registrados en PrestApp.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px"
          }}
        >
          <button
            onClick={() => handleOpenModal()}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            ➕ Nuevo Cliente
          </button>

          <input
            type="text"
            placeholder="🔍 Buscar cliente por nombre, cédula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              padding: "10px 15px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              width: "300px",
              outline: "none"
            }}
          />
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            overflowX: "auto"
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Cargando clientes...</div>
          ) : clientesFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No se encontraron clientes registrados.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "600px"
              }}
            >
              <thead>
                <tr style={{ background: "#e2e8f0" }}>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Cédula</th>
                  <th style={thStyle}>Teléfono</th>
                  <th style={thStyle}>Dirección</th>
                  <th style={thStyle}>Correo</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientesFiltrados.map((c) => (
                  <tr key={c.id_cliente}>
                    <td style={tdStyle}>{c.nombre} {c.apellido}</td>
                    <td style={tdStyle}>{c.cedula}</td>
                    <td style={tdStyle}>{c.telefono}</td>
                    <td style={tdStyle}>{c.direccion || "-"}</td>
                    <td style={tdStyle}>{c.correo || "-"}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleOpenModal(c)} style={editButton}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(c.id_cliente)} style={deleteButton}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "15px",
              width: "500px",
              maxWidth: "90%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
            }}
          >
            <h2 style={{ marginTop: 0, color: "#0f172a", marginBottom: "20px" }}>
              {clienteActual ? "✏️ Editar Cliente" : "➕ Nuevo Cliente"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Cédula *</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Teléfono *</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    background: "#e2e8f0",
                    color: "#0f172a",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "15px",
  textAlign: "left",
  color: "#0f172a"
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #e2e8f0"
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#475569",
  fontSize: "14px",
  fontWeight: "500"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  outline: "none"
};

const editButton = {
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px"
};

const deleteButton = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

export default Clientes;