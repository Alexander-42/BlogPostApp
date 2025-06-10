import { useState } from 'react'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { setSuccessMessage } from '../reducers/successMessageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'

const Blog = ({ blog, currUser, setBlogs, blogs, handleLike }) => {
  const dispatch = useDispatch()

  const [visible, setVisible] = useState('')

  const hideWhenVisible = { display: visible ? 'none': '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showIfCurrUser = { display: currUser.username === blog.user.username ? '': 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    paddingBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleDiscard = () => {
    console.log('Pressed Delete')
    const confirmDiscard = window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)
    if (confirmDiscard) {
      try {
        blogService.discard(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        dispatch(setSuccessMessage(`Deleted blog '${blog.title}' successfully`, 5))
      } catch (exception) {
        dispatch(setErrorMessage('Deletion failed', 5))
        console.log(exception.response.data.error)
      }
    }
  }

  return (
    <div className={'blog'} style={blogStyle}>
      <div data-testid='titleAndAuthor' style={hideWhenVisible}>
        {blog.title} {blog.author} {' '}
        <button data-testid='ViewAllFields' onClick={toggleVisibility}>view</button>
      </div>
      <div data-testid='allFields' style={showWhenVisible}>
        <div>
          {blog.title} {blog.author} {' '}
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div data-testid='blogLikes'>
        likes: {blog.likes} {' '}
          <button data-testid='likeBlog' onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div style={showIfCurrUser}>
          <button onClick={handleDiscard}>delete</button>
        </div>
      </div>
    </div>

  )}

export default Blog