const { getAllMaterials } = require('../../controllers/material/materialController')

const router = require('express').Router()

router
.get('/materials', getAllMaterials)

module.exports = router