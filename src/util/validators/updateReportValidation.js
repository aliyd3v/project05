exports.updateReportValidationSchema = {
    product: {
        isMongoId: {
            errorMessage: "Mongo idsini to'g'ri formatda kiriting."
        },
        notEmpty: {
            errorMessage: 'Mahsulotni idsi kiritilmagan.'
        }
    },
    quantityProduced: {
        isInt: {
            errorMessage: "Mahsulotning soni raqam bo'lishi kerak."
        },
        toInt: true,
        notEmpty: {
            errorMessage: "Mahsulotning sonini kiriting."
        }
    },
    producedAt: {
        isDate: {
            errorMessage: "Mahsulot tayyorlangan vaqtni to'g'ri formatda kiriting."
        },
        notEmpty: {
            errorMessage: "Mahsulot tayyorlangan vaqt talab qilinadi."
        },
        toDate: true
    }
}