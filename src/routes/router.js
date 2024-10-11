const createUserRouter  = require('./userRouter/createUserRouter')
const  loginRouter  = require('./authRouter/loginRouter')

exports.appRouter = (app) => {
    app.use('/api', createUserRouter)
    app.use('/api', loginRouter)
}