const { Material } = require("../../models/materialModel");

exports.getAllMaterials = async(req, res) => {
    try {
        const material = await Material.find()

        if (!material) {
            return res.status(404).send({
                success: false,
                error: "Material not found!"
            })
        } else {
            return res.status(200).send({
                success: true,
                error: false,
                message: 'List of Material!',
                data: material
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

exports.createMaterial = async(req, res) => {
    try {
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

        const newMaterial = await Material.create({
            name: body.name,
            quantity: body.quantity,
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