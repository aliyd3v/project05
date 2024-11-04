const { redirect } = require('../../controllers/helper/helper')

const router = require('express').Router()

router
.get('/', redirect)

module.exports = router