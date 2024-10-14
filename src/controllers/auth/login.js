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
        return res.render('login')
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

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                data: null,
                error: errors.map(error => error.msg)
            })
        }
        const data = matchedData(req)

        // Checking username
        const user = await User.findOne({ username: data.username }).lean()
        if (!user) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "User not found!"
            })
        }

        // Checking user password
        const checkPassword = await bcrypt.compare(data.password, user.password)
        if (!checkPassword) {
            res.status(403).send({
                success: false,
                data: null,
                error: 'Password is wrong!'
            })
        }

        // Generate token.
        const userId = user._id
        const role = user.role
        const token = generateToken(userId, role)

        res.cookie('authcookie', token, { httpOnly: true })

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: 'Login successful.',
            data: {
                userId,
                token
            }
        })
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