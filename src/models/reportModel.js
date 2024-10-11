const { Schema, model } = require('mongoose')

const reportSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantityProduced: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    producedAt: Date,
    createdAt: { type: Date, default: Date.now }
})

exports.Report = model('Report', reportSchema)