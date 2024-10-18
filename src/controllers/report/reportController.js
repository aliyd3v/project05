const { validationResult, matchedData } = require("express-validator")
const { Report } = require("../../models/reportModel")
const { verify } = require("jsonwebtoken")

exports.createReportPage = async (req, res) => {
    return res.render('create-report', {
        layout: false
    })
}

exports.createReport = async (req, res) => {
    try {
        // Validation result.
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).send({
                success: false,
                data: null,
                error: errorMessages
            });
        }
        const data = matchedData(req)

        // taking user id.
        const token = req.cookies.authcookie;
        const user = verify(token, process.env.JWT_SECRET_KEY)

        // Writing to database.
        const newReport = await Report.create({
            product: data.product,
            producedBy: user._id,
            producedAt: data.producedAt
        })

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: 'Report created successfully!',
            data: newReport
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
            error: 'INTERNAL_SERVER_ERROR!'
        })
    }
}