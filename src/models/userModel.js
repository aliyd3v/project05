const { Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    role: {type: String, default: 'user'},
    createdat: Date
})

exports.userModel = model('User', userSchema)