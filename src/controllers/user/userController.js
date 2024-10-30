const { checkSchema, validationResult, matchedData } = require('express-validator');
const { User } = require('../../models/userModel')
const bcrypt = require('bcrypt')

exports.getCreateUser = async (req, res) => {
    res.render('create-user', {
        title: 'Create user'
    })
}

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
                error: { message: "Username is already used." }
            })
        }

        // Hashing password
        const passwordHash = await bcrypt.hash(data.password, 10)
        delete data.password

        // Write new user to database.
        const newUser = await User.create({
            name: data.name,
            username: data.username,
            password: passwordHash
        })

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: `User is created successful. Username: ${data.username}`
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

        // Give all users without admins.
        const allUsers = []
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            if (user.role != 'admin')
                allUsers.push({ id: user._id, name: user.name, username: user.username, createdAt: user.createdAt.toLocaleDateString() })
        }

        return res.render('users', {
            title: 'Users',
            allUsers,
            isUsers: true
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

        // Finding user by id & checking to exists.
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

exports.getUpgdateOneUser = async (req, res) => {
    const id = req.params.id
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Checking user to exists.
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "User not found!"
            })
        }

        // Rendering.
        res.render('user-update', {
            title: 'Update user',
            user
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

        // Finding user by id & checking to exists.
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
        const updating = {
            name: data.name || user.name,
            username: data.username || user.username
        }

        await User.findByIdAndUpdate(id, updating)

        // Responsing.
        return res.redirect(`/api/user/${id}`)
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

exports.getUpdatePassword = async (req, res) => {
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

        // Checking user to exists.
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "User not found!"
            })
        }

        // Rendering.
        res.render('update-user-password', {
            title: 'Update password',
            user
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

        // Finding user by id & checking to exists.
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

        // Hashing password.
        const passwordHash = bcrypt.hash(data.password, 10)
        delete data.password

        // Updating and writing changes to database.
        const updating = await User.findByIdAndUpdate(id, {
            ...user,
            password: passwordHash
        }, { new: true })

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

exports.getDeleteOneUser = async (req, res) => {
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

        const user = await User.findById(id)

        res.render('delete-user', {
            title: 'Delete user',
            user
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
        return res.redirect('/api/users')
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

exports.deleteAllBakers = async (req, res) => {
    try {
        // Checking for exists.
        const bakers = await User.find({
            role: 'baker'
        })
        console.log(bakers)
        if (!bakers) {
            return res.status(200).send({
                success: false,
                data: null,
                error: "Bakers is empty!"
            })
        }

        // Deleting bakers from database.
        await User.deleteMany({ role: 'baker' })

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: "Bakers is deleted successful."
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