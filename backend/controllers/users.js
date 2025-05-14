const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password} = request.body

    if (password.length < 3) {
        return response.status(400).json({error: "password expected to be atleast 3 characters long"})
    }

    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser.toJSON())
    } catch (exception) {
        next(exception)
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter