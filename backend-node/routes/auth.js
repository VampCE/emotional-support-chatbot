const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ✅ Kayıt olma ve doğrulama maili gönderme
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
    const token = crypto.randomBytes(32).toString("hex");

    await db.query(`
      INSERT INTO users (email, password, verified, verification_token)
      VALUES (?, ?, false, ?)
    `, [email, hashedPassword, token]);

    const verifyLink = `http://localhost:3000/verify/${token}`;

    console.log("✅ Doğrulama bağlantısı:", verifyLink);
    console.log("📧 Mail kullanıcı:", process.env.MAIL_USER);

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "E-posta Doğrulama",
      text: `Hesabınızı doğrulamak için şu bağlantıya tıklayın:\n\n${verifyLink}`,
      html: `
        <p>Hesabınızı doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${verifyLink}">${verifyLink}</a>
      `
    });


    res.send("Doğrulama bağlantısı e-posta ile gönderildi.");
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(500).send("Sunucu hatası");
  }
});

// ✅ Doğrulama bağlantısı ile hesabı aktifleştirme
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE verification_token = ?", [token]);
    if (users.length === 0) return res.status(400).send("Geçersiz doğrulama bağlantısı.");

    await db.query("UPDATE users SET verified = true, verification_token = NULL WHERE id = ?", [users[0].id]);

    res.send("✅ Hesabınız başarıyla doğrulandı. Artık giriş yapabilirsiniz.");
  } catch (error) {
    console.error("Doğrulama hatası:", error);
    res.status(500).send("Sunucu hatası");
  }
});

// ✅ Giriş yapma (sadece doğrulanmış kullanıcılar)
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

    if (!user.verified) {
      return res.status(403).send("Lütfen önce e-posta adresinizi doğrulayın.");
    }

    res.send("Giriş başarılı!");
  } catch (error) {
    console.error("Giriş hatası:", error);
    res.status(500).send("Sunucu hatası");
  }
});

// ✅ Şifremi unuttum - mail gönder
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).send("Kullanıcı bulunamadı");

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    await db.query("UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?", [
      token,
      expiry,
      email
    ]);

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Şifre Sıfırlama",
      text: `Şifrenizi sıfırlamak için bu bağlantıya tıklayın:\n\n${resetLink}`,
    });

    res.send("Sıfırlama bağlantısı e-posta ile gönderildi.");
  } catch (err) {
    console.error("Reset e-posta hatası:", err);
    res.status(500).send("Sunucu hatası");
  }
});

// ✅ Yeni şifreyi ayarla
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE reset_token = ?", [token]);
    if (users.length === 0) return res.status(400).send("Geçersiz veya zaman aşımına uğramış bağlantı.");

    const user = users[0];
    if (new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).send("Token süresi dolmuş.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?", [
      hashedPassword,
      user.id
    ]);

    res.send("Şifre başarıyla güncellendi!");
  } catch (err) {
    console.error("Şifre güncelleme hatası:", err);
    res.status(500).send("Sunucu hatası");
  }
});

// ✅ İlgi alanlarını kaydetme
router.post('/interests', async (req, res) => {
  const { email, interests } = req.body;

  try {
    const [users] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).send("Kullanıcı bulunamadı");

    const userId = users[0].id;

    await db.query("DELETE FROM user_interests WHERE user_id = ?", [userId]);

    for (let interest of interests) {
      await db.query("INSERT INTO user_interests (user_id, interest) VALUES (?, ?)", [userId, interest]);
    }

    res.send("İlgi alanları başarıyla kaydedildi.");
  } catch (error) {
    console.error("Interest kayıt hatası:", error);
    res.status(500).send("Sunucu hatası");
  }
});

// ✅ İlgi alanlarını sorgulama
router.get('/interests/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [users] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).send("Kullanıcı bulunamadı");

    const userId = users[0].id;
    const [interests] = await db.query("SELECT interest FROM user_interests WHERE user_id = ?", [userId]);

    if (interests.length === 0) {
      return res.json({ hasInterests: false });
    }

    res.json({ hasInterests: true, interests: interests.map(row => row.interest) });
  } catch (error) {
    console.error("İlgi alanı sorgulama hatası:", error);
    res.status(500).send("Sunucu hatası");
  }
});

module.exports = router;

router.post('/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).send("Kullanıcı bulunamadı.");

    const user = users[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(403).send("Mevcut şifre hatalı.");

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, user.id]);

    res.send("Şifreniz başarıyla değiştirildi.");
  } catch (error) {
    console.error("Şifre değiştirme hatası:", error);
    res.status(500).send("Sunucu hatası");
  }
});
