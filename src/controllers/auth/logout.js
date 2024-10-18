exports.logout = (req, res) => {
    try {
        res.clearCookie('authcookie');
        res.clearCookie('userId');
        res.redirect('/api/auth/login')
    } catch (error) {
        // Error handling.
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
            error: "INTERLA_SERVER_ERROR"
        })
    }
}