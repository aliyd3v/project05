const { Schema, model } = require('mongoose')

const reportSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    producedBy: { type: Schema.Types.ObjectId, ref: "User" },
    quantityProduced: Number,
    producedAt: Date
}, { timestamps: true })

exports.Report = model('Report', reportSchema)