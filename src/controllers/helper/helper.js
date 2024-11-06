const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

exports.redirect = async (req, res) => {
    // Checking token to exists.
    const token = req.cookies.authcookie
    if (!token) {
        // Redirecting.
        return res.redirect('/api/auth/login')
    }
    const { role } = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // Redirecting.
    if (role == 'admin') {
        return res.redirect('/api/dashboard')
    } else {
        return res.redirect('/api/create-report')
    }
}

exports.badRequest = (req, res) => {
    return res.render('bad-request', {
        layout: false,
        title: 'Bad request!'
    })
}