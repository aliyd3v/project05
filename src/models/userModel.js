const { Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    role: {type: String, default: 'baker'},
    createdAt: { type: Date, default: Date.now }
})

exports.User = model('User', userSchema)