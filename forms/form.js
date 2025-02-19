const URL = `https://localhost:3030/api`

const booking = async (formData) => {
    fetch(`${URL}/booking/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(data => data.json())
    .then(data => {
        if (data.success) {
            
        } else {
            data.error.message
        }
    })
}