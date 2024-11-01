const { checkSchema } = require('express-validator')
const { getAllMaterials, createMaterial, updateMaterial, deleteMaterial, getOneMaterial, getUpdateMaterial, getCreateMaterial, deleteAllMaterials, getDdelteMaterial, addToMaterial, reduceFromMaterial } = require('../../controllers/material/materialController')
const { materialSchema, updateMaterialSchema } = require('../../util/validators/materialValidate')
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware')
const { changeMaterialQuantityValidationSchema } = require('../../util/validators/changeMaterialQuantityValidation')

const router = require('express').Router()

router
    .get('/create-material', roleAccessMiddleware(['admin']), getCreateMaterial)
    .get('/materials', roleAccessMiddleware(['admin']), getAllMaterials)
    .get('/material/:id', roleAccessMiddleware(['admin']), getOneMaterial)
    .post('/create-material', roleAccessMiddleware(['admin']), checkSchema(materialSchema), createMaterial)
    .get('/material/:id/update', roleAccessMiddleware(['admin']), getUpdateMaterial)
    .post('/material/:id/update', roleAccessMiddleware(['admin']), checkSchema(updateMaterialSchema), updateMaterial)
    .get('/material/:id/delete', roleAccessMiddleware(['admin']), getDdelteMaterial)
    .post('/material/:id/delete', roleAccessMiddleware(['admin']), deleteMaterial)
    .post('/materials/delete', roleAccessMiddleware(['admin']), deleteAllMaterials)
    .post('/material/:id/add', roleAccessMiddleware(['admin']), checkSchema(changeMaterialQuantityValidationSchema), addToMaterial)
    .post('/material/:id/reduce', roleAccessMiddleware(['admin']), checkSchema(changeMaterialQuantityValidationSchema), reduceFromMaterial)

module.exports = router