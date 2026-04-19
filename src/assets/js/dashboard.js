document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard iniciado");

  // ===============================
  // 🌐 CONFIG API (CAMBIAR IP)
  // ===============================
  const API_URL = "http://192.168.1.10:3000/api"; // ⚠️ CAMBIA ESTO

  // ===============================
  // 🔐 VALIDAR SESIÓN Y ROL
  // ===============================
  const rol = sessionStorage.getItem("user_role");

  if (!rol) {
    window.location.href = "./login.html";
    return;
  }

  // (opcional) si quieres solo admin:
  // if (rol !== "administrador") {
  //   window.location.href = "./login.html";
  // }

  checkSession();

  // ===============================
  // 📊 GRÁFICO PRINCIPAL
  // ===============================
  const chartOptions = {
    series: [
      { name: "Ingresos", data: [355, 390, 300, 350, 390, 180, 355, 390] },
      { name: "Gastos", data: [280, 250, 325, 215, 250, 310, 280, 250] },
    ],
    chart: {
      type: "bar",
      height: 345,
      fontFamily: "inherit",
    },
    colors: ["#5D87FF", "#49BEFF"],
    plotOptions: {
      bar: {
        columnWidth: "35%",
        borderRadius: 6,
      },
    },
    xaxis: {
      categories: ["16/08", "17/08", "18/08", "19/08", "20/08", "21/08", "22/08", "23/08"],
    },
    yaxis: {
      min: 0,
      max: 400,
    },
    dataLabels: { enabled: false },
  };

  const chartEl = document.querySelector("#chart");
  if (chartEl) {
    new ApexCharts(chartEl, chartOptions).render();
  }

  // ===============================
  // 🍩 GRÁFICO DONUT
  // ===============================
  const breakupOptions = {
    series: [38, 40, 25],
    labels: ["2022", "2021", "2020"],
    chart: {
      type: "donut",
      width: 180,
    },
    colors: ["#5D87FF", "#ecf2ff", "#F9F9FD"],
    legend: { show: false },
  };

  const breakupEl = document.querySelector("#breakup");
  if (breakupEl) {
    new ApexCharts(breakupEl, breakupOptions).render();
  }

  // ===============================
  // 📈 MINI GRÁFICO
  // ===============================
  const earningOptions = {
    chart: {
      type: "area",
      height: 60,
      sparkline: { enabled: true },
    },
    series: [
      {
        name: "Ingresos",
        data: [25, 66, 20, 40, 12, 58, 20],
      },
    ],
    stroke: { curve: "smooth", width: 2 },
  };

  const earningEl = document.querySelector("#earning");
  if (earningEl) {
    new ApexCharts(earningEl, earningOptions).render();
  }

  // ===============================
  // 🚪 CERRAR SESIÓN
  // ===============================
  const btnCerrar = document.getElementById("btnCerrarSesion");

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarSesion);
  }

  async function cerrarSesion() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Error cerrando sesión");
    }

    sessionStorage.clear();
    window.location.href = "./login.html";
  }

});

// ===============================
// 🔐 VERIFICAR SESIÓN REAL
// ===============================
async function checkSession() {
  const API_URL = "http://192.168.1.10:3000/api";

  try {
    const res = await fetch(`${API_URL}/auth/check`, {
      credentials: "include",
    });

    if (!res.ok) {
      window.location.href = "./login.html";
    }
  } catch (err) {
    window.location.href = "./login.html";
  }
}

// ===============================
// 🔙 EVITAR BOTÓN ATRÁS
// ===============================
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});