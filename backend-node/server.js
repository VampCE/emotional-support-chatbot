const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const interestsRoutes = require('./routes/interests');
const app = express();

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api", interestsRoutes);


// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor`);
});
