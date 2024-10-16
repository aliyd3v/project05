const { checkSchema } = require('express-validator')
const { getAllMaterials, createMaterial, updateMaterial, deleteMaterial, getOneMaterial, getUpdateMaterial, getCreateMaterial } = require('../../controllers/material/materialController')
const { materialSchema, updateMaterialSchema } = require('../../util/validators/materialValidate')

const router = require('express').Router()

router
.get('/create-material', getCreateMaterial)
.get('/materials', getAllMaterials)
.get('/material/:id', getOneMaterial)
.get('/update-material/:id', getUpdateMaterial)
.post('/create-material', checkSchema(materialSchema), createMaterial)
.post('/update-material/:id', checkSchema(updateMaterialSchema), updateMaterial)
.post('/delete-material/:id', deleteMaterial)

module.exports = router