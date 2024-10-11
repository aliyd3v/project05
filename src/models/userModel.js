const { Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    role: {type: String, default: 'baker'},
    createdat: Date
})

exports.userModel = model('User', userSchema)
