const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

exports.jwtAccessMiddleware = function (req, res, next) {
    try {
        const token = req.cookies.authcookie;

        if (!token) {
            return res.redirect('/api/auth/login');
        }

        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

        next();
    } catch (error) {
        console.log(error);
        return res.redirect('/api/auth/login');
    }
}