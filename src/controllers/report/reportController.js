const { validationResult, matchedData } = require("express-validator")
const { Report } = require("../../models/reportModel")
const { Product } = require("../../models/productModel")
const { Material } = require("../../models/materialModel")
const { verify } = require("jsonwebtoken")

exports.createReportPage = async (req, res) => {
    return res.render('create-report', {
        layout: false
    })
}

exports.createReportPageForAdmin = async (req, res) => {
    return res.render('create-report-for-admin')
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

        // Writing new report to database.
        const newReport = await Report.create({
            ...data,
            producedBy: user.id
        })

        // Reduce the material from the database depending on the product.
        const product = await Product.findById(data.product).populate('materialsUsed')
        const materials = product.materialsUsed
        const updatingMaterialQuantity = async function (id, amount) {
            const currentMaterial = await Material.findById(id).lean()
            if (currentMaterial) {
                const updateMaterialQuantity = await Material.findByIdAndUpdate(id, {
                    ...currentMaterial,
                    quantity: currentMaterial.quantity - amount
                })
            }
        }
        for (let i = 0; i < materials.length; i++) {
            updatingMaterialQuantity(materials[i]._id, materials[i].amount)
        }

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

exports.getAllReports = async (req, res) => {
    try {
        // Checking for exists.
        const reports = await Report.find()
        if (!reports.length) {
            return res.status(200).send({
                success: true,
                error: false,
                message: "Reports is empty."
            })
        }

        // Responsing.
        return res.status(200).send({
            success: true,
            error: false,
            data: { reports }
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

exports.getOneReport = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Checking for exists report.
        const report = await Report.findById(id)
        if (!report) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "Report not found."
            })
        }

        // Responsing.
        return res.status(200).send({
            success: true,
            error: false,
            data: { report }
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

exports.updateOneReport = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Checking for exists.
        let report = await Report.findById(id).lean()
        if (!report) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "Report not found."
            })
        }

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

        // Function for reduce the material from the database depending on the product.
        const reduceMaterialQuantity = async function (id, amount) {
            const currentMaterial = await Material.findById(id).lean()
            if (currentMaterial) {
                const reduceMaterialQuantity = await Material.findByIdAndUpdate(id, {
                    ...currentMaterial,
                    quantity: currentMaterial.quantity - amount
                })
            }
        }

        // Function for add the material from to database depending on the product.
        const addMaterialQuantity = async function (id, amount) {
            const currentMaterial = await Material.findById(id).lean()
            if (currentMaterial) {
                const addMaterialQuantity = await Material.findByIdAndUpdate(id, {
                    ...currentMaterial,
                    quantity: currentMaterial.quantity + amount
                })
            }
        }

        // Writing updates to database.
        if (report.product == data.product && report.quantityProduced == data.quantityProduced) {
            report = { ...report, ...data }
        } else if (report.product == data.product && report.quantityProduced != data.quantityProduced) {
            const differenceInQuantity = report.quantityProduced - data.quantityProduced

            // Product
            const product = await Product.findById(data.product).populate('materialsUsed')
            const materials = product.materialsUsed

            for (let i = 0; i < materials.length; i++) {
                addMaterialQuantity(materials[i]._id, (differenceInQuantity * materials[i].amount))
            }

            report = { ...report, ...data }
        } else if (report.product != data.product) {
            // Product before
            const productBefore = await Product.findById(report.product).populate('materialsUsed')
            const reportMaterials = productBefore.materialsUsed

            // Product after
            const productAter = await Product.findById(data.product).populate('materialsUsed')
            const reqMaterials = productAter.materialsUsed

            for (let i = 0; i < reportMaterials.length; i++) {
                addMaterialQuantity(reportMaterials[i]._id, (productBefore.quantityProduced * reportMaterials[i].amount))
            }

            for (let i = 0; i < reqMaterials.length; i++) {
                reduceMaterialQuantity(reqMaterials[i]._id, (productAter.quantityProduced * reqMaterials[i].amount))
            }

            report = { ...report, ...data }
        }
        const updatedReport = await Report.findByIdAndUpdate(id, report, { new: true }).lean()

        // Responsing.
        return res.status(201).send({
            succes: true,
            error: false,
            data: { updatedReport }
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

exports.deleteOneReport = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Checking for exists.
        const report = await Report.findById(id)
        if (!report) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "Report not found."
            })
        }

        // Deleting from database.
        await Report.findByIdAndDelete(id)

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: "Report is deleted successful."
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

exports.deleteAllReports = async (req, res) => {
    try {
        // Checking for exists.
        const reports = await Report.find()
        if (!reports) {
            return res.status(200).send({
                succes: true,
                error: false,
                message: "Reports is empty."
            })
        }

        // Deleting reports from database.
        await Report.deleteMany()

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: "Reports deleted successful."
        })
    } catch (error) {
        // Error handling.
        console.log(error);
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
            error: "INTERLA_SERVER_ERROR"
        })
    }
}