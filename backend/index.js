const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const blogsRouter = require('./controllers/blogposts')
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
app.use('/api/blogs', blogsRouter)

const PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`server running on port ${PORT}`)
})