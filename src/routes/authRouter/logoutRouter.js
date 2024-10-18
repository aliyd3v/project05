const { logout } = require('../../controllers/auth/logout')

const router = require('express').Router()

router
    .post('/auth/logout', logout)

module.exports = router