const { checkSchema, validationResult, matchedData } = require('express-validator');
const { User } = require('../../models/userModel')
const bcrypt = require('bcrypt')

exports.createUser = async (req, res) => {
    try {
        // Validation result.
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

        // Hashing password
        const passwordHash = await bcrypt.hash(data.password, 10)

        // Write new user to database.
        const newUser = await User.create({
            name: data.name,
            username: data.username,
            password: passwordHash
        })

        // Responsing.
        return res.status(200).send({
            success: true,
            error: false,
            message: 'User created successfully!',
            data: data
        })
    } catch (error) {
        // Error handling.
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

exports.getAllUsers = async (req, res) => {
    try {
        // Finding all users.
        const users = await User.find()
        if (!users.length) {
            return res.status(200).send({
                success: true,
                error: false,
                message: 'Users is empty.'
            })
        }

        return res.render('users', {
            title: 'Users',
            users
        })

        // Give all users without admins.
        const allUsers = []
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            if (user.role != 'admin')
                allUsers.push({ name: user.name, username: user.username, createdAt: user.createdAt.toLocaleDateString() })
        }
    } catch (error) {
        // Error handling.
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

exports.getOneUser = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Finding user by id.
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                data: null,
                error: 'User not found!'
            })
        }

        return res.render('user', {
            title: 'User',
            user
        }
        )
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

exports.updateOneUser = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Finding user by id.
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                data: null,
                error: 'User not found!'
            })
        }

        // Validation result.
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(400).send({
                success: false,
                data: null,
                error: errorMessages
            })
        }
        const data = matchedData(req)

        // Updating and writing changes to database.
        const updating = await User.findByIdAndUpdate(id, {
            ...user,
            name: data.name,
            username: data.username
        })

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: "User is updated successful.",
            data: {
                user: {
                    name: data.name,
                    username: data.username,
                    createdAt: user.createdAt,
                }
            }
        })
    } catch (error) {
        // Error handling.
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

exports.updateUserPassword = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Finding user by id.
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                data: null,
                error: 'User not found!'
            })
        }

        // Validation result.
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(400).send({
                success: false,
                data: null,
                error: errorMessages
            })
        }
        const data = matchedData(req)

        // Updating and writing changes to database.
        const updating = await User.findByIdAndUpdate(id, {
            ...user,
            password: data.password
        })

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: "User password is updated successful."
        })
    } catch (error) {
        // Error handling.
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

exports.deleteOneUser = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Checking for exists.
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "User not found!"
            })
        }

        // Deleting from database.
        await User.findByIdAndDelete(id)

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: "User is deleted successful."
        })
    } catch (error) {
        // Error handling.
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