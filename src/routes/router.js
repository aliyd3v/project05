const userRouter = require('./userRouter/userRouter')
const loginRouter = require('./authRouter/loginRouter')
const materialRouter = require('./materialRouter/materialRouter')
const productRouter = require('./productRouter/productRouter')
const adminPanelRouter = require('./admin-panelRouter/admin-panelRouter')
const logoutRouter = require('./authRouter/logoutRouter')
const reportRouter = require('./reportRouter/reportRouter')

exports.appRouter = (app) => {
    app.use('/api', loginRouter)
    app.use('/api', logoutRouter)
    app.use('/api', userRouter)
    app.use('/api', materialRouter)
    app.use('/api', productRouter)
    app.use('/api', adminPanelRouter)
    app.use('/api', reportRouter)
}