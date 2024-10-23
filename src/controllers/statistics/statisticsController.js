const { Material } = require("../../models/materialModel")
const { Product } = require("../../models/productModel")
const { Report } = require("../../models/reportModel")
const { User } = require("../../models/userModel")

exports.getAllStatistics = async (req, res) => {
    try {
        const users = await User.find()
        const usersLength = users.length
        const materials = await Material.find()
        const products = await Product.find()
        const reports = await Report.find()
        return res.render('statistics', {
            title: "Statistics",
            users,
            usersLength,
            materials,
            products,
            reports,
            isStatistics: true
        })
    } catch (error) {
        // Error handling.
        console.log(error)
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERNAL_SERVER_ERROR!"
        })
    }
}