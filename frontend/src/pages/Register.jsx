import React, { useState } from "react";
import API from "../config/api";

function Register() {
  // ==========================================
  // STATES
  // ==========================================

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] =
    useState("");

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [mostrarConfirmar, setMostrarConfirmar] =
    useState(false);

  // ==========================================
  // REGISTER
  // ==========================================

  async function handleRegister(e) {
    e.preventDefault();

  // ==========================================
  // LIMPIAR DATOS
  // ==========================================

  const nombreLimpio =
    nombre.trim();

  const apellidoLimpio =
    apellido.trim();

  const cedulaLimpia =
    cedula.trim();

  const telefonoLimpio =
    telefono.trim();

  const correoLimpio =
    email.trim();

  // ==========================================
  // CAMPOS OBLIGATORIOS
  // ==========================================

  if (
    !nombreLimpio ||
    !apellidoLimpio ||
    !cedulaLimpia ||
    !telefonoLimpio ||
    !correoLimpio ||
    !contrasena ||
    !confirmarContrasena
  ) {

    alert(
      "Todos los campos son obligatorios"
    );

    return;
  }

  // ==========================================
  // VALIDAR EMAIL
  // ==========================================

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailRegex.test(
      correoLimpio
    )
  ) {

    alert(
      "Ingrese un correo electrónico válido"
    );

    return;
  }

  // ==========================================
  // VALIDAR CÉDULA
  // ==========================================

  const cedulaRegex =
    /^[0-9]{5,20}$/;

  if (
    !cedulaRegex.test(
      cedulaLimpia
    )
  ) {

    alert(
      "Ingrese una cédula válida"
    );

    return;
  }

  // ==========================================
  // VALIDAR TELÉFONO
  // ==========================================

  const telefonoRegex =
    /^[0-9]{7,15}$/;

  if (
    !telefonoRegex.test(
      telefonoLimpio
    )
  ) {

    alert(
      "Ingrese un número telefónico válido"
    );

    return;
  }

  // ==========================================
  // VALIDAR CONTRASEÑA
  // ==========================================

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

  if (
    !passwordRegex.test(
      contrasena
    )
  ) {

    alert(
      "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número"
    );

    return;
  }

  // ==========================================
  // CONFIRMAR CONTRASEÑA
  // ==========================================

  if (
    contrasena !==
    confirmarContrasena
  ) {

    alert(
      "Las contraseñas no coinciden"
    );

    return;
  }

  try {

    const response =
      await fetch(
        `${API}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            nombre:
              nombreLimpio,

            apellido:
              apellidoLimpio,

            cedula:
              cedulaLimpia,

            telefono:
              telefonoLimpio,

            correo:
              correoLimpio,

            contrasena,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      alert(
        data.message ||
        "Error registrando usuario"
      );

      return;
    }

    // ==========================================
    // GUARDAR TOKEN
    // ==========================================

    if (data.token) {

      localStorage.setItem(
        "token",
        data.token
      );

      if (data.usuario) {

        localStorage.setItem(
          "usuario",
          JSON.stringify(
            data.usuario
          )
        );
      }

      alert(
        "Usuario registrado correctamente"
      );

      window.location.href =
        "/dashboard";

    } else {

      alert(
        "Usuario registrado. Inicie sesión."
      );

      window.location.href =
        "/login";
    }

  } catch (error) {

    console.error(error);

    alert(
      "Error de conexión con el servidor"
    );
  }
}

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h1>Registro PrestApp</h1>

      <form onSubmit={handleRegister}>
        {/* NOMBRE */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* APELLIDO */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Apellido"
            required
            value={apellido}
            onChange={(e) =>
              setApellido(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* CEDULA */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Cédula"
            required
            value={cedula}
            onChange={(e) =>
              setCedula(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* TELEFONO */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Teléfono"
            required
            value={telefono}
            onChange={(e) =>
              setTelefono(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* CONTRASEÑA */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type={
              mostrarPassword
                ? "text"
                : "password"
            }
            placeholder="Contraseña"
            required
            value={contrasena}
            onChange={(e) =>
              setContrasena(
                e.target.value
              )
            }
            style={{
              width: "80%",
              padding: "10px",
            }}
          />

          <button
            type="button"
            onClick={() =>
              setMostrarPassword(
                !mostrarPassword
              )
            }
            style={{
              marginLeft: "10px",
            }}
          >
            {mostrarPassword
              ? "Ocultar"
              : "Ver"}
          </button>
        </div>

        {/* CONFIRMAR CONTRASEÑA */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type={
              mostrarConfirmar
                ? "text"
                : "password"
            }
            placeholder="Confirmar contraseña"
            required
            value={confirmarContrasena}
            onChange={(e) =>
              setConfirmarContrasena(
                e.target.value
              )
            }
            style={{
              width: "80%",
              padding: "10px",
            }}
          />

          <button
            type="button"
            onClick={() =>
              setMostrarConfirmar(
                !mostrarConfirmar
              )
            }
            style={{
              marginLeft: "10px",
            }}
          >
            {mostrarConfirmar
              ? "Ocultar"
              : "Ver"}
          </button>
        </div>

        {/* BOTON */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;