const { logout } = require('../../controllers/auth/logout')

const router = require('express').Router()

router
    .get('/auth/logout', logout)

module.exports = router