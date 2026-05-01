import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 🔒 Validación básica de variables de entorno
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error("❌ Faltan variables de entorno de la base de datos");
  process.exit(1);
}

// 🔗 Pool de conexiones
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
});

// 🔥 HELPER DE QUERIES (ESTÁNDAR EN TODO EL PROYECTO)
export const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("❌ Error en query:", error.message);
    throw error;
  }
};

// 🔍 Verificar conexión al iniciar (solo en desarrollo)
async function verificarConexion() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado a MySQL correctamente");
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error.message);
  }
}

if (process.env.NODE_ENV !== "production") {
  verificarConexion();
}

// 📤 Exportar pool
export default pool;