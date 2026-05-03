import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import dashboardRoutes from "./router/dashboard.js";

dotenv.config();

import { corsOptions } from "./config/cors.js";
import rutasRoutes from "./router/rutas.js";
import trabajadoresRoutes from "./router/trabajadores.js";
import authRouter from "./router/auth.js";
import cobradorRoutes from "./router/rol2_cobrador.js";
import clientesRoutes from "./router/clientes.js";
import administradoresRoutes from "./router/administradores.js";
import pagosRoutes from "./router/pagos.js";
import { uploadsDir } from "./config/uploads.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
app.use(cors(corsOptions));

// BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60
    }
  })
);

// STATIC
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(path.join(__dirname, "../src")));

// CACHE OFF
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/trabajadores", trabajadoresRoutes);
app.use("/api/cobrador", cobradorRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/administradores", administradoresRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/rutas", rutasRoutes);
app.use("/api/dashboard", dashboardRoutes);
// VIEWS

app.use(express.static(path.join(__dirname,'../src')));

app.get('/', (req,res)=>{
   res.redirect('/html/auth/register.html');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
});