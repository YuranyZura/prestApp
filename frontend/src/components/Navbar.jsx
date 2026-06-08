import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#2563eb",
        color: "#fff",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "15px",
        marginBottom: "30px",
      }}
    >
      {/* Logo */}
      <h2
        style={{
          margin: 0,
        }}
      >
        PrestApp
      </h2>

      {/* Menú */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link style={linkStyle} to="/dashboard">
          🏠 Inicio
        </Link>

        <Link style={linkStyle} to="/clientes">
          👥 Clientes
        </Link>

        <Link style={linkStyle} to="/prestamos">
          💰 Préstamos
        </Link>

        <Link style={linkStyle} to="/pagos">
          📅 Pagos
        </Link>

        {/* Usuario */}
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {usuario.nombre || "Usuario"}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={logoutButton}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500",
};

const logoutButton = {
  background: "#dc2626",
  border: "none",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Navbar;