const { Schema, model } = require('mongoose')

const reportSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    quantityProduced: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    producedAt: Date,
    createdAt: { type: Date, default: Date.now }
})

exports.Report = model('Report', reportSchema)