const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const app = express();

app.use(express.json({ limit: '50mb' }));

const BOT_TOKEN = '8765969078:AAF0n0KlZ4ids7pTeDpAOlulsfaM1E-k1SI';
const CHAT_ID = '6198785906';

app.post('/send-photo', async (req, res) => {
    try {
        const { image, caption } = req.body;
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('photo', buffer, { filename: 'photo.jpg' });
        form.append('caption', caption || 'New capture');
        
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
            headers: form.getHeaders()
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send' });
    }
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
           
