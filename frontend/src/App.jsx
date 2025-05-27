import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import ErrorMessage from './components/ErrorMessage'
import SuccessMessage from './components/SuccessMessage'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()
  const loginFormRef = useRef()

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

  const handleLogout = (event) => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    setSuccessMessage('Logout successful!')
    setTimeout(() => {
      setSuccessMessage(null)
    },2000)
  }

  const toggleFormVisibility = (ref) => {
    ref.current.toggleVisibility()
  }

  return (
    <div>
      <h1>Blogs</h1>
      <SuccessMessage message = {successMessage} />
      <ErrorMessage message = {errorMessage} />
      {!user && <div>
        <Togglable buttonLabel='login' ref={loginFormRef}>
          <LoginForm
            toggleVisibility={toggleFormVisibility}
            loginFormRef={loginFormRef}
            setUser={setUser}
            setErrorMessage={setErrorMessage}
            setSuccessMessage={setSuccessMessage}
          />
        </Togglable>
        </div>}
      {user && <div>
          {user.name} logged in {'  '}
          <button onClick={handleLogout}>Logout</button>
          <div>
            <Togglable buttonLabel='create' ref={blogFormRef}>
              <BlogForm buttonLabel='create'
                toggleVisibility={toggleFormVisibility}
                blogFormRef = {blogFormRef}
                setBlogs={setBlogs}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
              />
            </Togglable>
          </div>
          <h2>blogs</h2>
          {blogs.sort((a,b) => a.likes < b.likes).map(blog =>
            <Blog key={blog.id}
            blog={blog}
            currUser={user}
            setBlogs={setBlogs}
            blogs={blogs}
            setErrorMessage={setErrorMessage}
            setSuccessMessage={setSuccessMessage}
            />
      )}
        </div>
      }
    </div>
  )
}

export default App