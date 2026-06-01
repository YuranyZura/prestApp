import React from "react";

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

      {/* LOGO */}
      <div
        style={{
          marginBottom: "40px"
        }}
      >

        <h1
          style={{
            fontSize: "28px"
          }}
        >

          PrestApp

        </h1>

        <p
          style={{
            color: "#94a3b8"
          }}
        >

          Sistema financiero

        </p>

      </div>

      {/* MENU */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >

        <button style={menuButton}>
          🏠 Dashboard
        </button>

        <button style={menuButton}>
          👥 Clientes
        </button>

        <button style={menuButton}>
          💰 Préstamos
        </button>

        <button style={menuButton}>
          📅 Pagos
        </button>

        <button style={menuButton}>
          📊 Reportes
        </button>

        <button style={menuButton}>
          ⚙️ Configuración
        </button>

      </div>

      {/* FOOTER */}
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

// ==========================================
// ESTILO BOTONES
// ==========================================

const menuButton = {

  background: "transparent",
  border: "none",
  color: "#fff",
  textAlign: "left",
  padding: "15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "0.3s",

};

export default Sidebar;