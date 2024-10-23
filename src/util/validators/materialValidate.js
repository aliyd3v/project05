exports.materialSchema = {
    name: {
        isString: {
            errorMessage: "Material nomi string bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Material nomi talab qilinadi"
        }
    },
    quantity: {
        isInt: {
            errorMessage: "Material hajmi raqam bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Material hajmi talab qilinadi"
        }
    }
}

exports.updateMaterialSchema = {
    name: {
        isString: {
            errorMessage: "Material nomi string bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Material nomi talab qilinadi"
        }
    },
    quantity: {
        isInt: {
            errorMessage: "Material hajmi raqam bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Material hajmi talab qilinadi"
        }
    }
}