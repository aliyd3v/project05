exports.udpatePasswordValidationSchema = {
    password: {
        isString: {
            errorMessage: 'Password must be a string'
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long'
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        },
        trim: true
    }
}