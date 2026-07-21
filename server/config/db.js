import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql
  .createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000,
  })
  .promise();

db.connect()
  .then(() => {
    console.log("✅ MySQL Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Failed:", err.message);
  });

export default db;