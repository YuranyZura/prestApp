import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  obtenerPrestamos,
  crearPrestamo,
  actualizarPrestamo,
  eliminarPrestamo
} from "../services/prestamosservices";
import { obtenerClientes } from "../services/clienteservices";

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [prestamoActual, setPrestamoActual] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: "",
    monto: "",
    interes: "",
    cuotas: "",
    fecha_inicio: new Date().toISOString().split("T")[0],
    estado: "activo"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const dataPrestamos = await obtenerPrestamos();
      const dataClientes = await obtenerClientes();
      setPrestamos(dataPrestamos || []);
      setClientes(dataClientes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (prestamo = null) => {
    setPrestamoActual(prestamo);
    if (prestamo) {
      setFormData({
        id_cliente: prestamo.id_cliente || "",
        monto: prestamo.monto || "",
        interes: prestamo.interes || "",
        cuotas: prestamo.cuotas || "",
        fecha_inicio: prestamo.fecha_inicio ? prestamo.fecha_inicio.split("T")[0] : new Date().toISOString().split("T")[0],
        estado: prestamo.estado || "activo"
      });
    } else {
      setFormData({
        id_cliente: clientes.length > 0 ? clientes[0].id_cliente : "",
        monto: "",
        interes: "10",
        cuotas: "12",
        fecha_inicio: new Date().toISOString().split("T")[0],
        estado: "activo"
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPrestamoActual(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_cliente || !formData.monto || !formData.interes || !formData.cuotas) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      if (prestamoActual) {
        const res = await actualizarPrestamo(prestamoActual.id_prestamo, formData);
        if (res && res.success) {
          alert("Préstamo actualizado correctamente");
          handleCloseModal();
          fetchData();
        } else {
          alert(res?.message || "Error al actualizar préstamo");
        }
      } else {
        const res = await crearPrestamo(formData);
        if (res && res.success) {
          alert("Préstamo registrado correctamente");
          handleCloseModal();
          fetchData();
        } else {
          alert(res?.message || "Error al registrar préstamo");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error en el servidor");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
      try {
        const res = await eliminarPrestamo(id);
        if (res && res.success) {
          alert("Préstamo eliminado correctamente");
          fetchData();
        } else {
          alert(res?.message || "Error al eliminar préstamo");
        }
      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al eliminar el préstamo");
      }
    }
  };

  const prestamosFiltrados = prestamos.filter((p) => {
    const term = busqueda.toLowerCase();
    const nombreCompleto = `${p.nombre || ""} ${p.apellido || ""}`.toLowerCase();
    return (
      nombreCompleto.includes(term) ||
      (p.cedula && String(p.cedula).toLowerCase().includes(term)) ||
      (p.estado && p.estado.toLowerCase().includes(term))
    );
  });

  // Estadísticas del Resumen
  const totalPrestado = prestamos.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);
  const prestamosActivos = prestamos.filter((p) => p.estado === "activo").length;
  const prestamosFinalizados = prestamos.filter((p) => p.estado === "completado" || p.estado === "finalizado").length;

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
          <h1 style={{ margin: 0, color: "#0f172a" }}>💰 Gestión de Préstamos</h1>
          <p style={{ color: "#64748b", marginTop: "10px" }}>
            Administra los préstamos registrados en PrestApp.
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
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            ➕ Nuevo Préstamo
          </button>

          <input
            type="text"
            placeholder="🔍 Buscar préstamo por cliente, cédula..."
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
            <div style={{ textAlign: "center", padding: "40px" }}>Cargando préstamos...</div>
          ) : prestamosFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No se encontraron préstamos registrados.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "700px"
              }}
            >
              <thead>
                <tr style={{ background: "#e2e8f0" }}>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Monto</th>
                  <th style={thStyle}>Interés</th>
                  <th style={thStyle}>Cuotas</th>
                  <th style={thStyle}>Fecha Inicio</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {prestamosFiltrados.map((p) => (
                  <tr key={p.id_prestamo}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: "600" }}>{p.nombre} {p.apellido}</span>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>C.C. {p.cedula}</div>
                    </td>
                    <td style={tdStyle}>{formatCurrency(p.monto)}</td>
                    <td style={tdStyle}>{p.interes}%</td>
                    <td style={tdStyle}>{p.cuotas}</td>
                    <td style={tdStyle}>{p.fecha_inicio ? p.fecha_inicio.split("T")[0] : "-"}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background:
                            p.estado === "activo"
                              ? "#dcfce7"
                              : p.estado === "completado" || p.estado === "finalizado"
                              ? "#e0f2fe"
                              : "#fee2e2",
                          color:
                            p.estado === "activo"
                              ? "#15803d"
                              : p.estado === "completado" || p.estado === "finalizado"
                              ? "#0369a1"
                              : "#b91c1c",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          textTransform: "capitalize"
                        }}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => handleOpenModal(p)} style={editButton}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(p.id_prestamo)} style={deleteButton}>
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
            <span style={{ color: "#64748b", fontSize: "14px" }}>Total Prestado</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#0f172a" }}>{formatCurrency(totalPrestado)}</h2>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>Préstamos Activos</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#16a34a" }}>{prestamosActivos}</h2>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>Préstamos Finalizados</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#2563eb" }}>{prestamosFinalizados}</h2>
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
              {prestamoActual ? "✏️ Editar Préstamo" : "➕ Nuevo Préstamo"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Cliente *</label>
                {prestamoActual ? (
                  <input
                    type="text"
                    value={`${prestamoActual.nombre || ""} ${prestamoActual.apellido || ""}`}
                    disabled
                    style={{ ...inputStyle, background: "#f1f5f9", cursor: "not-allowed" }}
                  />
                ) : (
                  <select
                    name="id_cliente"
                    value={formData.id_cliente}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">-- Seleccionar Cliente --</option>
                    {clientes.map((c) => (
                      <option key={c.id_cliente} value={c.id_cliente}>
                        {c.nombre} {c.apellido} ({c.cedula})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Monto ($) *</label>
                  <input
                    type="number"
                    name="monto"
                    value={formData.monto}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    min="1"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Interés (%) *</label>
                  <input
                    type="number"
                    name="interes"
                    value={formData.interes}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Cuotas *</label>
                  <input
                    type="number"
                    name="cuotas"
                    value={formData.cuotas}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    min="1"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Fecha Inicio *</label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {prestamoActual && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleChange} style={inputStyle}>
                    <option value="activo">Activo</option>
                    <option value="completado">Completado</option>
                    <option value="mora">En Mora</option>
                    <option value="vencido">Vencido</option>
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
                    background: "#16a34a",
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

export default Prestamos;