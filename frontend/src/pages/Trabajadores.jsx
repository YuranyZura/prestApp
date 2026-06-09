import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Trabajadores() {
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

        {/* CABECERA */}
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "25px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#0f172a"
            }}
          >
            👨‍💼 Gestión de Trabajadores
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px"
            }}
          >
            Administra los trabajadores registrados en PrestApp.
          </p>
        </div>

        {/* BOTÓN NUEVO TRABAJADOR */}
        <div
          style={{
            marginBottom: "20px"
          }}
        >
          <button
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            ➕ Nuevo Trabajador
          </button>
        </div>

        {/* TABLA */}
        <div
          style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#e2e8f0"
                }}
              >
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Documento</th>
                <th style={thStyle}>Cargo</th>
                <th style={thStyle}>Teléfono</th>
                <th style={thStyle}>Correo</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tdStyle}>Administrador Demo</td>
                <td style={tdStyle}>123456789</td>
                <td style={tdStyle}>Administrador</td>
                <td style={tdStyle}>3001234567</td>
                <td style={tdStyle}>admin@prestapp.com</td>
                <td style={tdStyle}>Activo</td>

                <td style={tdStyle}>
                  <button style={editButton}>
                    Editar
                  </button>

                  <button style={deleteButton}>
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RESUMEN */}
        <div
          style={{
            marginTop: "25px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px"
          }}
        >
          <div style={cardStyle}>
            <h3>👥 Total Trabajadores</h3>
            <h2>1</h2>
          </div>

          <div style={cardStyle}>
            <h3>✅ Activos</h3>
            <h2>1</h2>
          </div>

          <div style={cardStyle}>
            <h3>⛔ Inactivos</h3>
            <h2>0</h2>
          </div>
        </div>
      </div>
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

const editButton = {
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px"
};

const deleteButton = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

export default Trabajadores;