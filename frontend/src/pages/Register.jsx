import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../config/api";

function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const cedulaLimpia = cedula.trim();
    const telefonoLimpio = telefono.trim();
    const correoLimpio = email.trim();

    if (
      !nombreLimpio ||
      !apellidoLimpio ||
      !cedulaLimpia ||
      !telefonoLimpio ||
      !correoLimpio ||
      !contrasena ||
      !confirmarContrasena
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoLimpio)) {
      alert("Ingrese un correo electrónico válido");
      return;
    }

    const cedulaRegex = /^[0-9]{5,20}$/;
    if (!cedulaRegex.test(cedulaLimpia)) {
      alert("Ingrese una cédula válida");
      return;
    }

    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!telefonoRegex.test(telefonoLimpio)) {
      alert("Ingrese un número telefónico válido");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      alert("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreLimpio,
          apellido: apellidoLimpio,
          cedula: cedulaLimpia,
          telefono: telefonoLimpio,
          correo: correoLimpio,
          contrasena
        })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error registrando usuario");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
        }
        alert("Usuario registrado correctamente");
        window.location.href = "/dashboard";
      } else {
        alert("Usuario registrado. Inicie sesión.");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
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
        padding: "30px 20px",
        fontFamily: "'Outfit', sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          boxSizing: "border-box",
          textAlign: "center"
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "36px",
              margin: "0 0 10px 0",
              color: "#0f172a",
              fontWeight: "800",
              letterSpacing: "-1px"
            }}
          >
            Crear Cuenta
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "15px" }}>
            Únete a PrestApp como cobrador / trabajador.
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Nombre *</label>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Apellido *</label>
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Cédula *</label>
              <input
                type="text"
                placeholder="Cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Teléfono *</label>
              <input
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Correo Electrónico *</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Contraseña *</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="Mín. 8 caracteres, 1 número, 1 mayúscula"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={viewButtonStyle}
              >
                {mostrarPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={labelStyle}>Confirmar Contraseña *</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type={mostrarConfirmar ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                style={viewButtonStyle}
              >
                {mostrarConfirmar ? "Ocultar" : "Ver"}
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
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)"
            }}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div style={{ color: "#64748b", fontSize: "14px" }}>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
            Inicia sesión aquí
          </Link>
        </div>
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
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  outline: "none",
  fontSize: "15px",
  color: "#0f172a",
  background: "#f8fafc"
};

const viewButtonStyle = {
  background: "#e2e8f0",
  border: "none",
  borderRadius: "12px",
  padding: "0 15px",
  cursor: "pointer",
  color: "#475569",
  fontSize: "14px",
  fontWeight: "600"
};

export default Register;