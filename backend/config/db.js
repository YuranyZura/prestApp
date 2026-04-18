import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ✅ Validar variables de entorno
const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Falta la variable de entorno: ${env}`);
    process.exit(1);
  }
});

// 🔥 Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Probar conexión al iniciar
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado correctamente a MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Error al conectar a MySQL:", error.message);
    process.exit(1);
  }
})();

export default pool;