const { Schema, model} = require('mongoose')

const materialSchema = new Schema({
    name: String,
    amount: Number,
    createdAt: Date
})

exports.materialModel = model('Material', materialSchema)