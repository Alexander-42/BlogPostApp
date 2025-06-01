import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, currUser, setBlogs, blogs, setErrorMessage, setSuccessMessage, handleLike }) => {
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
        setSuccessMessage('Deletion successful!')
        setTimeout(() => {
          setSuccessMessage(null)
        }, 2000)
      } catch (exception) {
        setErrorMessage('Deletion failed')
        setTimeout(() => {
          setErrorMessage(null)
        }, 2000)
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