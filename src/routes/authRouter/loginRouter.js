const { checkSchema } = require('express-validator')
const { login } = require('../../controllers/auth/login')
const { loginValidationSchema } = require('../../util/validators/loginValidation')

const router = require('express').Router()

router
    .post('/auth/login', checkSchema(loginValidationSchema), login)

module.exports = router 