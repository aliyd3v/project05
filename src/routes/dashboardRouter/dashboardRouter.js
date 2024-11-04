const { getDashboard } = require('../../controllers/dashboard/dashboardController')
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware')

const router = require('express').Router()

router
.get('/dashboard', roleAccessMiddleware(['admin']), getDashboard)

module.exports = router