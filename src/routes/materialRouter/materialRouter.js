const { checkSchema } = require('express-validator')
const { getAllMaterials, createMaterial, updateMaterial, deleteMaterial } = require('../../controllers/material/materialController')
const { materialSchema, updateMaterialSchema } = require('../../util/validators/materialValidate')

const router = require('express').Router()

router
.get('/materials', getAllMaterials)
.post('/create-material', checkSchema(materialSchema), createMaterial)
.post('/update-material/:id', updateMaterial)
.post('/delete-material/:id', deleteMaterial)

module.exports = router