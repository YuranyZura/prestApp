import React, { useState } from "react";

import { Link } from "react-router-dom";

import API from "../config/api";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function handleLogin(e) {

    e.preventDefault();

    try {

      const response =
        await fetch(
          `${API}/api/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              correo: email,
              contrasena: password
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          "Error iniciando sesión"
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      window.location.href =
        "/dashboard";

    } catch (error) {

      console.error(error);

      alert(
        "Error del servidor"
      );
    }
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b)",
        padding: "20px"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.3)",
          textAlign: "center"
        }}
      >

        <h1
          style={{
            fontSize: "40px",
            marginBottom: "10px",
            color: "#0f172a"
          }}
        >
          PrestApp
        </h1>

        <p
          style={{
            color: "#555",
            marginBottom: "30px"
          }}
        >
          Plataforma inteligente para
          gestión de préstamos.
        </p>

        <form
          onSubmit={handleLogin}
        >

          <input
            type="email"
            placeholder="Correo electrónico"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              border:
                "1px solid #ccc",
              fontSize: "16px"
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "10px",
              border:
                "1px solid #ccc",
              fontSize: "16px"
            }}
          />

          <button
            type="submit"

            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: "#0f172a",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              marginBottom: "15px"
            }}
          >

            Iniciar sesión

          </button>

        </form>

        <Link
          to="/register"

          style={{
            textDecoration: "none"
          }}
        >

          <button
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >

            Crear cuenta

          </button>

        </Link>

      </div>

    </div>
  );
}

export default Login;