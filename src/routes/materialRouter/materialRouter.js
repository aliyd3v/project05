const { getAllMaterials, createMaterial } = require('../../controllers/material/materialController')

const router = require('express').Router()

router
.get('/materials', getAllMaterials)
.post('/create-material', createMaterial)

module.exports = router