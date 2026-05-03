// ==========================================
// PRESTAPP - DASHBOARD PRO
// dashboard.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Dashboard iniciado");

  // ==========================================
  // 🌐 CONFIG
  // ==========================================
  const API_URL = "http://192.168.1.10:4000/api"; // CAMBIAR IP SI ES NECESARIO

  // ==========================================
  // 🔐 TOKEN
  // ==========================================
  function obtenerToken() {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  }

  // ==========================================
  // 🚪 LOGOUT
  // ==========================================
  async function cerrarSesion() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${obtenerToken()}`
        }
      });
    } catch (error) {
      console.warn("No se pudo cerrar sesión");
    }

    localStorage.removeItem("token");
    sessionStorage.clear();

    window.location.href = "/login";
  }

  // ==========================================
  // 🔐 VALIDAR LOGIN
  // ==========================================
  const token = obtenerToken();
  const rol = sessionStorage.getItem("user_role");

  if (!token || !rol) {
    window.location.href = "/login";
    return;
  }

  verificarSesion();

  // ==========================================
  // BOTÓN LOGOUT
  // ==========================================
  const btnCerrar = document.getElementById("btnCerrarSesion");

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarSesion);
  }

  // ==========================================
  // CARGAR NOMBRE USUARIO
  // ==========================================
  const nombreUsuario = document.getElementById("nombreUsuario");

  if (nombreUsuario) {
    nombreUsuario.textContent = "Administrador";
  }

  // ==========================================
  // 📊 GRAFICO PRINCIPAL
  // ==========================================
  const chartEl = document.querySelector("#chart");

  if (chartEl) {
    const chart = new ApexCharts(chartEl, {
      series: [
        {
          name: "Ingresos",
          data: [355, 390, 300, 350, 390, 180, 355]
        },
        {
          name: "Gastos",
          data: [280, 250, 325, 215, 250, 310, 280]
        }
      ],
      chart: {
        type: "bar",
        height: 345,
        toolbar: {
          show: false
        }
      },
      colors: ["#5D87FF", "#49BEFF"],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "35%"
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          "Lun",
          "Mar",
          "Mié",
          "Jue",
          "Vie",
          "Sáb",
          "Dom"
        ]
      }
    });

    chart.render();
  }

  // ==========================================
  // 🍩 DONUT
  // ==========================================
  const breakupEl = document.querySelector("#breakup");

  if (breakupEl) {
    const donut = new ApexCharts(breakupEl, {
      series: [38, 40, 25],
      labels: ["Pagados", "Pendientes", "Mora"],
      chart: {
        type: "donut",
        width: 220
      },
      legend: {
        show: true
      }
    });

    donut.render();
  }

  // ==========================================
  // 📈 MINI CHART
  // ==========================================
  const earningEl = document.querySelector("#earning");

  if (earningEl) {
    const mini = new ApexCharts(earningEl, {
      chart: {
        type: "area",
        height: 60,
        sparkline: {
          enabled: true
        }
      },
      series: [
        {
          data: [10, 35, 20, 60, 25, 80, 45]
        }
      ],
      stroke: {
        curve: "smooth",
        width: 2
      }
    });

    mini.render();
  }

});

// ==========================================
// 🔐 VERIFICAR TOKEN REAL
// ==========================================
async function verificarSesion() {

  const API_URL = "http://192.168.1.10:4000/api";

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  try {
    const res = await fetch(
      `${API_URL}/auth/check`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      cerrarTodo();
    }

  } catch (error) {
    cerrarTodo();
  }
}

// ==========================================
// LIMPIAR TODO
// ==========================================
function cerrarTodo() {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "/login";
}

// ==========================================
// 🔙 EVITAR CACHE / BOTÓN ATRÁS
// ==========================================
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});