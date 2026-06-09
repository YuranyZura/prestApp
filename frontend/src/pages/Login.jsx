import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../config/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    const correo = email.trim();
    const contrasena = password.trim();

    if (!correo || !contrasena) {
      alert("Correo y contraseña son obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert("Ingrese un correo válido");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error iniciando sesión");
        return;
      }

      if (!data.token) {
        alert("No se recibió token del servidor");
        return;
      }

      localStorage.setItem("token", data.token);
      if (data.usuario) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
      }
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error Login:", error);
      alert("No fue posible conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "20px",
        fontFamily: "'Outfit', sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          boxSizing: "border-box"
        }}
      >
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "36px",
              margin: "0 0 10px 0",
              color: "#0f172a",
              fontWeight: "800",
              letterSpacing: "-1px"
            }}
          >
            PrestApp
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "15px" }}>
            Plataforma financiera inteligente para préstamos.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Correo Electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={labelStyle}>Contraseña</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{
                  background: "#e2e8f0",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0 15px",
                  cursor: "pointer",
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                {mostrarPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: "#0f172a",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "15px",
              transition: "transform 0.2s",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)"
            }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <div style={{ margin: "20px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <hr style={{ flex: 1, border: 0, borderTop: "1px solid #e2e8f0" }} />
          <span style={{ padding: "0 10px", color: "#94a3b8", fontSize: "14px" }}>¿No tienes cuenta?</span>
          <hr style={{ flex: 1, border: 0, borderTop: "1px solid #e2e8f0" }} />
        </div>

        <Link to="/register" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "14px",
              border: "2px solid #2563eb",
              borderRadius: "12px",
              background: "transparent",
              color: "#2563eb",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Registrarse como Trabajador
          </button>
        </Link>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#475569",
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "left"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  outline: "none",
  fontSize: "15px",
  color: "#0f172a",
  background: "#f8fafc"
};

export default Login;