const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const blogBody = request.body

    const user = request.user

    const blog = new Blog({
      author: blogBody.author,
      title: blogBody.title,
      url: blogBody.url,
      likes: blogBody.likes,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog.toJSON()) 
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    const user = request.user
    
    if ( blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({error: "Unauthorized user cannot delete posts"})
    }

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
    likes: reqBody.likes,
    user: reqBody.userId
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new : true})
    response.status(200).json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter