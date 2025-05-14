const assert = require('node:assert')
const { test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')
const config = require('../utils/config')

validPasswords = config.validTestPasswords
invalidPasswords = config.invalidTestPassords

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

const testBlogLikesOmitted = {
    title: 'A fourth test blog',
    author: 'A fourth test author',
    url: 'a fourth test url'
}

const testBlogNoTitle = {
    author: 'A fifth test author',
    url: 'a fifth test url',
    likes: 5
}

const testBlogNoUrl = {
    title: 'A sixth test blog',
    author: 'A sixth test author',
    likes: 9
}

describe('Submitting blogs', () => {

    test('A new blog can be submitted and returns with status code 201 when succesful', async () => {

        await api
            .post('/api/blogs')
            .send(testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const titles = response.body.map(r => r.title)
    
        assert.strictEqual(response.body.length, initialBlogs.length + 1)
    
        assert(titles.includes('A third test blog'))
    })

    test('Blogs require field title and returns with status code 400 when missing', async () => {
        await api
            .post('/api/blogs')
            .send(testBlogNoTitle)
            .expect(400)
    })

    test('Blogs require field url and eturns with status code 400 when missing', async () => {
        await api
            .post('/api/blogs')
            .send(testBlogNoUrl)
            .expect(400)
    })

    describe('The default value for likes is 0', () => {

        test('Submitting a blog with likes field omitted', async () => {
    
            await api
                .post('/api/blogs')
                .send(testBlogLikesOmitted)
                .expect(201)
    
            const response = await api.get('/api/blogs')
    
            const likesTitles = response.body.map(r => [r.likes, r.title])
            assert(likesTitles.some(([likes, title]) => likes === 0 && title === 'A fourth test blog'))
        })
    
        test('Submitting a blog with likes defined will return the submitted amount of likes', async () => {
    
            await api
                .post('/api/blogs')
                .send(testBlog)
                .expect(201)
            
            const response = await api.get('/api/blogs')
    
            const likesTitles = response.body.map(r => [r.likes, r.title])
            assert(likesTitles.some(([likes, title]) => likes === testBlog.likes && title === 'A third test blog'))
        })
    })
})

describe('Returned blogs have correct fields and format', () => {

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('identification field id exists', async () => {
        const response = await api.get('/api/blogs')
    
        const ids = response.body.map(r => r.id)
    
        assert.strictEqual(ids.length, initialBlogs.length)
    })

    describe('internal fields are not returned', () => {

        test('field _id is not returned', async () => {
            const response = await api.get('/api/blogs')

            const _ids = response.body.map(r => r._id)

            assert.deepStrictEqual(_ids, Array(initialBlogs.length).fill(undefined))
        })

        test('field __v is not returned', async () => {
            const response = await api.get('/api/blogs')

            const __vs = response.body.map(r => r.__v)

            assert.deepStrictEqual(__vs, Array(initialBlogs.length).fill(undefined))
        })
    })
})

describe('Deleting blogs', () => {
    
    test('succeeds with status code 204 if id is correct', async () => {
        const blogs = await Blog.find({})

        const deletableBlog = blogs[0]

        await api
            .delete(`/api/blogs/${deletableBlog.id}`)
            .expect(204)

        const blogsAfterDel = await Blog.find({})

        assert.strictEqual(blogsAfterDel.length, initialBlogs.length - 1)

        const titles = blogsAfterDel.map(r => r.title)
        assert(!titles.includes(deletableBlog.title))
    })
})

describe('Updating blogs', () => {

    test('succeeds with status code 200', async () => {

        const blogs = await Blog.find({})

        const updatableBlog = blogs[0]

        const updatedBlog = {
            title: updatableBlog.title,
            author: updatableBlog.author,
            url: updatableBlog.url,
            likes: 10,
        }

        await api
                .put(`/api/blogs/${updatableBlog.id}`)
                .send(updatedBlog)
                .expect(200)
        
        const blogsAfterUpdate = await api.get('/api/blogs')
        const blogsAfterUpdateArr = blogsAfterUpdate.body

        assert.strictEqual(blogsAfterUpdateArr.length, initialBlogs.length)

        assert(!blogsAfterUpdateArr.some(b => b.id === updatableBlog.id && b.likes === updatableBlog.likes))
        assert(blogsAfterUpdateArr.some(b => b.id === updatableBlog.id && b.likes === updatedBlog.likes))
    })
})

describe('Database initialized with one user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcryptjs.hash(validPasswords[0], 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('User can be created with a fresh username', async () => {
        const usersAtStart = await User.find({})
        const usersAtStartUsable = usersAtStart.map(user => user.toJSON())

        const newUser = {
            username: 'alexander-42',
            name: 'Alexander Oiling',
            password: validPasswords[2],
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await User.find({})
        const usersAtEndUsable = usersAtEnd.map(user => user.toJSON())

        assert.strictEqual(usersAtEndUsable.length, usersAtStartUsable.length + 1)

        const usernames = usersAtEndUsable.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
})

after(async () => {
    await mongoose.connection.close()
})