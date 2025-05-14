const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const blogBody = request.body

  const user = await User.findById(body.userId)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid'})
  }

  const blog = new Blog({
    author: blogBody.content,
    title: blogBody.title,
    url: blogBody.url,
    likes: blogBody.likes,
    user: user._id
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.notes.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog.toJSON()) 
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const reqBody = request.body

  const blog = {
    title: reqBody.title,
    author: reqBody.author,
    url: reqBody.url,
    likes: reqBody.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new : true})
    response.status(200).json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter