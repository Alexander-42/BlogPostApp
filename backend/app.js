const config = require('./utils/config')
const express = require('express')
const blogsRouter = require('./controllers/blogposts')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const app = express()

const mongoUrl = config.MONGODB_URI

logger.info('Connecting to ', mongoUrl)
mongoose.connect(mongoUrl)
  .then(result => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB', error.message)
})

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app