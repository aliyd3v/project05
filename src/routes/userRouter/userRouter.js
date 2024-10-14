const { checkSchema } = require('express-validator');
const { createUser, getAllUsers, getOneUser, updateOneUser, updateUserPassword, deleteOneUser } = require('../../controllers/user/userController');
const { createUserValidationSchema } = require('../../util/validators/createUserValidation');
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware');
const { updateUserValidationSchema } = require('../../util/validators/updateUserValidation');
const { udpatePasswordValidationSchema } = require('../../util/validators/updateUserPasswordValidation');

const router = require('express').Router()
router
    .post('/create-user', roleAccessMiddleware(['admin']), checkSchema(createUserValidationSchema), createUser)
    .get('/users', roleAccessMiddleware(['admin']), getAllUsers)
    .get('/user/:id', roleAccessMiddleware(['admin']), getOneUser)
    .post('/user/:id/update', roleAccessMiddleware(['admin']), checkSchema(updateUserValidationSchema), updateOneUser)
    .post('/user/:id/update-password', roleAccessMiddleware(['admin']), checkSchema(udpatePasswordValidationSchema), updateUserPassword)
    .post('/user/:id/delete', roleAccessMiddleware(['admin']), deleteOneUser)

module.exports = router