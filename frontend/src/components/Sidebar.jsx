import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const getMenuButtonStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      background: isActive ? "#2563eb" : "transparent",
      color: "#fff",
      textAlign: "left",
      padding: "12px 15px",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "16px",
      textDecoration: "none",
      transition: "background 0.2s, transform 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontWeight: isActive ? "600" : "400"
    };
  };

  return (
    <div
      style={{
        width: "260px",
        background: "#0f172a",
        color: "#fff",
        minHeight: "100vh",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
        boxSizing: "border-box"
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "28px", margin: 0, fontWeight: "700", letterSpacing: "-0.5px" }}>
          PrestApp
        </h1>
        <p style={{ color: "#94a3b8", margin: "5px 0 0 0", fontSize: "14px" }}>
          Sistema Financiero
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        <Link to="/dashboard" style={getMenuButtonStyle("/dashboard")}>
          <span>🏠</span> Dashboard
        </Link>

        <Link to="/clientes" style={getMenuButtonStyle("/clientes")}>
          <span>👥</span> Clientes
        </Link>

        <Link to="/prestamos" style={getMenuButtonStyle("/prestamos")}>
          <span>💰</span> Préstamos
        </Link>

        <Link to="/pagos" style={getMenuButtonStyle("/pagos")}>
          <span>📅</span> Pagos
        </Link>

        <Link to="/cobranza" style={getMenuButtonStyle("/cobranza")}>
          <span>💵</span> Cobranza
        </Link>

        <Link to="/trabajadores" style={getMenuButtonStyle("/trabajadores")}>
          <span>👨‍💼</span> Trabajadores
        </Link>
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "30px",
          borderTop: "1px solid #1e293b"
        }}
      >
        <p
          style={{
            color: "#64748b",
            fontSize: "13px",
            margin: 0
          }}
        >
          PrestApp v1.0
        </p>
      </div>
    </div>
  );
}

export default Sidebar;