exports.createProductValidationSchema = {
    name: {
        isString: {
            errorMessage: 'Name must be a string'
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty'
        }
    },
    materialsUsed: {
        isArray: {
            bail: true,
            options: {
                min: 0
            }
        }
    },
    'materialsUsed.*.material': {
        trim: true,
        notEmpty: {
            errorMessage: 'Material cannot be empty'
        }
    },
    'materialsUsed.*.amount': {
        isInt: true,
        notEmpty: {
            errorMessage: 'Amount cannot be empty'
        }
    }
}