import { API_URL } from "../config/config.js";

const form =
  document.getElementById("loginForm");

form.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const correo =
      document.getElementById("correo").value;

    const password =
      document.getElementById("password").value;

    try {

      const response =
        await fetch(
          `${API_URL}/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              correo,
              password
            })
          }
        );

      const data =
        await response.json();

      console.log(data);

      if (data.success) {

        alert("Login correcto");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.error(error);

      alert(
        "Error conectando con backend"
      );

    }

  }
);