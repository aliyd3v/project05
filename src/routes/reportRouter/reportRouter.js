const { createReportPage, createReport } = require('../../controllers/report/reportController')

const router = require('express').Router()

router
.get('/report/create', createReportPage)
.post('/report/create', createReport)
 
module.exports = router