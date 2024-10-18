const { adminPanel } = require('../../controllers/adminPanel/admin-panel')
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware')

const router = require('express').Router()

router
.get('/admin-panel', roleAccessMiddleware(['admin']), adminPanel)

module.exports = router