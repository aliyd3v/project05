const express = require('express')
const cors = require('cors')
const tgBot = require('node-telegram-bot-api')
const jwt = require('jsonwebtoken')
require('dotenv').config();
// Configs from .env file.
const port = process.env.PORT || 3000;
const jwtSecretKey = process.env.JWT_SECRET_KEY
const tgBotToken = process.env.TG_BOT_TOKEN
const tgChannelId = process.env.TG_CHANNEL_ID
// Application setups.
const app = express();
const bot = new tgBot(tgBotToken, { polling: true })
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.get('/captcha', (req, res) => {
    try {
        const firstInt = Math.floor(Math.random() * 10)
        const secondInt = Math.floor(Math.random() * 10)
        const answer = firstInt + secondInt
        const captchaId = jwt.sign({ firstInt, secondInt, answer }, jwtSecretKey, { expiresIn: 60 });
        const questionText = `${firstInt} + ${secondInt}`;
        return res.status(200).json({ status: 'success', data: { captchaId, question: questionText } });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: 'Internal server error!' })
    }
})
app.post('/send', async (req, res) => {
    const { query } = req;
    try {
        const { data, name, phone } = query
        const description = query.description || ''
        if (!data || !name || !phone) { return res.status(400).json({ status: 'fail', statusCode: 400, message: 'Parametres is wrong!' }) }
        const [hash, answer] = data.split('--')
        const { err, decoded } = jwt.verify(hash, jwtSecretKey, (err, decoded) => { return { err, decoded } })
        if (err) {
            console.log(err)
            if (err.message == 'jwt expired') {
                return res.status(400).json({ status: 'fail', statusCode: 400, message: 'Captcha time expired' });
            }
            return res.status(400).json({ status: 'fail', statusCode: 400, message: 'Captcha not verified' });
        }
        if (name.length < 3) return res.status(400).json({ status: 'fail', statusCode: 400, message: 'Name cannot be short from 3 charackters!' });
        if (phone.length != 9) return res.status(400).json({ status: 'fail', message: 'Phone number is wrong!' });
        if (typeof (phone) === 'string') { if (Number(phone) === NaN) return res.status(400).json({ status: 'fail', statusCode: 400, message: 'Phone number is wrong!' }); }
        else return res.status(400).json({ status: 'fail', statusCode: 400, message: 'Phone number is wrong!' });
        if (decoded.answer != answer) return res.status(400).json({ status: 'fail', message: 'Captcha not verified' });
        const currentTime = new Date();
        const message = `
Name: ${name}
Phone: +998${phone}
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