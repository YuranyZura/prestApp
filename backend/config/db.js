// =====CONEXCION A LA BD====
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const conexion = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "prestapp",
});
console.log("Conexión a MySQL establecida");
//module.exports =  conexion ;
export default conexion;