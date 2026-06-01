import { useEffect, useState } from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";

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

        "http://localhost:4000/api/dashboard",

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
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href =
      "/login";
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
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "15px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "30px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.05)"
          }}
        >

          <h1>
            Dashboard
          </h1>

          <button
            onClick={handleLogout}

            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding:
                "10px 20px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >

            Cerrar sesión

          </button>

        </div>

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