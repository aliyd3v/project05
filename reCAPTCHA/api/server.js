const express = require('express')
const cors = require('cors')
const tgBot = require('node-telegram-bot-api')
require('dotenv').config();
// Configs from .env file.
const port = process.env.PORT || 3000;
const captchaSecretKey = process.env.CAPTCHA_SECRET_KEY
const tgBotToken = process.env.TG_BOT_TOKEN
const tgChannelId = process.env.TG_CHANNEL_ID
// Application setups.
const app = express();
const bot = new tgBot(tgBotToken, { polling: true })
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.post('/verify', async (req, res) => {
    const { query } = req;
    try {
        const data = query.data
        const name = query.name
        const phone = query.phone
        const description = query.description || ''
        if (!data || !name || !phone) { return res.status(400).json({ status: 'fail', message: 'Parametres is wrong!' }) }
        const params = new URLSearchParams({ secret: captchaSecretKey, response: data })
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'post', body: params });
        const result = await response.json();
        if (!result.success) { return res.status(400).json({ status: 'fail', message: 'Verify failed!' }) };
        const currentTime = new Date()
        const message = `
Name: ${name}
Phone: ${phone}
Description: ${description}

Date: ${currentTime}`
        bot.sendMessage(tgChannelId, message)
        return res.status(200).json({ status: 'success', message: 'Verified successfully' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 'fail', message: 'Internal server error!' })
    }
})
app.use((req, res) => { return res.status(404).json({ status: 'fail', message: 'Route not found!' }) })
app.listen(port, () => console.log('Listening on port ' + port + ' ...'))