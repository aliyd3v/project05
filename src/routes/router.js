const userRouter = require('./userRouter/userRouter')
const loginRouter = require('./authRouter/loginRouter')
const materialRouter = require('./materialRouter/materialRouter')

exports.appRouter = (app) => {
    app.use('/api', userRouter)
    app.use('/api', loginRouter)
    app.use('/api', materialRouter)
}