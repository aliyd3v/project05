const { checkSchema } = require('express-validator');
const { createUser, getAllUsers, getOneUser, updateOneUser, updateUserPassword, deleteOneUser, getUpgdateOneUser, getCreateUser, getDeleteOneUser, getUpdatePassword, deleteAllBakers } = require('../../controllers/user/userController');
const { createUserValidationSchema } = require('../../util/validators/createUserValidation');
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware');
const { updateUserValidationSchema } = require('../../util/validators/updateUserValidation');
const { udpatePasswordValidationSchema } = require('../../util/validators/updateUserPasswordValidation');

const router = require('express').Router()
router
    .get('/create-user', roleAccessMiddleware(['admin']), getCreateUser)
    .post('/create-user', roleAccessMiddleware(['admin']), checkSchema(createUserValidationSchema), createUser)
    .get('/users', roleAccessMiddleware(['admin']), getAllUsers)
    .get('/user/:id', roleAccessMiddleware(['admin']), getOneUser)
    .get('/user/:id/update', roleAccessMiddleware(['admin']), getUpgdateOneUser)
    .post('/user/:id/update', roleAccessMiddleware(['admin']), checkSchema(updateUserValidationSchema), updateOneUser)
    .get('/user/:id/update-password', roleAccessMiddleware(['admin']), getUpdatePassword)
    .post('/user/:id/update-password', roleAccessMiddleware(['admin']), checkSchema(udpatePasswordValidationSchema), updateUserPassword)
    .get('/user/:id/delete', roleAccessMiddleware(['admin']), getDeleteOneUser)
    .post('/user/:id/delete', roleAccessMiddleware(['admin']), deleteOneUser)
    .post('/users/delete', roleAccessMiddleware(['admin']), deleteAllBakers)

module.exports = router