import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const getInitials = () => {
    if (usuario.nombre) {
      return (usuario.nombre[0] + (usuario.apellido ? usuario.apellido[0] : "")).toUpperCase();
    }
    return "U";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        position: "relative"
      }}
    >
      {/* Saludo */}
      <div>
        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "20px", fontWeight: "600" }}>
          ¡Hola, {usuario.nombre || "Usuario"}! 👋
        </h3>
        <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>
          Qué bueno tenerte de vuelta.
        </p>
      </div>

      {/* Usuario Dropdown */}
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            background: "#fff",
            padding: "8px 16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}
        >
          <div
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "600",
              fontSize: "14px"
            }}
          >
            {getInitials()}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
              {usuario.nombre} {usuario.apellido || ""}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", textTransform: "capitalize" }}>
              {usuario.rol || "Trabajador"}
            </div>
          </div>
          <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "5px" }}>▼</span>
        </div>

        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              right: 0,
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              width: "180px",
              zIndex: 100,
              padding: "8px 0",
              border: "1px solid #e2e8f0"
            }}
          >
            <div style={{ padding: "8px 16px", fontSize: "12px", color: "#64748b" }}>
              C.C. {usuario.cedula || "-"}
            </div>
            <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "4px 0" }} />
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                textAlign: "left",
                padding: "10px 16px",
                color: "#dc2626",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              🚪 Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;