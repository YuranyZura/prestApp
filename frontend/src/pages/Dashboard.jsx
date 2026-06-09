import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { apiGet } from "../config/api";

function Dashboard() {
  const [data, setData] = useState({
    resumen: { clientes: 0, prestamos: 0, pagos: 0 },
    metricas: { ingresos: 0, clientesActivos: 0, mora: 0 },
    ultimosPrestamos: [],
    ultimosPagos: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await apiGet("/dashboard");
      if (res && res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error("ERROR DASHBOARD:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "22px",
          background: "#f1f5f9",
          color: "#0f172a"
        }}
      >
        Cargando dashboard...
      </div>
    );
  }

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
          <h1 style={{ margin: 0, color: "#0f172a" }}>📊 Dashboard Principal</h1>
          <p style={{ color: "#64748b", marginTop: "10px" }}>
            Resumen global del estado de PrestApp.
          </p>
        </div>

        {/* METRICS CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>👥 Total Clientes</span>
            <h1 style={{ margin: "10px 0 0 0", color: "#2563eb" }}>{data.resumen.clientes}</h1>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>💰 Total Préstamos</span>
            <h1 style={{ margin: "10px 0 0 0", color: "#0f172a" }}>{data.resumen.prestamos}</h1>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>💵 Recaudado Total</span>
            <h1 style={{ margin: "10px 0 0 0", color: "#16a34a" }}>{formatCurrency(data.metricas.ingresos)}</h1>
          </div>

          <div style={cardStyle}>
            <span style={{ color: "#64748b", fontSize: "14px" }}>⚠️ Préstamos en Mora</span>
            <h1 style={{ margin: "10px 0 0 0", color: "#ef4444" }}>{data.metricas.mora}</h1>
          </div>
        </div>

        {/* RECENT TABLES */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "25px"
          }}
        >
          {/* ULTIMOS PRESTAMOS */}
          <div style={tableCardStyle}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a" }}>📝 Últimos Préstamos</h3>
            {data.ultimosPrestamos.length === 0 ? (
              <p style={{ color: "#64748b" }}>No hay registros recientes.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
                    <th style={thStyle}>Cliente</th>
                    <th style={thStyle}>Monto</th>
                    <th style={thStyle}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ultimosPrestamos.map((p) => (
                    <tr key={p.id_prestamo} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={tdStyle}>{p.nombre} {p.apellido}</td>
                      <td style={tdStyle}>{formatCurrency(p.monto)}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            background: p.estado === "activo" ? "#dcfce7" : "#fee2e2",
                            color: p.estado === "activo" ? "#15803d" : "#b91c1c",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "600",
                            textTransform: "capitalize"
                          }}
                        >
                          {p.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ULTIMOS PAGOS */}
          <div style={tableCardStyle}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a" }}>💵 Recaudos Recientes</h3>
            {data.ultimosPagos.length === 0 ? (
              <p style={{ color: "#64748b" }}>No hay registros recientes.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
                    <th style={thStyle}>Cliente</th>
                    <th style={thStyle}>Valor</th>
                    <th style={thStyle}>Método</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ultimosPagos.map((pg) => (
                    <tr key={pg.id_pago} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={tdStyle}>{pg.nombre} {pg.apellido}</td>
                      <td
  style={{
    ...tdStyle,
    color: "#16a34a",
    fontWeight: "600"
  }}
>
  {formatCurrency(pg.monto_pagado)}
</td>

<td
  style={{
    ...tdStyle,
    textTransform: "capitalize"
  }}
>
  {pg.metodo_pago}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const tableCardStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  overflowX: "auto"
};

const thStyle = {
  padding: "10px",
  color: "#475569",
  fontSize: "13px",
  fontWeight: "600"
};

const tdStyle = {
  padding: "10px",
  color: "#0f172a",
  fontSize: "14px"
};

export default Dashboard;