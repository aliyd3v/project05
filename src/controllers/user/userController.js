const { checkSchema, validationResult, matchedData } = require('express-validator');
const { User } = require('../../models/userModel')
const bcrypt = require('bcrypt')

exports.createUser = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).send({
                success: false,
                data: null,
                error: errorMessages
            });
        }
        const data = matchedData(req)

        // Checking username to exists.
        const condidat = await User.findOne({ username: data.username })
        if (condidat) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "Username is already used."
            })
        }

        // Formatting date.
        function formatDate(date) {
            const d = new Date(date);
            const hours = d.getHours();
            const minutes = d.getMinutes();
            const day = d.getDate();
            const month = d.getMonth() + 1;
            const year = String(d.getFullYear()).slice(-2);
            return `${hours}:${String(minutes).padStart(2, '0')} ${day}.${month}.${year}`;
        }
        const now = new Date();
        const formattedDate = formatDate(now);

        // Hashing password
        const passwordHash = await bcrypt.hash(data.password, 10)

        // Write new user to database.
        const newUser = await User.create({
            name: data.name,
            username: data.username,
            password: passwordHash,
            createdAt: formattedDate
        })

        // Responsing.
        return res.status(200).send({
            success: true,
            error: false,
            message: 'User created successfully!',
            data: data
        })
    } catch (error) {
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