import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ==========================================
// VALIDAR VARIABLES
// ==========================================

const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_NAME"
];

requiredEnv.forEach((env) => {

  if (!process.env[env]) {

    console.error(
      `❌ Falta la variable: ${env}`
    );

    process.exit(1);
  }
});

// ==========================================
// POOL MYSQL
// ==========================================

const pool = mysql.createPool({

  host: process.env.DB_HOST,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0
});

// ==========================================
// HELPER QUERY
// ==========================================

export const query = async (
  sql,
  params = []
) => {

  try {

    const [rows] =
      await pool.execute(
        sql,
        params
      );

    return rows;

  } catch (error) {

    console.error(
      "❌ Error SQL:",
      error.message
    );

    throw error;
  }
};

// ==========================================
// TEST CONEXIÓN
// ==========================================

async function verificarConexion() {

  try {

    const connection =
      await pool.getConnection();

    console.log(
      "✅ MySQL conectado"
    );

    connection.release();

  } catch (error) {

    console.error(
      "❌ Error MySQL:",
      error.message
    );

    process.exit(1);
  }
}

if (
  process.env.NODE_ENV !==
  "production"
) {

  verificarConexion();
}

// ==========================================
// EXPORT
// ==========================================

export default pool;