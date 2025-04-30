const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// ✅ Kayıt olma endpointi
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send("Email ve şifre zorunludur.");
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).send("Bu email ile zaten bir kullanıcı var.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

    res.send("Kayıt başarılı!");
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(500).send("Sunucu hatası");
  }
});

// ✅ Giriş yapma endpointi
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send("Email ve şifre zorunludur.");
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).send("Bu email ile kullanıcı bulunamadı.");
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Şifre hatalı.");
    }

    res.send("Giriş başarılı!");
  } catch (error) {
    console.error("Giriş hatası:", error);
    res.status(500).send("Sunucu hatası");
  }
});

// ✅ Bu en sonda olacak
module.exports = router;
