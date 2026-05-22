import  React from "react";

import API from "../config/api";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function handleLogin(e) {

    e.preventDefault();

    try {

      const response =
        await fetch(
          `${API}/api/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              email,
              password
            })
          }
        );

      const data =
        await response.json();

      console.log(data);

      // GUARDAR TOKEN
      localStorage.setItem(
        "token",
        data.token
      );

      // REDIRECT
      window.location.href =
        "/dashboard";

    } catch (error) {

      console.error(error);
    }
  }

  return (

    <div>

      <h1>Login PrestApp</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button type="submit">

          Ingresar

        </button>

      </form>

    </div>
  );
}

export default Login;