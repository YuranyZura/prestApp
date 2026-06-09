import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { obtenerPrestamos } from "../services/prestamosservices";
import { crearPago, obtenerPagos } from "../services/pagoService";

function Cobranza() {
  const [prestamos, setPrestamos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [montoCobro, setMontoCobro] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");

  const fetchData = async () => {
    setLoading(true);
    try {
      const dataPrestamos = await obtenerPrestamos();
      const dataPagos = await obtenerPagos();
      setPrestamos(dataPrestamos || []);
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

  const handleOpenCobroModal = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    // Suggest payment amount: (loan amount * (1 + interest/100)) / cuotas
    const totalConInteres = parseFloat(prestamo.monto) * (1 + parseFloat(prestamo.interes) / 100);
    const valorCuota = Math.round(totalConInteres / parseFloat(prestamo.cuotas));
    setMontoCobro(valorCuota.toString());
    setMetodoPago("efectivo");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPrestamoSeleccionado(null);
    setMontoCobro("");
  };

  const handleSubmitCobro = async (e) => {
    e.preventDefault();
    if (!prestamoSeleccionado || !montoCobro) {
      alert("Por favor ingrese todos los datos.");
      return;
    }

    try {
      const res = await crearPago({
        id_prestamo: prestamoSeleccionado.id_prestamo,
        monto_pagado: montoCobro,
        metodo_pago: metodoPago
      });

      if (res && res.ok) {
        alert("Cobro registrado correctamente");
        handleCloseModal();
        fetchData();
      } else {
        alert(res?.mensaje || "Error al registrar el cobro");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error en el servidor");
    }
  };

  const prestamosPendientes = prestamos.filter((p) => p.estado === "activo" || p.estado === "mora");

  const prestamosFiltrados = prestamosPendientes.filter((p) => {
    const term = busqueda.toLowerCase();
    const nombreCompleto = `${p.nombre || ""} ${p.apellido || ""}`.toLowerCase();
    return (
      nombreCompleto.includes(term) ||
      (p.cedula && String(p.cedula).toLowerCase().includes(term))
    );
  });

  // Estadísticas del Resumen
  const hoyStr = new Date().toISOString().split("T")[0];
  const recaudadoHoy = pagos
    .filter((p) => p.fecha_pago && p.fecha_pago.split("T")[0] === hoyStr)
    .reduce((sum, p) => sum + parseFloat(p.monto_pagado || 0), 0);

  const totalCuotasPendientes = prestamosPendientes.length;
  const clientesMora = prestamos.filter((p) => p.estado === "mora" || p.estado === "vencido").length;

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
          <h1 style={{ margin: 0, color: "#0f172a" }}>💵 Gestión de Cobranza</h1>
          <p style={{ color: "#64748b", marginTop: "10px" }}>
            Consulta préstamos activos y registra los cobros directamente.
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
          <input
            type="text"
            placeholder="🔍 Buscar cliente por nombre, cédula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              padding: "10px 15px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              width: "320px",
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
            <div style={{ textAlign: "center", padding: "40px" }}>Cargando datos...</div>
          ) : prestamosFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No hay préstamos con saldo pendiente de cobro.
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
                  <th style={thStyle}>Préstamo #</th>
                  <th style={thStyle}>Monto Prestado</th>
                  <th style={thStyle}>Interés</th>
                  <th style={thStyle}>Cuotas</th>
                  <th style={thStyle}>Fecha Inicio</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Acción</th>
                </tr>
              </thead>

              <tbody>
                {prestamosFiltrados.map((p) => (
                  <tr key={p.id_prestamo}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: "600" }}>{p.nombre} {p.apellido}</span>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>C.C. {p.cedula}</div>
                    </td>
                    <td style={tdStyle}>#{p.id_prestamo}</td>
                    <td style={tdStyle}>{formatCurrency(p.monto)}</td>
                    <td style={tdStyle}>{p.interes}%</td>
                    <td style={tdStyle}>{p.cuotas}</td>
                    <td style={tdStyle}>{p.fecha_inicio ? p.fecha_inicio.split("T")[0] : "-"}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: p.estado === "activo" ? "#dcfce7" : "#fee2e2",
                          color: p.estado === "activo" ? "#15803d" : "#b91c1c",
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
                      <button onClick={() => handleOpenCobroModal(p)} style={payButton}>
                        💵 Recibir Pago
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
            <span style={{ color: "#64748b", fontSize: "14px" }}>💰 Recaudado Hoy</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#16a34a" }}>{formatCurrency(recaudadoHoy)}</h2>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>📋 Préstamos Cobrables</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#2563eb" }}>{totalCuotasPendientes}</h2>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>⚠️ Clientes en Mora</span>
            <h2 style={{ margin: "5px 0 0 0", color: "#ef4444" }}>{clientesMora}</h2>
          </div>
        </div>
      </div>

      {/* COBRO MODAL */}
      {modalOpen && prestamoSeleccionado && (
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
              width: "450px",
              maxWidth: "90%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
            }}
          >
            <h2 style={{ marginTop: 0, color: "#0f172a", marginBottom: "10px" }}>
              💵 Registrar Cobro
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              Préstamo #{prestamoSeleccionado.id_prestamo} de{" "}
              <strong>{prestamoSeleccionado.nombre} {prestamoSeleccionado.apellido}</strong>.
            </p>

            <form onSubmit={handleSubmitCobro}>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Monto a Cobrar ($) *</label>
                <input
                  type="number"
                  value={montoCobro}
                  onChange={(e) => setMontoCobro(e.target.value)}
                  style={inputStyle}
                  required
                  min="1"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Método de Pago *</label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
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
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Registrar Cobro
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

const payButton = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

export default Cobranza;