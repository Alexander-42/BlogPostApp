const assert = require('node:assert')
const { test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')

const app = require('../app')
const Blog = require('../models/blog')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')
const config = require('../utils/config')
const helper = require('./test_helper')
const blog = require('../models/blog')

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
        const token = await api
            .post('/api/login')
            .send({username: 'root', password: validPasswords[0]})
            .expect(200);
        
        const tokenString = JSON.parse(token.text).token
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${tokenString}`)
            .send(testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const titles = response.body.map(r => r.title)
    
        assert.strictEqual(response.body.length, initialBlogs.length + 1)
    
        assert(titles.includes('A third test blog'))
    })

    test('Blogs require field title and returns with status code 400 when missing', async () => {
        const token = await api
            .post('/api/login')
            .send({username: 'root', password: validPasswords[0]})
            .expect(200);
        
        const tokenString = JSON.parse(token.text).token

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${tokenString}`)
            .send(testBlogNoTitle)
            .expect(400)
    })

    test('Blogs require field url and returns with status code 400 when missing', async () => {
        const token = await api
            .post('/api/login')
            .send({username: 'root', password: validPasswords[0]})
            .expect(200);
        
        const tokenString = JSON.parse(token.text).token

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${tokenString}`)
            .send(testBlogNoUrl)
            .expect(400)
    })

    describe('The default value for likes is 0', () => {

        test('Submitting a blog with likes field omitted', async () => {
            
            const token = await api
                .post('/api/login')
                .send({username: 'root', password: validPasswords[0]})
                .expect(200);
        
            const tokenString = JSON.parse(token.text).token

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${tokenString}`)
                .send(testBlogLikesOmitted)
                .expect(201)
    
            const response = await api.get('/api/blogs')
    
            const likesTitles = response.body.map(r => [r.likes, r.title])
            assert(likesTitles.some(([likes, title]) => likes === 0 && title === 'A fourth test blog'))
        })
    
        test('Submitting a blog with likes defined will return the submitted amount of likes', async () => {
            const token = await api
                .post('/api/login')
                .send({username: 'root', password: validPasswords[0]})
                .expect(200);
        
            const tokenString = JSON.parse(token.text).token
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${tokenString}`)
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
        const token = await api
            .post('/api/login')
            .send({username: 'root', password: validPasswords[0]})
            .expect(200);

        const tokenString = JSON.parse(token.text).token
        const postedBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${tokenString}`)
            .send({title: "Deletion test", author: "Deleter", url: "Delete.del", likes: 8})
            .expect(201)
        
        
        const blogs = await helper.blogsInDb()
        const deletableBlog = blogs.find(blog => blog.id === postedBlog.body.id)
        
        await api
            .delete(`/api/blogs/${deletableBlog.id}`)
            .set('Authorization', `Bearer ${tokenString}`)
            .expect(204)

        const blogsAfterDel = await helper.blogsInDb()

        assert(!blogsAfterDel.some(blog => blog.id === postedBlog.id))

        const titles = blogsAfterDel.map(r => r.title)
        assert(!titles.includes(deletableBlog.title))
        
        })
})

describe('Updating blogs', () => {

    test('succeeds with status code 200', async () => {

        const blogs = await helper.blogsInDb()

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
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'alexander-42',
            name: 'Alexander Oiling',
            password: validPasswords[1],
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with statuscode 400 and message if username is taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'superuser',
            password: validPasswords[2],
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Expected `username` to be unique'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with statuscode 400 and message if password is less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'alexander-42',
            name: 'Alexander Oiling',
            password: invalidPasswords[0],
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('password expected to be atleast 3 characters long'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})