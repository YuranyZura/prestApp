import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 🔒 Validación completa de variables
const requiredEnv = ["DB_HOST", "DB_USER", "DB_NAME"];

requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Falta la variable de entorno: ${env}`);
    process.exit(1);
  }
});

// 🔗 Pool de conexiones optimizado
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  connectTimeout: 10000,

  // 🔥 IMPORTANTE (evita caídas por conexiones muertas)
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// 🔥 HELPER DE QUERIES (MEJORADO)
export const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("❌ Error en query:", {
      message: error.message,
      code: error.code,
      sql: sql,
    });

    throw new Error("Error en base de datos");
  }
};

// 🔍 Test de conexión mejorado
async function verificarConexion() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL conectado correctamente");
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error.message);

    // 🔥 Opcional: cerrar app si no hay DB
    process.exit(1);
  }
}

// Solo en desarrollo
if (process.env.NODE_ENV !== "production") {
  verificarConexion();
}

// 📤 Exportar pool
export default pool;

