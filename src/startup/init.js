const exphbs = require("express-handlebars")
const { connectDB } = require("../../database/db")
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config()
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        formatDate: function (date) {
            const d = new Date(date);
            const hours = d.getHours();
            const minutes = d.getMinutes();
            const day = d.getDate();
            const month = d.getMonth() + 1; // Oy 0 dan boshlanganligi uchun +1
            const year = String(d.getFullYear()).slice(-2); // Yilning oxirgi ikki raqami

            // Sana format: HH:MM DD.MM.YY
            return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year} ${hours}:${String(minutes).padStart(2, "0")}`;
        }
    }
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
        console.log('SERVER HAS BEEN LISTENING ON PORT 3000\n')
    })
}