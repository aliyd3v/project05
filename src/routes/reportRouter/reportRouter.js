const { checkSchema } = require('express-validator')
const { createReportPage, createReport, getOneReport, getAllReports, updateOneReport, deleteOneReport, deleteAllReports, createReportPageForAdmin } = require('../../controllers/report/reportController')
const { createReportValidationSchema } = require('../../util/validators/createReportValidation')
const { updateReportValidationSchema } = require('../../util/validators/updateReportValidation')
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware')

const router = require('express').Router()

router
    .get('/create-report', createReportPage)
    .get('/report/create', roleAccessMiddleware(['admin']), createReportPageForAdmin)
    .post('/report/create', checkSchema(createReportValidationSchema), createReport)
    .get('/reports', roleAccessMiddleware(['admin']), getAllReports)
    .get('/report/:id', roleAccessMiddleware(['admin']), getOneReport)
    .post('/report/:id/update', roleAccessMiddleware(['admin']), checkSchema(updateReportValidationSchema), updateOneReport)
    .post('/report/:id/delete', roleAccessMiddleware(['admin']), deleteOneReport)
    .post('/reports/delete', roleAccessMiddleware(['admin']), deleteAllReports)

module.exports = router