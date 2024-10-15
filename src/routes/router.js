const userRouter = require('./userRouter/userRouter')
const loginRouter = require('./authRouter/loginRouter')
const materialRouter = require('./materialRouter/materialRouter')
const productRouter = require('./productRouter/productRouter')
const adminPanelRouter = require('./admin-panelRouter/admin-panelRouter')


exports.appRouter = (app) => {
    app.use('/api', loginRouter)
    app.use('/api', userRouter)
    app.use('/api', materialRouter)
    app.use('/api', productRouter)
    app.use('/api', adminPanelRouter)
}