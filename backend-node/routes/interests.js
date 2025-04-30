const express = require('express');
const router = express.Router();
const db = require('../db'); // veritabanı bağlantımız

// ✅ İlgi alanlarını kaydetme endpointi
router.post('/interests', async (req, res) => {
  const { email, interests } = req.body;

  if (!email || !interests || !Array.isArray(interests)) {
    return res.status(400).send("Eksik veya hatalı veri.");
  }

  try {
    // Önce kullanıcı ID'sini bulalım
    const [rows] = await db.promise().query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).send("Kullanıcı bulunamadı.");
    }

    const userId = rows[0].id;

    // Seçilen tüm ilgi alanlarını kaydedelim
    for (const interest of interests) {
      await db.promise().query(
        "INSERT INTO interests (user_id, interest_name) VALUES (?, ?)",
        [userId, interest]
      );
    }

    res.send("İlgi alanları başarıyla kaydedildi!");
  } catch (error) {
    console.error("İlgi alanı kaydetme hatası:", error);
    res.status(500).send("Sunucu hatası.");
  }
});

module.exports = router;
