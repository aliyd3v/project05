const { checkSchema, validationResult, matchedData } = require('express-validator');
const { User } = require('../../models/userModel')
const bcrypt = require('bcrypt');
const { Report } = require('../../models/reportModel');

exports.getCreateUser = async (req, res) => {
    return res.render('create-user', {
        title: 'Add baker'
    })
}

exports.createUser = async (req, res) => {
    try {
        // Validation result.
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            // Alert.
            const alert = {
                success: false,
                message: errorMessages
            }
            return res.render('create-user', {
                title: 'Add baker',
                alert
            })
        }
        const data = matchedData(req)

        // Checking username to exists.
        const condidat = await User.findOne({ username: data.username })
        if (condidat) {
            // Alert.
            const alert = {
                success: false,
                message: "Username is already used! Please enter another username."
            }
            return res.render('create-user', {
                title: 'Add baker',
                alert
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

        // Alert.
        const alert = {
            success: true,
            message: `User is created successful.`
        }
        const user = newUser

        // Rendering.
        res.render('user', {
            title: `${user.name}`,
            alert,
            user
        })
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

exports.getAllUsers = async (req, res) => {
    try {
        // Finding all users.
        const users = await User.find()
        if (!users.length) {
            // Rendering.
            return res.render('users', {
                title: 'Users',
                isUsers: true
            })
        }

        // Get all users without admin.
        const allUsers = []
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            const userReports = await Report.find({ producedBy: user.id })
            if (user.role != 'admin')
                allUsers.push({
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    createdAt: user.createdAt.toLocaleDateString(),
                    reportsAmount: userReports.length
                })
        }

        for (let i = 0; i < allUsers.length; i++) {
            allUsers[i].number = i + 1
        }

        // Rendering.
        return res.render('users', {
            title: 'Bakers',
            allUsers,
            isUsers: true
        })

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

exports.getOneUser = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).redirect('/api/bad-request')
        }

        // Finding user by id & checking to exists.
        const user = await User.findById(id)
        if (!user) {
            // Alert.
            const alert = {
                success: false,
                message: 'Baker not found!'
            }

            // Get all users without admin.
            const users = await User.find()
            const allUsers = []
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                const userReports = await Report.find({ producedBy: user.id })
                if (user.role != 'admin')
                    allUsers.push({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        createdAt: user.createdAt.toLocaleDateString(),
                        reportsAmount: userReports.length
                    })
            }
            for (let i = 0; i < allUsers.length; i++) {
                allUsers[i].number = i + 1
            }

            // Rendering.
            return res.render('users', {
                title: 'Bakers',
                allUsers,
                isUsers: true,
                alert
            })
        }

        // Rendering.
        return res.render('user', {
            title: `${user.name}`,
            user
        })
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

exports.getUpgdateOneUser = async (req, res) => {
    const id = req.params.id
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).redirect('/api/bad-request')
        }

        // Finding user by id & checking to exists.
        const user = await User.findById(id)
        if (!user) {
            // Alert.
            const alert = {
                success: false,
                message: 'Baker not found!'
            }

            // Get all users without admin.
            const users = await User.find()
            const allUsers = []
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                const userReports = await Report.find({ producedBy: user.id })
                if (user.role != 'admin')
                    allUsers.push({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        createdAt: user.createdAt.toLocaleDateString(),
                        reportsAmount: userReports.length
                    })
            }
            for (let i = 0; i < allUsers.length; i++) {
                allUsers[i].number = i + 1
            }

            // Rendering.
            return res.render('users', {
                title: 'Bakers',
                allUsers,
                isUsers: true,
                alert
            })
        }

        // Rendering.
        return res.render('user-update', {
            title: 'Update baker',
            user
        })
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

exports.updateOneUser = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).redirect('/api/bad-request')
        }

        // Finding user by id & checking to exists.
        const oldUser = await User.findById(id)
        if (!oldUser) {
            // Alert.
            const alert = {
                success: false,
                message: 'Baker not found!'
            }

            // Get all users without admin.
            const users = await User.find()
            const allUsers = []
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                const userReports = await Report.find({ producedBy: user.id })
                if (user.role != 'admin')
                    allUsers.push({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        createdAt: user.createdAt.toLocaleDateString(),
                        reportsAmount: userReports.length
                    })
            }
            for (let i = 0; i < allUsers.length; i++) {
                allUsers[i].number = i + 1
            }

            // Rendering.
            return res.render('users', {
                title: 'Bakers',
                allUsers,
                isUsers: true,
                alert
            })
        }

        // Validation result.
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            const user = await User.findById(id)
            // Alert.
            const alert = {
                success: false,
                message: errorMessages
            }
            // Rendering.
            return res.render('user-update', {
                title: 'Update baker',
                user,
                alert
            })
        }
        const data = matchedData(req)

        if (data.username != oldUser.username) {
            const condidat = await User.findOne({ username: data.username })
            if (condidat) {
                // Alert.
                const alert = {
                    success: false,
                    message: 'With tish usename already exists baker! Please enter another username.'
                }
                const user = data
                user._id = id
                // Rendering.
                return res.render('user-update', {
                    title: 'Update baker',
                    user,
                    alert
                })
            }
        }

        // Updating and writing changes to database.
        const updating = {
            name: data.name,
            username: data.username
        }
        let updatedUser = await User.findByIdAndUpdate(id, updating)
        const user = await User.findById(id)

        // Alert.
        const alert = {
            success: true,
            message: `Baker is updated successful.`
        }

        // Rendering.
        return res.render('user', {
            title: `${updatedUser.name}`,
            user,
            alert
        })
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

exports.getUpdatePassword = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).redirect('/api/bad-request')
        }

        // Finding user by id & checking to exists.
        const user = await User.findById(id)
        if (!user) {
            // Alert.
            const alert = {
                success: false,
                message: 'Baker not found!'
            }

            // Get all users without admin.
            const users = await User.find()
            const allUsers = []
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                const userReports = await Report.find({ producedBy: user.id })
                if (user.role != 'admin')
                    allUsers.push({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        createdAt: user.createdAt.toLocaleDateString(),
                        reportsAmount: userReports.length
                    })
            }
            for (let i = 0; i < allUsers.length; i++) {
                allUsers[i].number = i + 1
            }

            // Rendering.
            return res.render('users', {
                title: 'Bakers',
                allUsers,
                isUsers: true,
                alert
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
            return res.status(400).redirect('/api/bad-request')
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
            return res.status(400).redirect('/api/bad-request')
        }

        // Finding user by id & checking to exists.
        const user = await User.findById(id)
        if (!user) {
            // Alert.
            const alert = {
                success: false,
                message: 'Baker not found!'
            }

            // Get all users without admin.
            const users = await User.find()
            const allUsers = []
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                const userReports = await Report.find({ producedBy: user.id })
                if (user.role != 'admin')
                    allUsers.push({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        createdAt: user.createdAt.toLocaleDateString(),
                        reportsAmount: userReports.length
                    })
            }
            for (let i = 0; i < allUsers.length; i++) {
                allUsers[i].number = i + 1
            }

            // Rendering.
            return res.render('users', {
                title: 'Bakers',
                allUsers,
                isUsers: true,
                alert
            })
        }

        // Validation result.
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            // Alert.
            const alert = {
                success: false,
                message: errorMessages
            }
            // Rendering.
            return res.render('update-user-password', {
                title: 'Update password',
                user,
                alert
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

        // Alert.
        const alert = {
            success: true,
            message: 'Password has been updated successful!'
        }

        // Rendering.
        return res.render('user', {
            title: 'User',
            user,
            alert
        })
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

exports.getDeleteOneUser = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).redirect('/api/bad-request')
        }

        // Finding user by id & checking to exists.
        const user = await User.findById(id)
        if (!user) {
            // Alert.
            const alert = {
                success: false,
                message: 'Baker not found!'
            }

            // Get all users without admin.
            const users = await User.find()
            const allUsers = []
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                const userReports = await Report.find({ producedBy: user.id })
                if (user.role != 'admin')
                    allUsers.push({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        createdAt: user.createdAt.toLocaleDateString(),
                        reportsAmount: userReports.length
                    })
            }
            for (let i = 0; i < allUsers.length; i++) {
                allUsers[i].number = i + 1
            }

            // Rendering.
            return res.render('users', {
                title: 'Bakers',
                allUsers,
                isUsers: true,
                alert
            })
        }

        res.render('delete-user', {
            title: 'Delete user',
            user
        })

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

exports.deleteOneUser = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).redirect('/api/bad-request')
        }

        // Finding user by id & checking to exists.
        const user = await User.findById(id)
        if (!user) {
            // Alert.
            const alert = {
                success: false,
                message: 'Baker not found!'
            }

            // Get all users without admin.
            const users = await User.find()
            const allUsers = []
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                const userReports = await Report.find({ producedBy: user.id })
                if (user.role != 'admin')
                    allUsers.push({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        createdAt: user.createdAt.toLocaleDateString(),
                        reportsAmount: userReports.length
                    })
            }
            for (let i = 0; i < allUsers.length; i++) {
                allUsers[i].number = i + 1
            }

            // Rendering.
            return res.render('users', {
                title: 'Bakers',
                allUsers,
                isUsers: true,
                alert
            })
        }

        const name = user.name

        // Deleting from database.
        await User.findByIdAndDelete(id)

        // Alert.
        const alert = {
            success: false,
            message: `Baker ${name} has been deleted successful.`
        }

        // Get all users without admin.
        const users = await User.find()
        const allUsers = []
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            const userReports = await Report.find({ producedBy: user.id })
            if (user.role != 'admin')
                allUsers.push({
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    createdAt: user.createdAt.toLocaleDateString(),
                    reportsAmount: userReports.length
                })
        }
        for (let i = 0; i < allUsers.length; i++) {
            allUsers[i].number = i + 1
        }

        // Rendering.
        return res.render('users', {
            title: 'Bakers',
            allUsers,
            isUsers: true,
            alert
        })
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

exports.deleteAllBakers = async (req, res) => {
    try {
        // Checking for exists.
        const bakers = await User.find({
            role: 'baker'
        })
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
            return res.status(400).redirect('/api/bad-request')
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}