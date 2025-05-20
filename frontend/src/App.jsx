import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newBlog, setNewBlog] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create({
        title, author, url
      })
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setErrorMessage('Something weird happened')
    }
  }

  const handleLogout = (event) => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  if (user === null) {
    return (
      <div>
        <h2>
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div>
              username 
              <input
              type = "text"
              value = {username}
              name = "Username"
              onChange={({target}) => {setUsername(target.value)}}
              />
            </div>
            <div>
              password 
              <input
              type = "text"
              value = {password}
              name = "Password"
              onChange={({target}) => {setPassword(target.value)}}
              />
            </div>
            <button type="submit">Login</button>
        </form>
      </div>
      )
    }
  
  return (
    <div>
      {user.name} logged in 
      <button onClick={handleLogout}>Logout</button>
      <h2>blogs</h2>
      <h2>Create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input
          type="text"
          value={title}
          name='title'
          onChange = {({target}) => {setTitle(target.value)}}
          />
        </div>
        <div>
          author:
          <input
          type="text"
          value={author}
          name='author'
          onChange = {({target}) => {setAuthor(target.value)}}
          />
        </div>
        <div>
          url:
          <input
          type="text"
          value={url}
          name="url"
          onChange={({target}) => {setUrl(target.value)}}
          />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App