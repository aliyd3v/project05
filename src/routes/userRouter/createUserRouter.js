const { checkSchema } = require('express-validator');
const { createUser } = require('../../controllers/user/createUser');
const { createUserValidationSchema } = require('../../util/validators/createUserValidation');
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware');

const router = require('express').Router()
router
    .post('/create-user', roleAccessMiddleware(['admin']), checkSchema(createUserValidationSchema), createUser);

module.exports = router