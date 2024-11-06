const { validationResult, matchedData } = require("express-validator")
const bcrypt = require('bcrypt')
const { User } = require('../../models/userModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser")
const config = dotenv.config()

const generateToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, process.env.JWT_SECRET_KEY)
}

exports.loginPage = async (req, res) => {
    try {
        // Checking token to exists & valid.
        const token = req.cookies.authcookie;
        if (token) {
            const { role } = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (role) {
                if (role == 'admin') {
                    // Redirecting.
                    return res.redirect('/api/dashboard')
                } else if (role == 'baker') {
                    // Redirecting.
                    return res.redirect('/api/create-report')
                }
            } else {
                // Rendering.
                return res.render('login', {
                    layout: false
                })
            }
        } else {
            // Rendering.
            return res.render('login', {
                layout: false
            })
        }
    } catch (error) {
        // Error handling.
        console.log(error);
        if (error.message) {
            return res.status(400).redirect('/api/bad-request')
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}

exports.login = async (req, res) => {
    try {
        // Error handling.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                data: null,
                error: errors.array().map(error => error.msg)
            })
        }
        const data = matchedData(req)

        // Checking username to exists.
        const user = await User.findOne({ username: data.username }).lean()
        if (!user) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "User not found!"
            })
        }

        // Checking user password.
        const checkPassword = bcrypt.compare(data.password, user.password)
        if (!checkPassword) {
            return res.status(403).send({
                success: false,
                data: null,
                error: 'Password is wrong!'
            })
        }

        // Generate token.
        const userId = user._id
        const role = user.role
        const token = generateToken(userId, role)

        // Writing cookies.
        res.cookie('authcookie', token, { httpOnly: true })
        res.cookie('userId', userId, { httpOnly: true })

        // Send to endpoint.
        if (role == 'admin') {
            return res.redirect('/api/dashboard')
        } else {
            return res.redirect('/api/create-report')
        }
    } catch (error) {
        // Handling errors.
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}