// Estadísticas Dashboard
async function cargarEstadisticasDashboard() {
  try {
    const res = await fetch("/api/dashboard/estadisticas", { credentials: "include" });
    if (!res.ok) throw new Error("No se pudo obtener estadísticas");
    const data = await res.json();
    // Actualizar contadores
    if (data.trabajadoresActivos !== undefined)
      document.getElementById("trabajadoresActivos").textContent = data.trabajadoresActivos;
    if (data.prestamosActivos !== undefined)
      document.getElementById("prestamosActivos").textContent = data.prestamosActivos;
    if (data.montoPrestado !== undefined)
      document.getElementById("montoPrestado").textContent = "$" + Number(data.montoPrestado).toLocaleString();
    if (data.recuperadoHoy !== undefined)
      document.getElementById("recuperadoHoy").textContent = "$" + Number(data.recuperadoHoy).toLocaleString();
  } catch (err) {
    console.error("Error cargando estadísticas:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarEstadisticasDashboard);



$(function () {


  var chart = {
    series: [
      { name: "Earnings this month:", data: [355, 390, 300, 350, 390, 180, 355, 390] },
      { name: "Expense this month:", data: [280, 250, 325, 215, 250, 310, 280, 250] },
    ],

    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#adb0bb",
      fontFamily: 'inherit',
      sparkline: { enabled: false },
    },


    colors: ["#5D87FF", "#49BEFF"],


    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all'
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: false,
    },


    legend: {
      show: false,
    },


    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      type: "category",
      categories: ["16/08", "17/08", "18/08", "19/08", "20/08", "21/08", "22/08", "23/08"],
      labels: {
        style: { cssClass: "grey--text lighten-2--text fill-color" },
      },
    },


    yaxis: {
      show: true,
      min: 0,
      max: 400,
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: "butt",
      colors: ["transparent"],
    },


    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            }
          },
        }
      }
    ]


  };

  var chart = new ApexCharts(document.querySelector("#chart"), chart);
  chart.render();


  // =====================================
  // Breakup
  var breakup = {
    color: "#adb5bd",
    series: [38, 40, 25],
    labels: ["2022", "2021", "2020"],
    chart: {
      width: 180,
      type: "donut",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
        },
      },
    },
    stroke: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    colors: ["#5D87FF", "#ecf2ff", "#F9F9FD"],

    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 150,
          },
        },
      },
    ],
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };

  var chart = new ApexCharts(document.querySelector("#breakup"), breakup);
  chart.render();



  // =====================================
  // Earning
  var earning = {
    chart: {
      id: "sparkline3",
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    series: [
      {
        name: "Earnings",
        color: "#49BEFF",
        data: [25, 66, 20, 40, 12, 58, 20],
      },
    ],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: ["#f3feff"],
      type: "solid",
      opacity: 0.05,
    },

    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };
  new ApexCharts(document.querySelector("#earning"), earning).render();
})



// ====== Función de cerrar sesión ======
async function cerrarSesion() {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    const data = await res.json();
    console.log("Logout:", data);

    // Redirigir al login después de cerrar sesión
    window.location.href = "/login";
  } catch (err) {
    console.error("Error cerrando sesión:", err);
  }
}


// ====== Manejo de botón ======
document.addEventListener("DOMContentLoaded", () => {
  const btnCerrar = document.getElementById("btnCerrarSesion");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarSesion);
  }

  // Verificar sesión al cargar
  checkSession();
});

// ====== Evitar volver con el botón atrás ======
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});

// ====== Verificar sesión ======
async function checkSession() {
  try {
    const res = await fetch("/api/auth/check", {
      credentials: "include"
    });

    if (!res.ok) {
      window.location.href = "/login";
    }
  } catch (err) {
    window.location.href = "/login";
  }
}


// ===== CONFIGURACIÓN MODAL TASA DE INTERÉS =====
document.addEventListener("DOMContentLoaded", function () {

    const botonGuardar = document.getElementById("btnGuardarConfiguracionInteres");
    const inputTasa = document.getElementById("tasaInteres");
    const tasaDisplay = document.getElementById("tasaInteresDisplay");
    const ejemploTasa = document.getElementById("ejemploTasa");
    const ejemploInteres = document.getElementById("ejemploInteres");
    const errorDiv = document.getElementById("tasaInteresError");

    if (!botonGuardar) return;

    // ACTUALIZAR Een tiempo real
    inputTasa.addEventListener("input", function () {

        const tasa = parseFloat(inputTasa.value) || 0;
        const montoEjemplo = 1000;

        const interesCalculado = (montoEjemplo * tasa) / 100;

        ejemploTasa.textContent = tasa + "%";
        ejemploInteres.textContent = "$" + interesCalculado.toFixed(2);
    });

    // guarda configuracion de tasa de interes
    botonGuardar.addEventListener("click", function () {

        const tasa = inputTasa.value;

        if (!tasa || tasa < 0) {
            errorDiv.textContent = "Debes ingresar una tasa válida";
            return;
        }

        errorDiv.textContent = "";

        botonGuardar.disabled = true;
        botonGuardar.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Guardando...
        `;

        fetch("/api/dashboard/configuracion/interes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tasa_interes: tasa })
        })
        .then(response => response.json())
        .then(data => {

            // Actualizar tasa visible
            tasaDisplay.textContent = tasa + "%";

            //  mstrar toast 
            const toastElement = document.getElementById("toastExito");
            const toast = new bootstrap.Toast(toastElement);
            toast.show();

            const modalElement = document.getElementById("modalConfiguracionInteres");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            //  Limpiar input
            inputTasa.value = "";
            ejemploTasa.textContent = "0%";
            ejemploInteres.textContent = "$0.00";

        })
        .catch(error => {
            console.error("Error:", error);
        })
        .finally(() => {
            botonGuardar.disabled = false;
            botonGuardar.innerHTML = `
                <i class="ti ti-device-floppy me-2"></i>Guardar Cambios
            `;
        });

    });

    //  cargar la tada de interes al abrir el modal
    fetch("/api/dashboard/configuracion/interes")
        .then(response => response.json())
        .then(data => {
            tasaDisplay.textContent = (data.tasa_interes || 0) + "%";
        })
        .catch(error => {
            console.error("Error cargando tasa:", error);
        });

});