const userRouter = require('./userRouter/userRouter')
const loginRouter = require('./authRouter/loginRouter')
const materialRouter = require('./materialRouter/materialRouter')
const productRouter = require('./productRouter/productRouter')

exports.appRouter = (app) => {
    app.use('/api', loginRouter)
    app.use('/api', userRouter)
    app.use('/api', materialRouter)
    app.use('/api', productRouter)
}