const { checkSchema } = require('express-validator')
const { login, loginPage } = require('../../controllers/auth/login')
const { loginValidationSchema } = require('../../util/validators/loginValidation')

const router = require('express').Router()

router
    .get('/auth/login', loginPage)
    .post('/auth/login', checkSchema(loginValidationSchema), login)

module.exports = router 