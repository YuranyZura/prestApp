import React from "react";

function Dashboard() {

  // ==========================================
  // VERIFICAR TOKEN
  // ==========================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    // SI NO EXISTE TOKEN
    if (!token) {

      window.location.href =
        "/login";
    }

  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {

    localStorage.removeItem("token");

    window.location.href =
      "/login";
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

        Dashboard PrestApp

      </h1>

      <p>

        Bienvenido al sistema.

      </p>

      <button
        onClick={handleLogout}
      >

        Cerrar sesión

      </button>

    </div>
  );
}

export default Dashboard;