async function login(email, password) {
  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
  correo: email,
  contrasena: password
})
    });

    if (data && data.success) {
      mostrarNotificacion("Inicio de sesión exitoso", "success");

      // Redirigir según rol (opcional)
      if (data.user?.rol === "super_admin"){
        window.location.href = "/admin/dashboard.html";
      } else {
        window.location.href = "/html/trabajador/Rol2_trabajador.html";
      }
    }

  } catch (error) {
    console.error("Error login:", error);
    mostrarNotificacion("Credenciales incorrectas", "danger");
  }
}

// 🚪 LOGOUT
async function logout() {
  try {
    await apiFetch("/auth/logout", {
      method: "POST"
    });

    mostrarNotificacion("Sesión cerrada", "info");

    // Redirigir al login
    window.location.href = "/login.html";

  } catch (error) {
    console.error("Error logout:", error);
    mostrarNotificacion("Error al cerrar sesión", "danger");
  }
}

// 🔎 VERIFICAR SESIÓN
async function checkSession() {
  try {
    const data = await apiFetch("/auth/check");

    if (!data || !data.success) {
      redirigirLogin();
    }

  } catch (error) {
    redirigirLogin();
  }
}

// 🔁 REDIRECCIÓN SEGURA
function redirigirLogin() {
  window.location.href = "/login.html";
}

// 🧠 PROTEGER PÁGINAS
function protegerRuta() {
  document.addEventListener("DOMContentLoaded", () => {
    checkSession();
  });
}

// 🔘 BOTONES AUTOMÁTICOS
document.addEventListener("DOMContentLoaded", () => {

  // Botón logout
  const btnLogout = document.getElementById("btnCerrarSesion");
  if (btnLogout) {
    btnLogout.addEventListener("click", logout);
  }

});
// ==========================================
// LOGIN PRESTAPP
// ==========================================

import { API_URL } from "/assets/js/config.js";

const form =
document.getElementById("formLogin");

const msg =
document.getElementById("mensaje");

const btnLogin =
document.getElementById("btnLogin");

const togglePassword =
document.getElementById("togglePassword");

const inputPassword =
document.getElementById("contrasena");

/* =========================
MOSTRAR MENSAJE
========================= */
function mostrar(
texto,
tipo = "error"
){

msg.className =
`msg ${tipo}`;

msg.textContent =
texto;

}

/* =========================
MOSTRAR / OCULTAR PASSWORD
========================= */
if(togglePassword){

togglePassword
.addEventListener("click",()=>{

const visible =
inputPassword.type === "text";

inputPassword.type =
visible
? "password"
: "text";

togglePassword.innerHTML =
visible
? '<i class="ti ti-eye"></i>'
: '<i class="ti ti-eye-off"></i>';

});

}

/* =========================
LOGIN
========================= */
if(form){

form.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

btnLogin.disabled = true;

const correo =
document.getElementById("correo")
.value
.trim();

const contrasena =
inputPassword.value.trim();

if(!correo || !contrasena){

mostrar(
"Complete todos los campos"
);

btnLogin.disabled = false;

return;

}

try{

const res =
await fetch(
`${API_URL}/auth/login`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
correo,
contrasena
})
}
);

const data =
await res.json();

if(data.success){

mostrar(
"Acceso correcto",
"success"
);

localStorage.setItem(
"token",
data.token
);

localStorage.setItem(
"usuario",
JSON.stringify(data.user)
);

/* REDIRECCIONES */
setTimeout(()=>{

if(
data.user.rol ===
"super_admin"
){

location.href =
"/html/admin/administradores.html";

}
else if(
data.user.rol ===
"administrador"
){

location.href =
"/html/admin/dashboard.html";

}
else{

location.href =
"/html/trabajador/Rol2_trabajador.html";

}

},1000);

}else{

mostrar(
data.message ||
"Credenciales inválidas"
);

}

}catch(error){

console.error(error);

mostrar(
"No se pudo conectar con el servidor"
);

}

btnLogin.disabled = false;

});

}