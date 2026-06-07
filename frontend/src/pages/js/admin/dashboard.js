import "../auth/authGuard.js";

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "Dashboard iniciado"
    );

    // =====================================
    // NOMBRE USUARIO
    // =====================================

    const usuario =
      JSON.parse(
        localStorage.getItem(
          "usuario"
        )
      );

    const nombreUsuario =
      document.getElementById(
        "nombreUsuario"
      );

    if (
      usuario &&
      nombreUsuario
    ) {

      nombreUsuario.textContent =
        usuario.nombre || "Admin";
    }

    // =====================================
    // CHART PRINCIPAL
    // =====================================

    iniciarGraficoPrincipal();

    iniciarDonut();

    iniciarMiniChart();
  }
);

// =====================================
// GRÁFICO PRINCIPAL
// =====================================

function iniciarGraficoPrincipal() {

  const chartEl =
    document.querySelector("#chart");

  if (!chartEl) return;

  const chart =
    new ApexCharts(chartEl, {

      series: [
        {
          name: "Ingresos",

          data: [
            355,
            390,
            300,
            350,
            390,
            180,
            355
          ]
        },

        {
          name: "Gastos",

          data: [
            280,
            250,
            325,
            215,
            250,
            310,
            280
          ]
        }
      ],

      chart: {
        type: "bar",
        height: 345,

        toolbar: {
          show: false
        }
      },

      colors: [
        "#5D87FF",
        "#49BEFF"
      ],

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

// =====================================
// DONUT
// =====================================

function iniciarDonut() {

  const breakupEl =
    document.querySelector("#breakup");

  if (!breakupEl) return;

  const donut =
    new ApexCharts(breakupEl, {

      series: [38, 40, 25],

      labels: [
        "Pagados",
        "Pendientes",
        "Mora"
      ],

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

// =====================================
// MINI CHART
// =====================================

function iniciarMiniChart() {

  const earningEl =
    document.querySelector("#earning");

  if (!earningEl) return;

  const mini =
    new ApexCharts(earningEl, {

      chart: {

        type: "area",

        height: 60,

        sparkline: {
          enabled: true
        }
      },

      series: [
        {
          data: [
            10,
            35,
            20,
            60,
            25,
            80,
            45
          ]
        }
      ],

      stroke: {
        curve: "smooth",
        width: 2
      }
    });

  mini.render();
}