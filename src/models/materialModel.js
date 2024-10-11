const { Schema, model } = require('mongoose')

const materialSchema = new Schema({
    name: String,
    quantity: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
})

exports.Material = model('Material', materialSchema)