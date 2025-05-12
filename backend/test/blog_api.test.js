const assert = require('node:assert')
const { test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'A test blog',
        author: 'A test author',
        url: 'A test url',
        likes: 3
    },
    {
        title: 'A test blog 2',
        author: 'A test author 2',
        url: 'A test url 2',
        likes: 1
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    for (let i = 0; i < initialBlogs.length; i++) {
        let blogObject = new Blog(initialBlogs[i])
        await blogObject.save()
    }
})

const testBlog = {
    title: 'A third test blog',
    author: 'A third test author',
    url: 'A third test url',
    likes: 3
}

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('A new blog can be submitted', async () => {

    await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    assert(titles.includes('A third test blog'))
})

after(async () => {
    await mongoose.connection.close()
})