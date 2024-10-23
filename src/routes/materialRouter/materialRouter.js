const { checkSchema } = require('express-validator')
const { getAllMaterials, createMaterial, updateMaterial, deleteMaterial, getOneMaterial, getUpdateMaterial, getCreateMaterial } = require('../../controllers/material/materialController')
const { materialSchema, updateMaterialSchema } = require('../../util/validators/materialValidate')
const { roleAccessMiddleware } = require('../../middlewares/role-access-middleware')

const router = require('express').Router()

router
.get('/create-material', roleAccessMiddleware(['admin']), getCreateMaterial)
.get('/materials', roleAccessMiddleware(['admin']), getAllMaterials)
.get('/material/:id', roleAccessMiddleware(['admin']), getOneMaterial)
.post('/create-material', roleAccessMiddleware(['admin']), checkSchema(materialSchema), createMaterial)
.get('/material/:id/update', roleAccessMiddleware(['admin']), getUpdateMaterial)
.post('/material/:id/update', roleAccessMiddleware(['admin']), checkSchema(updateMaterialSchema), updateMaterial)
.post('/delete-material/:id', roleAccessMiddleware(['admin']), deleteMaterial)

module.exports = router