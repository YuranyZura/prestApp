// =====================================
// ALERT CONTAINER
// =====================================

function obtenerContainer() {

  let container =
    document.getElementById(
      "alert-container"
    );

  // Crear automáticamente
  if (!container) {

    container =
      document.createElement("div");

    container.id =
      "alert-container";

    container.style.position =
      "fixed";

    container.style.top =
      "20px";

    container.style.right =
      "20px";

    container.style.zIndex =
      "9999";

    container.style.display =
      "flex";

    container.style.flexDirection =
      "column";

    container.style.gap =
      "10px";

    document.body.appendChild(
      container
    );
  }

  return container;
}

// =====================================
// ALERTA PRINCIPAL
// =====================================

export function showAlert(
  message,
  type = "success",
  duration = 4000
) {

  const container =
    obtenerContainer();

  const alert =
    document.createElement("div");

  alert.className =
    `prestapp-alert ${type}`;

  const span =
  document.createElement("span");

span.textContent =
  message;

      <button class="alert-close">
        ×
      </button>

    
  

  // =====================================
  // ESTILOS
  // =====================================

  alert.style.minWidth =
    "280px";

  alert.style.maxWidth =
    "400px";

  alert.style.padding =
    "14px 18px";

  alert.style.borderRadius =
    "12px";

  alert.style.fontSize =
    "14px";

  alert.style.fontWeight =
    "500";

  alert.style.boxShadow =
    "0 4px 12px rgba(0,0,0,0.15)";

  alert.style.color =
    "#fff";

  alert.style.animation =
    "slideIn .3s ease";

  alert.style.display =
    "flex";

  alert.style.alignItems =
    "center";

  alert.style.justifyContent =
    "space-between";

  // =====================================
  // COLORES
  // =====================================

  switch (type) {

    case "success":

      alert.style.background =
        "#16a34a";

      break;

    case "error":

      alert.style.background =
        "#dc2626";

      break;

    case "warning":

      alert.style.background =
        "#f59e0b";

      break;

    case "info":

      alert.style.background =
        "#2563eb";

      break;

    default:

      alert.style.background =
        "#374151";
  }

  // =====================================
  // BOTÓN CERRAR
  // =====================================

  const btnCerrar =
    alert.querySelector(
      ".alert-close"
    );

  btnCerrar.style.background =
    "transparent";

  btnCerrar.style.border =
    "none";

  btnCerrar.style.color =
    "#fff";

  btnCerrar.style.fontSize =
    "18px";

  btnCerrar.style.cursor =
    "pointer";

  btnCerrar.onclick =
    () => cerrarAlert(alert);

  // =====================================
  // AGREGAR
  // =====================================

  container.appendChild(alert);

  // =====================================
  // AUTO REMOVE
  // =====================================

  setTimeout(() => {

    cerrarAlert(alert);

  }, duration);
}

// =====================================
// CERRAR ALERT
// =====================================

function cerrarAlert(alert) {

  if (!alert) return;

  alert.style.opacity = "0";

  alert.style.transform =
    "translateX(100%)";

  alert.style.transition =
    "all .3s ease";

  setTimeout(() => {

    alert.remove();

  }, 300);
}

// =====================================
// HELPERS
// =====================================

export function showSuccess(
  message
) {

  showAlert(
    message,
    "success"
  );
}

export function showError(
  message
) {

  showAlert(
    message,
    "error"
  );
}

export function showWarning(
  message
) {

  showAlert(
    message,
    "warning"
  );
}

export function showInfo(
  message
) {

  showAlert(
    message,
    "info"
  );
}

// =====================================
// ANIMACIÓN GLOBAL
// =====================================

if (!document.getElementById("prestapp-alert-style")) {

  const style =
    document.createElement("style");

  style.id =
    "prestapp-alert-style";

  style.innerHTML = `
    @keyframes slideIn {

      from {
        opacity: 0;
        transform: translateX(100%);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;

  document.head.appendChild(style);
}