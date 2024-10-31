exports.changeMaterialQuantityValidationSchema = {
    quantity: {
        isInt: {
            errorMessage: "Homashyoning o'lchamini raqamlarda kiriting!"
        },
        notEmpty: {
            errorMessage: "Homashyoning o'lchami bo'sh bo'lmasligi kerak!"
        }
    }
}