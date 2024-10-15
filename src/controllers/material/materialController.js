const { validationResult, matchedData } = require("express-validator");
const { Material } = require("../../models/materialModel");

exports.createMaterial = async(req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).send({
                success: false,
                data: null,
                error: errorMessages
            });
        }
        const data = matchedData(req)

        // Formatting date.
        function formatDate(date) {
            const d = new Date(date);
            const hours = d.getHours();
            const minutes = d.getMinutes();
            const day = d.getDate();
            const month = d.getMonth() + 1;
            const year = String(d.getFullYear()).slice(-2);
            return `${hours}:${String(minutes).padStart(2, '0')} ${day}.${month}.${year}`;
        }
        const now = new Date();
        const formattedDate = formatDate(now);

        const newMaterial = await Material.create({
            name: data.name,
            quantity: data.quantity,
            createdAt: formattedDate
        })

        return res.status(200).send({
            success: true,
            error: false,
            message: 'Material created successfully!',
            data: newMaterial
        })
        
    } catch (error) {
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
            error: "INTERVAL_SERVER_ERROR"
        })
    }
}

exports.getAllMaterials = async(req, res) => {
    try {
        const material = await Material.find()

        res.render('materials', {
            title: 'Materials',
            isMaterials: true,
            material
        })
        

        if (!material) {
            return res.status(404).send({
                success: false,
                error: "Material not found!"
            })
        }
    } catch (error) {
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
            error: "INTERVAL_SERVER_ERROR"
        })
    }
}

exports.getOneMaterial = async(req, res) => {
    try {
        const id = req.params.id

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }
    
        const material = await Material.findById(id)

        return res.status(200).send({
            success: true,
            error: false,
            material
        })
        
    } catch (error) {
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
            error: "INTERVAL_SERVER_ERROR"
        })
    }


}

exports.updateMaterial = async (req, res) => {
    try {
        const id = req.params.id

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).send({
                success: false,
                data: null,
                error: errorMessages
            });
        }
        const data = matchedData(req)

        const body = req.body
        // Formatting date.
        function formatDate(date) {
            const d = new Date(date);
            const hours = d.getHours();
            const minutes = d.getMinutes();
            const day = d.getDate();
            const month = d.getMonth() + 1;
            const year = String(d.getFullYear()).slice(-2);
            return `${hours}:${String(minutes).padStart(2, '0')} ${day}.${month}.${year}`;
        }
        const now = new Date();
        const formattedDate = formatDate(now);

        const oldMaterial = await Material.findById(id)

        const updateData = {
            name: data.name || oldMaterial.name,
            quantity: data.quantity || oldMaterial.quantity,
            updatedAt: formattedDate
        }

        await Material.findByIdAndUpdate(id, updateData)

        return res.status(200).send({
            success: true,
            error: false,
            message: 'the material has been updated successfully!',
            data: updateData
        })

    } catch (error) {
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
            error: "INTERVAL_SERVER_ERROR"
        })
    }
}

exports.deleteMaterial = async (req, res) => {
    try {
        const id = req.params.id

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                data: null,
                error: "ID is not valid"
            })
        }

        await Material.findByIdAndDelete(id)

        return res.status(200).send({
            success: true,
            error: false,
            message: "Material deleted successfully"
        })

    } catch (error) {
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
            error: "INTERVAL_SERVER_ERROR"
        }) 
    } 
}