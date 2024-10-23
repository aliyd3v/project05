exports.createUserValidationSchema = {
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
        trim: {
            errorMessage: "Usernamening orasida ochiq joy qolishi mumkin emas!"
        }
    },
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
        }
    }
}