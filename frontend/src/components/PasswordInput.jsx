import React, { useState } from "react";

function PasswordInput({
  value,
  onChange,
  placeholder = "Contraseña",
  name = "",
  required = false
}) {
  const [mostrar, setMostrar] =
    useState(false);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "10px",
        alignItems: "center"
      }}
    >
      <input
        type={
          mostrar
            ? "text"
            : "password"
        }
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          flex: 1,
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px"
        }}
      />

      <button
        type="button"
        onClick={() =>
          setMostrar(!mostrar)
        }
        style={{
          padding: "10px",
          cursor: "pointer"
        }}
      >
        {mostrar
          ? "Ocultar"
          : "Ver"}
      </button>
    </div>
  );
}

export default PasswordInput;