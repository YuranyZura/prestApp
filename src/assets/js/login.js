document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita recargar

    const data = {
      correo: document.querySelector('input[name="correo"]').value,
      contrasena: document.querySelector('input[name="contrasena"]').value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        //  Éxito: mostrar toast y redirigir
        const toastEl = document.getElementById("toastLoginExito");
        const toast = new bootstrap.Toast(toastEl);
        toast.show();

        // Redirigir después de que termine el toast
        toastEl.addEventListener("hidden.bs.toast", () => {
          window.location.href = "./dashboard";
        });

      } else {
        //  Error: mostrar mensaje del servidor
        const toastBody = document.getElementById("toastLoginErrorBody");
        toastBody.textContent = result.message;
        const toast = new bootstrap.Toast(document.getElementById("toastLoginError"));
        toast.show();
      }

    } catch (error) {
      console.error("Error en login:", error);
      const toastBody = document.getElementById("toastLoginErrorBody");
      toastBody.textContent = "Error de conexión con el servidor";
      const toast = new bootstrap.Toast(document.getElementById("toastLoginError"));
      toast.show();
    }
  });
});