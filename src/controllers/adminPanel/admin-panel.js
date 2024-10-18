exports.adminPanel = async (req, res) => {
    return res.render('admin-panel', {
        title: "Dashboard",
        isDashboard: true
    })
}