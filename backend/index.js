const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = config.MONGODB_URI
logger.info('Connecting to ', mongoUrl)
mongoose.connect(mongoUrl)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
})

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`server running on port ${PORT}`)
})