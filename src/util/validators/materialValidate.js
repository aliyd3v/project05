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
        isNumeric: {
            errorMessage: "Material hajmi raqam bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Material hajmi talab qilinadi"
        }
    }
}