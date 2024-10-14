exports.updateUserValidationSchema = {
    name: {
        isString: {
            errorMessage: 'Name must be a string'
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty'
        }
    },
    username: {
        isString: {
            errorMessage: 'Username must be a string'
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty'
        },
        trim: true
    }
}