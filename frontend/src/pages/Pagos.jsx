import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Pagos() {
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
            📅 Gestión de Pagos
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px"
            }}
          >
            Administra y registra los pagos realizados por los clientes.
          </p>
        </div>

        {/* BOTÓN NUEVO PAGO */}
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
            ➕ Registrar Pago
          </button>
        </div>

        {/* TABLA DE PAGOS */}
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
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Préstamo</th>
                <th style={thStyle}>Fecha</th>
                <th style={thStyle}>Valor</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tdStyle}>Juan Pérez</td>
                <td style={tdStyle}>#PRE001</td>
                <td style={tdStyle}>07/06/2026</td>
                <td style={tdStyle}>$150.000</td>
                <td style={tdStyle}>Pagado</td>

                <td style={tdStyle}>
                  <button style={viewButton}>
                    Ver
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
            <h3>💵 Pagos del Día</h3>
            <h2>$150.000</h2>
          </div>

          <div style={cardStyle}>
            <h3>📊 Total Recaudado</h3>
            <h2>$150.000</h2>
          </div>

          <div style={cardStyle}>
            <h3>⏳ Pagos Pendientes</h3>
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

const viewButton = {
  background: "#2563eb",
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

export default Pagos;