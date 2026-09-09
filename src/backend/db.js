import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env")
});

console.log("========== DATABASE CONFIG ==========");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT || 3306);
console.log("=====================================");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // IMPORTANT: don't allow requests to hang forever
  connectTimeout: 5000
});

// Test database connection immediately
try {
  const connection = await db.getConnection();

  console.log("✅ MySQL database connected successfully");

  connection.release();
} catch (error) {
  console.error("❌ MySQL database connection FAILED");
  console.error("Error:", error.message);
}

export default db;