const { default: mongoose } = require("mongoose");
const { Product } = require("../../models/productModel");
const { validationResult, matchedData } = require("express-validator");
const { Material } = require('../../models/materialModel')

exports.getCreateProduct = async (req, res) => {
    try {
        // Get all materials
        const materials = await Material.find()

        return res.render('create-product', {
            title: 'Create product',
            materials
        })
    } catch (error) {

    }
}

exports.createProduct = async (req, res) => {
    try {
        // Validation result.
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(400).send({
                success: false,
                data: null,
                error: errorMessages
            })
        }
        const data = matchedData(req)

        // Checking product for exists.
        const product = await Product.findOne({ name: data.name })
        if (product) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "Name product is already used."
            })
        }

        // Writing new product to database.
        const materialsUsed = data.materialsUsed.map(object => {
            return {
                _id: object.material,
                amount: object.amount
            }
        })
        const newProduct = await Product.create({
            name: data.name,
            materialsUsed
        })

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: 'Product is created successful.',
            data: newProduct
        })
    } catch (error) {
        // Error handling.
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        // Find all products
        const products = await Product.find()

        // Responsing
        if (!products.length) {
            return res.render('products', {
                title: 'Products',
                products: false,
                isProducts: true
            })
        } else {
            return res.render('products', {
                title: 'Products',
                products,
                isProducts: true
            })
        }
    } catch (error) {
        // Error handling.
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}

exports.getOneProduct = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Find product by id.
        const product = await Product.findById(id).populate("materialsUsed")

        // Checking product for exists.
        if (!product) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "Product not found!"
            })
        }

        const productMaterials = []
        const gettingMaterial = async function (id) {
            const material = await Material.findById(id)
            return material.name
        }
        for (let i = 0; i < product.materialsUsed.length; i++) {
            const materialName = await gettingMaterial(product.materialsUsed[i]._id)
            productMaterials.push({
                name: materialName,
                amount: product.materialsUsed[i].amount
            })
        }

        const data = {
            _id: product._id,
            name: product.name,
            productMaterials
        }

        // Responsing.
        return res.render('product', {
            title: 'Product',
            data
        })
    } catch (error) {
        // Error handling.
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}

exports.getUpdateOneProduct = async (req, res) => {
    const { params: { id } } = req

    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Find product by id.
        const product = await Product.findById(id).populate("materialsUsed")

        // Checking product for exists.
        if (!product) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "Product not found!"
            })
        }

        const productMaterials = []
        const gettingMaterial = async function (id) {
            const material = await Material.findById(id)
            return material.name
        }
        for (let i = 0; i < product.materialsUsed.length; i++) {
            const materialName = await gettingMaterial(product.materialsUsed[i]._id)
            productMaterials.push({
                name: materialName,
                amount: product.materialsUsed[i].amount
            })
        }

        const data = {
            _id: product._id,
            name: product.name,
            productMaterials
        }

        return res.render('product-update', {
            title: 'Update product',
            data
        })

    } catch (error) {
        // Error handling.
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}

exports.updatOneProduct = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Checking product for exists.
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "Product not found!"
            })
        }

        // Validation result.
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(400).send({
                success: false,
                data: false,
                error: errorMessages
            })
        }
        const data = matchedData(req)

        // Writing updates to database.
        const materialsUsed = data.materialsUsed.map(object => {
            return {
                _id: object.material,
                amount: object.amount
            }
        })
        const updateProduct = await Product.findByIdAndUpdate(id, {
            ...product,
            name: data.name,
            materialsUsed
        })

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: 'Product is updated successful.',
            data: { updateProduct }
        })
    } catch (error) {
        // Error handling.
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}

exports.getDeleteOneProduct = async (req, res) => {
    const { params: { id } } = req

    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        const product = await Product.findById(id)

        return res.render('delete-product', {
            title: 'Delete product',
            product
        })
    } catch (error) {
        // Error handling.
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}

exports.deleteOneProduct = async (req, res) => {
    const { params: { id } } = req

    try {
        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        // Checking product for exists.
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).send({
                success: false,
                data: null,
                error: "Product not found!"
            })
        }

        // Deleting product from database.
        await Product.findByIdAndDelete(id)

        // Responsing.
        return res.redirect('/api/products')
    } catch (error) {
        // Error handling.
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}

exports.deleteAllProducts = async (req, res) => {
    try {
        // Checking for exists.
        const products = await Product.find()
        if (!products) {
            return res.status(200).send({
                succes: true,
                error: false,
                message: "Products is empty."
            })
        }

        // Deleting products from database.
        await Product.deleteMany()

        // Responsing.
        return res.status(201).send({
            success: true,
            error: false,
            message: "Products deleted successful."
        })
    } catch (error) {
        // Error handling.
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                success: false,
                data: null,
                error: error.message
            })
        }
        return res.status(500).send({
            success: false,
            data: null,
            error: "INTERLA_SERVER_ERROR"
        })
    }
}