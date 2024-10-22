const { checkSchema } = require('express-validator')
const { getAllProducts, getOneProduct, createProduct, updatOneProduct, deleteOneProduct, deleteAllProducts } = require('../../controllers/product/productController')
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware')
const { createProductValidationSchema } = require('../../util/validators/createProductValidation')
const { udpateProductValidationSchema } = require('../../util/validators/udpateProductValidation')

const router = require('express').Router()

router
    .post('/product', roleAccessMiddleware(['admin']), checkSchema(createProductValidationSchema), createProduct)
    .get('/products', roleAccessMiddleware(['admin']), getAllProducts)
    .get('/product/:id', roleAccessMiddleware(['admin']), getOneProduct)
    .post('/product/:id/update', roleAccessMiddleware(['admin']), checkSchema(udpateProductValidationSchema), updatOneProduct)
    .post('/product/:id/delete', roleAccessMiddleware(['admin']), deleteOneProduct)
    .post('/products/delete', roleAccessMiddleware(['admin']), deleteAllProducts)

module.exports = router