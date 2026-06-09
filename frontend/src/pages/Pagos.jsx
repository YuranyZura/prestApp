import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  obtenerPagos,
  crearPago,
  eliminarPago
} from "../services/pagoService";
import { obtenerPrestamos } from "../services/prestamosservices";

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_prestamo: "",
    monto_pagado: "",
    metodo_pago: "efectivo"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const dataPagos = await obtenerPagos();
      const dataPrestamos = await obtenerPrestamos();
      // filter only active loans for payment creation dropdown
      setPrestamos((dataPrestamos || []).filter(p => p.estado === "activo"));
      setPagos(dataPagos?.pagos || dataPagos || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      id_prestamo: prestamos.length > 0 ? prestamos[0].id_prestamo : "",
      monto_pagado: "",
      metodo_pago: "efectivo"
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_prestamo || !formData.monto_pagado || !formData.metodo_pago) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const res = await crearPago(formData);
      if (res && res.ok) {
        alert("Pago registrado correctamente");
        handleCloseModal();
        fetchData();
      } else {
        alert(res?.mensaje || "Error al registrar el pago");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al registrar el pago");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pago?")) {
      try {
        const res = await eliminarPago(id);
        if (res && res.ok) {
          alert("Pago eliminado correctamente");
          fetchData();
        } else {
          alert(res?.mensaje || "Error al eliminar el pago");
        }
      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al eliminar el pago");
      }
    }
  };

  const pagosFiltrados = pagos.filter((p) => {
    const term = busqueda.toLowerCase();
    const nombreCompleto = `${p.nombre || ""} ${p.apellido || ""}`.toLowerCase();
    const metodo = (p.metodo_pago || "").toLowerCase();
    return (
      nombreCompleto.includes(term) ||
      metodo.includes(term) ||
      String(p.id_prestamo).includes(term)
    );
  });

  // Estadísticas del Resumen
  const totalRecaudado = pagos.reduce((sum, p) => sum + parseFloat(p.monto_pagado || 0), 0);

  const hoyStr = new Date().toISOString().split("T")[0];
  const pagosHoy = pagos
    .filter((p) => p.fecha_pago && p.fecha_pago.split("T")[0] === hoyStr)
    .reduce((sum, p) => sum + parseFloat(p.monto_pagado || 0), 0);

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
          <h1 style={{ margin: 0, color: "#0f172a" }}>📅 Gestión de Pagos</h1>
          <p style={{ color: "#64748b", marginTop: "10px" }}>
            Administra y registra los pagos realizados por los clientes.
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
            onClick={handleOpenModal}
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
            ➕ Registrar Pago
          </button>

          <input
            type="text"
            placeholder="🔍 Buscar pago por cliente, método..."
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
            <div style={{ textAlign: "center", padding: "40px" }}>Cargando pagos...</div>
          ) : pagosFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No se encontraron pagos registrados.
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
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Préstamo #</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Método</th>
                  <th style={thStyle}>Valor</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {pagosFiltrados.map((p) => (
                  <tr key={p.id_pago}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: "600" }}>{p.nombre} {p.apellido}</span>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Tel. {p.telefono}</div>
                    </td>
                    <td style={tdStyle}>#{p.id_prestamo}</td>
                    <td style={tdStyle}>{p.fecha_pago ? p.fecha_pago.split("T")[0] : "-"}</td>
                    <td style={tdStyle} style={{ textTransform: "capitalize" }}>{p.metodo_pago}</td>
                    <td style={tdStyle} style={{ color: "#16a34a", fontWeight: "600" }}>
                      {formatCurrency(p.monto_pagado)}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => handleDelete(p.id_pago)} style={deleteButton}>
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
            <span style={{ color: "#64748b", fontSize: "14px" }}>💵 Pagos del Día</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#16a34a" }}>{formatCurrency(pagosHoy)}</h2>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>📊 Total Recaudado</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#2563eb" }}>{formatCurrency(totalRecaudado)}</h2>
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
              💵 Registrar Pago
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Préstamo Activo *</label>
                <select
                  name="id_prestamo"
                  value={formData.id_prestamo}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">-- Seleccionar Préstamo --</option>
                  {prestamos.map((p) => (
                    <option key={p.id_prestamo} value={p.id_prestamo}>
                      #{p.id_prestamo} - {p.nombre} {p.apellido} (Monto: {formatCurrency(p.monto)})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Monto a Pagar ($) *</label>
                <input
                  type="number"
                  name="monto_pagado"
                  value={formData.monto_pagado}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                  min="1"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Método de Pago *</label>
                <select
                  name="metodo_pago"
                  value={formData.metodo_pago}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="nequi">Nequi</option>
                  <option value="daviplata">Daviplata</option>
                </select>
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
                  Registrar
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

export default Pagos;