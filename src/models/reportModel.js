const { Schema, model} = require('mongoose')

const reportSchema = new Schema({
    productName: String,
    quantity: Number,
    date: Date,
    reportTime: Date
})

exports.reportModel = model('Report', reportSchema)