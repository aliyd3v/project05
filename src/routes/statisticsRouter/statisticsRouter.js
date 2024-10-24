const { getAllStatistics } = require('../../controllers/statistics/statisticsController')
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware')

const router = require('express').Router()

router
.get('/statistics', roleAccessMiddleware(['admin']), getAllStatistics)

module.exports = router