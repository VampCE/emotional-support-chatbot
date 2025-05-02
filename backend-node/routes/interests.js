const express = require('express');
const router = express.Router();
const db = require('../db'); // Doğrudan pool (promise destekli)

router.post('/interests', async (req, res) => {
  const { email, interests } = req.body;

  if (!email || !interests || !Array.isArray(interests)) {
    return res.status(400).send("Eksik veya hatalı veri.");
  }

  try {
    // ✅ Artık db.promise() değil, doğrudan db.query() kullanabilirsin
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).send("Kullanıcı bulunamadı.");
    }

    const userId = rows[0].id;

    // Eski ilgi alanlarını sil
    await db.query("DELETE FROM user_interests WHERE user_id = ?", [userId]);

    // Yeni ilgi alanlarını ekle
    for (const interest of interests) {
      await db.query(
        "INSERT INTO user_interests (user_id, interest) VALUES (?, ?)",
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
