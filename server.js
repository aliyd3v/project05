const express = require('express')
const { appSetup } = require('./src/startup/init')
const { appRouter } = require('./src/routes/router')
const app = express()

appSetup(app, express)
appRouter(app)