const exphbs = require("express-handlebars")
const { connectDB } = require("../../database/db")
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config()
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});


exports.appSetup = (app, express) => {
    connectDB()

    // Setup express-handlebars.
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    app.set('views', './views');


    // Set public folder to static.
    app.use(express.static('public'))

    // Setup cookie-parser
    app.use(cookieParser(process.env.COOKIE_PARSER_KEY))

    // Working with body.
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));

    app.listen(3000, () => {
        console.log(`
    < < < < < _SERVER_HAS_BEEN_LISTENING_ON_PORT_3000_ > > > > >
`)
    })
}