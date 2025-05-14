const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password} = request.body

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
    const users = await User.find({})
    response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter