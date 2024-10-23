const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

exports.roleAccessMiddleware = function (roles) {
    return async function (req, res, next) {
        try {
            const token = req.cookies.authcookie

            if (!token) {
                return res.redirect('/api/auth/login')
            }
            const { role } = jwt.verify(token, process.env.JWT_SECRET_KEY)

            if (roles != role) {
                return res.status(403).send({
                    success: false,
                    data: null,
                    error: "Access denied!"
                });
            }

            next();
        } catch (error) {
            console.log(error);
            res.redirect('/api/auth/login');
        }
    }
}