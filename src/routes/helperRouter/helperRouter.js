const { redirect, badRequest } = require('../../controllers/helper/helper')

const router = require('express').Router()

router
    .get('/', redirect)
    .get('/bad-request', badRequest)

    module.exports = router