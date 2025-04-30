const mysql = require("mysql2/promise"); // ✅ BU SATIR DEĞİŞTİ
require("dotenv").config();

const db = mysql.createPool({ // ✅ createConnection değil createPool kullan
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db;
