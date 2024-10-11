const mongoose = require('mongoose')
const dotenv = require('dotenv')
const config = dotenv.config()

exports.connectDB = async () => {
    await mongoose.connect(process.env.MONGOTOKEN)
        .then(console.log(`
    < < < < < _MONGODB_CONNECTED_ > > > > >
`))
        .catch(error => console.log(error))
}