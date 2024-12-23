const { checkSchema } = require('express-validator')
const { getAllProducts, getOneProduct, createProduct, updatOneProduct, deleteOneProduct, getUpdateOneProduct, getDeleteOneProduct, getCreateProduct, deleteAllProducts, getUpdateOneProductMaterials, updatOneProductMaterials } = require('../../controllers/product/productController')
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware')
const { createProductValidationSchema } = require('../../util/validators/createProductValidation')
const { udpateProductValidationSchema } = require('../../util/validators/udpateProductValidation')

const router = require('express').Router()

router
    .get('/create-product', roleAccessMiddleware(['admin']), getCreateProduct)
    .post('/create-product', roleAccessMiddleware(['admin']), checkSchema(createProductValidationSchema), createProduct)
    .get('/products', roleAccessMiddleware(['admin']), getAllProducts)
    .get('/product/:id', roleAccessMiddleware(['admin']), getOneProduct)
    .get('/product/:id/update', roleAccessMiddleware(['admin']), getUpdateOneProduct)
    .get('/product/:id/update-materials', roleAccessMiddleware(['admin']), getUpdateOneProductMaterials)
    .post('/product/:id/update', roleAccessMiddleware(['admin']), checkSchema(udpateProductValidationSchema), updatOneProduct)
    .post('/product/:id/update-materials', roleAccessMiddleware(['admin']), updatOneProductMaterials)
    .get('/product/:id/delete', roleAccessMiddleware(['admin']), getDeleteOneProduct)
    .post('/product/:id/delete', roleAccessMiddleware(['admin']), deleteOneProduct)
    .post('/products/delete', roleAccessMiddleware(['admin']), deleteAllProducts)

module.exports = router