const { Schema, model} = require('mongoose')

const productSchema = new Schema({
    name: String,
    material: Object,
    createdAt: Date
})

exports.productModel = model('Product', productSchema)