const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    name: String,
    materialsUsed: [{
        material: { type: Schema.Types.ObjectId, ref: "Material" },
        amount: { type: Number }
    }],
    createdAt: { type: Date, default: Date.now }
})

exports.Product = model('Product', productSchema)