import mysql from "mysql2/promise";
import dotenv from "dotenv";

/* // Cargar las variables de entorno
dotenv.config();
 */
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined;

let connection: mysql.Connection | undefined;

export const createConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: DB_HOST, // Dirección del servidor MySQL
      user: DB_USER, // Usuario de la base de datos
      password: DB_PASSWORD, // Contraseña del usuario
      database: DB_DATABASE, // Nombre de tu base de datos
      port: DB_PORT, // Puerto (opcional)
    });
  }
  return connection
};

/* const pool = mysql.createPool({
  host: DB_HOST, // Dirección del servidor MySQL
  user: DB_USER, // Usuario de la base de datos
  password: DB_PASSWORD, // Contraseña del usuario
  database: DB_DATABASE, // Nombre de tu base de datos
  port: DB_PORT, // Puerto (opcional)
});

export default pool;
 */