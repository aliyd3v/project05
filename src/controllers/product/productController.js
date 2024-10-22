const { default: mongoose } = require("mongoose");
const { Product } = require("../../models/productModel");
const { validationResult, matchedData } = require("express-validator");

exports.getCreateProduct = async (req, res) => {
    return res. render('create-product', {
        title: 'Create product'
    })
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

        res.render('products', {
            title: 'Products',
            products,
            isProducts: true
        })

        // Responsing
        if (!products.length) {
            return res.status(200).send({
                success: true,
                error: null,
                message: "Product is empty."
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

        // Responsing.
        return res.render('product', {
            title: 'Product',
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

        const product = await Product.findById(id)

        return res.render('product-update', {
            title: 'Update product',
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