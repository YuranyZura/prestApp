import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import API from "../config/api";
import Navbar from "../components/Navbar";
function Dashboard() {

  // ==========================================
  // STATE
  // ==========================================

  const [stats, setStats] = useState({

    totalPrestamos: 0,
    clientes: 0,
    pagosHoy: 0,
    mora: 0
  });

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // USE EFFECT
  // ==========================================

  useEffect(() => {

    verificarLogin();

    obtenerDashboard();

  }, []);

  // ==========================================
  // VERIFICAR TOKEN
  // ==========================================

  const verificarLogin = () => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      window.location.href =
        "/login";
    }
  };

  // ==========================================
  // OBTENER DASHBOARD
  // ==========================================

  const obtenerDashboard = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(

        `${API}/dashboard`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      // ==========================================
      // GUARDAR DATOS
      // ==========================================

      setStats({

        totalPrestamos:
          res.data.totalPrestamos || 0,

        clientes:
          res.data.clientes || 0,

        pagosHoy:
          res.data.pagosHoy || 0,

        mora:
          res.data.mora || 0
      });

    }

    catch (error) {

      console.error(
        "ERROR DASHBOARD:",
        error
      );
    }

    finally {

      setLoading(false);
    }
  };

  

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "22px"
        }}
      >

        Cargando dashboard...

      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9"
      }}
    >

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO */}
      <div
        style={{
          flex: 1,
          padding: "30px"
        }}
      >

        {/* NAVBAR */}
        <Navbar />


        {/* CARDS */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",

            gap: "20px"
          }}
        >

          {/* TOTAL PRESTAMOS */}
          <div style={cardStyle}>

            <h3>
              💰 Total préstamos
            </h3>

            <h1>
              $
              {stats.totalPrestamos}
            </h1>

          </div>

          {/* CLIENTES */}
          <div style={cardStyle}>

            <h3>
              👥 Clientes
            </h3>

            <h1>
              {stats.clientes}
            </h1>

          </div>

          {/* PAGOS */}
          <div style={cardStyle}>

            <h3>
              📅 Pagos hoy
            </h3>

            <h1>
              $
              {stats.pagosHoy}
            </h1>

          </div>

          {/* MORA */}
          <div style={cardStyle}>

            <h3>
              📊 Mora
            </h3>

            <h1>
              {stats.mora}%
            </h1>

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
                      <td style={tdStyle} style={{ color: "#16a34a", fontWeight: "600", padding: "10px" }}>
                        {formatCurrency(pg.monto_pagado)}
                      </td>
                      <td style={tdStyle} style={{ textTransform: "capitalize", padding: "10px" }}>
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

// ==========================================
// ESTILOS
// ==========================================

const cardStyle = {

  background: "#fff",

  padding: "25px",

  borderRadius: "15px",

  boxShadow:
    "0 2px 10px rgba(0,0,0,0.05)"
};

export default Dashboard;