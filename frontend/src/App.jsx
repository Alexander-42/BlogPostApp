import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import ErrorMessage from './components/ErrorMessage'
import SuccessMessage from './components/SuccessMessage'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { useDispatch } from 'react-redux'
import { setSuccessMessage } from './reducers/successMessageReducer'


const App = () => {
  const dispatch = useDispatch()

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

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
    dispatch(setSuccessMessage('Logout successful!', 5))
  }

  const toggleFormVisibility = (ref) => {
    ref.current.toggleVisibility()
  }

  const handleLike = async (blog) => {
    try {
      await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
      const blogsAfterUpdate = await blogService.getAll()
      setBlogs(blogsAfterUpdate)
    } catch (exception) {
      console.log('Like unsuccesful')
    }
  }

  return (
    <div>
      <h1>Blogs</h1>
      <SuccessMessage/>
      <ErrorMessage message = {errorMessage} />
      {!user && <div>
        <LoginForm
          setUser={setUser}
          setErrorMessage={setErrorMessage}
        />
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
            handleLike={handleLike}
          />
        )}
      </div>
      }
    </div>
  )
}

export default App