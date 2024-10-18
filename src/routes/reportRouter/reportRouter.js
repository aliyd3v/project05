const { checkSchema } = require('express-validator')
const { createReportPage, createReport } = require('../../controllers/report/reportController')
const { createReportValidationSchema } = require('../../util/validators/createReportValidation')

const router = require('express').Router()

router
    .get('/report/create', createReportPage)
    .post('/report/create', checkSchema(createReportValidationSchema), createReport)

module.exports = router