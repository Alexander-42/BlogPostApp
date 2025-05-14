const Blog = require('../models/blog')
const User = require('../models/user')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

module.exports = {
    usersInDb, blogsInDb
}