import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import ErrorMessage from './components/ErrorMessage'
import SuccessMessage from './components/SuccessMessage'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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
  }

  const loginForm = () => {
    return (
      <div>
        <LoginForm
          setUser={setUser}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      </div>
    )
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : ''}
    const showWhenVisible = { display: blogFormVisible ? '' : 'none'}
    
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>create</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm 
            setBlogs={setBlogs}
            setErrorMessage={setErrorMessage}
            setSuccessMessage={setSuccessMessage}
          />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <h1>Blogs</h1>
      <SuccessMessage message = {successMessage} />
      <ErrorMessage message = {errorMessage} />
      {!user && loginForm()}
      {user && <div>
          {user.name} logged in {'  '}
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
          <h2>blogs</h2>
          {blogs.sort((a,b) => a.likes < b.likes).map(blog =>
            <Blog key={blog.id}
            blog={blog}
            currUser={user}
            setBlogs={setBlogs}
            blogs={blogs}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
            setSuccessMessage={setSuccessMessage}
            successMessage={successMessage}
            />
      )}
        </div>
      }
    </div>
  )
}

export default App