const { connectDB } = require("../../database/db")
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config()


exports.appSetup = (app, express) => {
    connectDB()

    app.use(cookieParser(process.env.COOKIE_PARSER_KEY))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));

    app.listen(3000, () => {
        console.log(`
    < < < < < _SERVER_HAS_BEEN_LISTENING_ON_PORT_3000_ > > > > >
`)
    })
}