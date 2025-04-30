const express = require("express");
const router = express.Router();
const db = require("../db");

// 📌 Mesaj Gönderme
router.post("/send-message", (req, res) => {
  const { user_id, message_text } = req.body;

  const sql = "INSERT INTO messages (user_id, message_text) VALUES (?, ?)";
  db.query(sql, [user_id, message_text], (err, result) => {
    if (err) {
      console.error("❌ Mesaj gönderme hatası:", err);
      return res.status(500).send("Mesaj gönderilemedi.");
    }
    res.send("✅ Mesaj kaydedildi.");
  });
});

// 📌 Kullanıcının Tüm Mesajlarını Getir
router.get("/get-messages/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql = "SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC";
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("❌ Mesaj çekme hatası:", err);
      return res.status(500).send("Mesajlar getirilemedi.");
    }
    res.json(results);
  });
});

module.exports = router;
