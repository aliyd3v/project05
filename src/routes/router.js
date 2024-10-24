const userRouter = require('./userRouter/userRouter')
const loginRouter = require('./authRouter/loginRouter')
const materialRouter = require('./materialRouter/materialRouter')
const productRouter = require('./productRouter/productRouter')
const logoutRouter = require('./authRouter/logoutRouter')
const reportRouter = require('./reportRouter/reportRouter')
const statisticsRouter = require('./statisticsRouter/statisticsRouter')
const { jwtAccessMiddleware } = require('../middlewares/jwt-access-middleware')

exports.appRouter = (app) => {
    app.use('/api', loginRouter)
    app.use('/api', jwtAccessMiddleware, logoutRouter)
    app.use('/api', jwtAccessMiddleware, userRouter)
    app.use('/api', jwtAccessMiddleware, materialRouter)
    app.use('/api', jwtAccessMiddleware, productRouter)
    app.use('/api', jwtAccessMiddleware, reportRouter)
    app.use('/api', jwtAccessMiddleware, statisticsRouter)
}