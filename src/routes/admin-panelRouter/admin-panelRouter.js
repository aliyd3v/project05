const { adminPanel } = require('../../controllers/adminPanel/admin-panel')

const router = require('express').Router()

router
.get('/admin-panel',  adminPanel)

module.exports = router