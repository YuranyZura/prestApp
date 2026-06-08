import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        background: "#0f172a",
        color: "#fff",
        minHeight: "100vh",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "28px" }}>
          PrestApp
        </h1>

        <p style={{ color: "#94a3b8" }}>
          Sistema financiero
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <Link to="/dashboard" style={menuButton}>
          🏠 Dashboard
        </Link>

        <Link to="/clientes" style={menuButton}>
          👥 Clientes
        </Link>

        <Link to="/prestamos" style={menuButton}>
          💰 Préstamos
        </Link>

        <Link to="/pagos" style={menuButton}>
          📅 Pagos
        </Link>

        <Link to="/reportes" style={menuButton}>
          📊 Reportes
        </Link>

        <Link to="/configuracion" style={menuButton}>
          ⚙️ Configuración
        </Link>
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "30px"
        }}
      >
        <p
          style={{
            color: "#94a3b8",
            fontSize: "14px"
          }}
        >
          PrestApp v1.0
        </p>
      </div>
    </div>
  );
}

const menuButton = {
  background: "transparent",
  border: "none",
  color: "#fff",
  textAlign: "left",
  padding: "15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  textDecoration: "none",
  transition: "0.3s"
};

export default Sidebar;