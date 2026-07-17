import mysql from "mysql2/promise";
import env from "./env.js";

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" MySQL Connected Successfully");
    connection.release();
  } catch (error) {
    console.error(" MySQL Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

export { pool, connectDB };