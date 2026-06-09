import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  obtenerTrabajadores,
  crearTrabajador,
  actualizarTrabajador,
  eliminarTrabajador
} from "../services/trabajadoresservices";

function Trabajadores() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [trabajadorActual, setTrabajadorActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    direccion: "",
    cargo: "cobradores",
    salario: "",
    estado: "activo"
  });

  const fetchTrabajadores = async () => {
    setLoading(true);
    try {
      const data = await obtenerTrabajadores();
      setTrabajadores(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrabajadores();
  }, []);

  const handleOpenModal = (trabajador = null) => {
    setTrabajadorActual(trabajador);
    if (trabajador) {
      setFormData({
        nombre: trabajador.nombre || "",
        apellido: trabajador.apellido || "",
        correo: trabajador.correo || "",
        telefono: trabajador.telefono || "",
        direccion: trabajador.direccion || "",
        cargo: trabajador.cargo || "cobradores",
        salario: trabajador.salario || "",
        estado: trabajador.estado || "activo"
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        direccion: "",
        cargo: "cobradores",
        salario: "",
        estado: "activo"
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTrabajadorActual(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.correo || !formData.telefono) {
      alert("Por favor, completa los campos requeridos.");
      return;
    }

    try {
      if (trabajadorActual) {
        const res = await actualizarTrabajador(trabajadorActual.id_trabajador, formData);
        if (res && res.success) {
          alert("Trabajador actualizado correctamente");
          handleCloseModal();
          fetchTrabajadores();
        } else {
          alert(res?.message || "Error al actualizar trabajador");
        }
      } else {
        const res = await crearTrabajador(formData);
        if (res && res.success) {
          alert("Trabajador registrado correctamente");
          handleCloseModal();
          fetchTrabajadores();
        } else {
          alert(res?.message || "Error al registrar trabajador");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error en el servidor");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este trabajador?")) {
      try {
        const res = await eliminarTrabajador(id);
        if (res && res.success) {
          alert("Trabajador eliminado correctamente");
          fetchTrabajadores();
        } else {
          alert(res?.message || "Error al eliminar trabajador");
        }
      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al eliminar el trabajador");
      }
    }
  };

  const trabajadoresFiltrados = trabajadores.filter((t) => {
    const term = busqueda.toLowerCase();
    const nombreCompleto = `${t.nombre || ""} ${t.apellido || ""}`.toLowerCase();
    const cargo = (t.cargo || "").toLowerCase();
    return (
      nombreCompleto.includes(term) ||
      cargo.includes(term) ||
      (t.telefono && String(t.telefono).toLowerCase().includes(term))
    );
  });

  // Estadísticas
  const totalTrabajadores = trabajadores.length;
  const trabajadoresActivos = trabajadores.filter((t) => t.estado === "activo").length;
  const trabajadoresInactivos = trabajadores.filter((t) => t.estado !== "activo").length;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val);
  };

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
          <h1 style={{ margin: 0, color: "#0f172a" }}>👨‍💼 Gestión de Trabajadores</h1>
          <p style={{ color: "#64748b", marginTop: "10px" }}>
            Administra los trabajadores registrados en PrestApp.
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
            ➕ Nuevo Trabajador
          </button>

          <input
            type="text"
            placeholder="🔍 Buscar trabajador por nombre, cargo..."
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
            <div style={{ textAlign: "center", padding: "40px" }}>Cargando trabajadores...</div>
          ) : trabajadoresFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No se encontraron trabajadores registrados.
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
                  <th style={thStyle}>Cargo</th>
                  <th style={thStyle}>Salario</th>
                  <th style={thStyle}>Teléfono</th>
                  <th style={thStyle}>Correo</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {trabajadoresFiltrados.map((t) => (
                  <tr key={t.id_trabajador}>
                    <td style={tdStyle}>{t.nombre} {t.apellido}</td>
                    <td style={tdStyle} style={{ textTransform: "capitalize" }}>{t.cargo}</td>
                    <td style={tdStyle}>{t.salario ? formatCurrency(t.salario) : "-"}</td>
                    <td style={tdStyle}>{t.telefono}</td>
                    <td style={tdStyle}>{t.correo}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: t.estado === "activo" ? "#dcfce7" : "#fee2e2",
                          color: t.estado === "activo" ? "#15803d" : "#b91c1c",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          textTransform: "capitalize"
                        }}
                      >
                        {t.estado}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => handleOpenModal(t)} style={editButton}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(t.id_trabajador)} style={deleteButton}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* RESUMEN */}
        <div
          style={{
            marginTop: "25px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px"
          }}
        >
          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>👥 Total Trabajadores</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#0f172a" }}>{totalTrabajadores}</h2>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>✅ Activos</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#16a34a" }}>{trabajadoresActivos}</h2>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>⛔ Inactivos</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#ef4444" }}>{trabajadoresInactivos}</h2>
          </div>
        </div>
      </div>

      {/* MODAL */}
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
              {trabajadorActual ? "✏️ Editar Trabajador" : "➕ Nuevo Trabajador"}
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
                  <label style={labelStyle}>Correo Electrónico *</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
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

              <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Cargo *</label>
                  <select name="cargo" value={formData.cargo} onChange={handleChange} style={inputStyle} required>
                    <option value="administrador">Administrador</option>
                    <option value="cobradores">Cobrador</option>
                    <option value="auxiliar">Auxiliar</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Salario (COP)</label>
                  <input
                    type="number"
                    name="salario"
                    value={formData.salario}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
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

              {trabajadorActual && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleChange} style={inputStyle}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              )}

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

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

export default Trabajadores;