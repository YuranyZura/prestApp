# 📱 PrestApp - Sistema de Gestión de Préstamos

PrestApp es una aplicación web y móvil (mediante WebView Android) diseñada para gestionar préstamos, trabajadores y clientes de forma eficiente.

Permite administrar usuarios, registrar préstamos, visualizar rutas en mapas y controlar el estado del negocio en tiempo real.

---

## 🚀 Tecnologías utilizadas

* 🌐 HTML5, CSS3, JavaScript
* 🎨 Bootstrap 5
* ⚙️ Node.js + Express
* 🗄️ MySQL
* 🗺️ Google Maps API
* 📱 Android WebView (App híbrida)

---

## 📂 Estructura del proyecto

```
prestapp/
│
├── html/
│   ├── admin/
│   ├── trabajador/
│   ├── auth/
│   └── shared/
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│
├── uploads/
├── server.js
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Instalación del proyecto

### 1️⃣ Clonar repositorio

```bash
git clone https://github.com/TU-USUARIO/prestapp.git
cd prestapp
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=prestapp
PORT=3000

JWT_SECRET=tu_clave_secreta
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_password_correo

GOOGLE_MAPS_API_KEY=tu_api_key
```

---

### 4️⃣ Ejecutar servidor

```bash
npm start
```

Servidor disponible en:

```
http://localhost:3000
```

---

## 📱 Uso en Android (WebView)

Puedes convertir PrestApp en una app Android usando WebView.

### Pasos básicos:

1. Crear proyecto en Android Studio
2. Agregar un WebView
3. Cargar la URL:

```java
webView.loadUrl("http://10.0.2.2:3000"); // Emulador Android
```

---

## 🗺️ Funcionalidades principales

* 👤 Registro e inicio de sesión
* 🔐 Autenticación con JWT
* 👷 Gestión de trabajadores
* 💰 Control de préstamos
* 📍 Mapa en tiempo real (Google Maps)
* 📊 Dashboard administrativo
* 📩 Envío de correos (Nodemailer)

---

## 🔒 Seguridad

* Contraseñas encriptadas con bcrypt
* Variables sensibles protegidas con `.env`
* Autenticación mediante JWT

---

## 📦 Scripts disponibles

```bash
npm start       # Iniciar servidor
npm run dev     # Modo desarrollo (si usas nodemon)
```

---

## ⚠️ Importante

* ❌ No subir `.env` a GitHub
* ❌ No subir `node_modules/`
* ✔ Usar `.env.example` para compartir configuración

---

## 📸 Capturas (opcional)

Agrega aquí imágenes de tu app:

```
assets/images/demo.png
```

---

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcion`)
3. Haz commit (`git commit -m 'Nueva función'`)
4. Haz push (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de uso educativo y profesional.

---

## 👨‍💻 Autores

Desarrollado por **Steven Arzuza Chaverra**
                 **Noemy Morelo Rivas**
                 **Yurani Marcela Sura**
---

## ⭐ Recomendación

Si este proyecto te sirve, no olvides darle una estrella ⭐ en GitHub.

