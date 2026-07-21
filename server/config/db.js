import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

// Test connection
db.query("SELECT 1")
  .then(() => {
    console.log("✅ Connected to Railway MySQL");
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err.message);
  });

export default db;