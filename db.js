const mysql = require("mysql2");
require("dotenv").config();  // ✅ ใช้ .env เพื่อเก็บค่าความลับ

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER || "root",  // ใช้ค่าจาก .env หรือ root
  password: process.env.DB_PASS || "",  // ถ้ามีรหัสผ่านให้ใส่ตรงนี้
  database: process.env.DB_NAME || "shop_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

module.exports = connection;
