import React,{useState} from "react";

import API from "../config/api";

function Register() {

  // ==========================================
  // STATES
  // ==========================================

  const [nombre, setNombre] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [contrasena, setContrasena] =
    useState("");

  // ==========================================
  // REGISTER
  // ==========================================

  async function handleRegister(e) {

    e.preventDefault();

    try {

      const response =
        await fetch(
          `${API}/api/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              nombre,
              email,
              contrasena: contrasena
            })
          }
        );

      const data =
        await response.json();

      console.log(data);

      // ======================================
      // VALIDAR RESPUESTA
      // ======================================

      if (!response.ok) {

        alert(
          data.message ||
          "Error registrando usuario"
        );

        return;
      }

      // ======================================
      // GUARDAR TOKEN
      // ======================================

      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );
      }

      // ======================================
      // REDIRECT DASHBOARD
      // ======================================

      window.location.href =
        "/dashboard";

    } catch (error) {

      console.error(error);

      alert(
        "Error del servidor"
      );
    }
  }

  // ==========================================
  // UI
  // ==========================================

  return (

    <div
      style={{
        padding: "40px",
        fontFamily: "Arial"
      }}
    >

      <h1>

        Registro PrestApp

      </h1>

      <form
        onSubmit={handleRegister}
      >

        {/* NOMBRE */}
        <div>

          <input
            type="text"
            placeholder="Nombre"

            value={nombre}

            onChange={(e) =>
              setNombre(
                e.target.value
              )
            }
          />

        </div>

        {/* EMAIL */}
        <div>

          <input
            type="email"
            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

        </div>

        {/* PASSWORD */}
        <div>

          <input
            type="password"
            placeholder="Contraseña"

            value={contrasena}

            onChange={(e) =>
              setContrasena(
                e.target.value
              )
            }
          />

        </div>

        {/* BOTÓN */}
        <button type="submit">

          Registrarse

        </button>

      </form>

    </div>
  );
}

export default Register;