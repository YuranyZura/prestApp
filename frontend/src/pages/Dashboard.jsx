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
  <div>
    <h1>Dashboard funcionando</h1>
    <p>Total préstamos: {stats.totalPrestamos}</p>
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