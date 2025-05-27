import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, currUser, setBlogs, blogs, setErrorMessage, setSuccessMessage }) => {
  const [visible, setVisible] = useState('')
  
  const hideWhenVisible = { display: visible ? 'none': ''}
  const showWhenVisible = { display: visible ? '' : 'none'}
  const showIfCurrUser = { display: currUser.username === blog.user.username ? '': 'none'}

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
  
  const handleLike = async () => {
    try {
      await blogService.update(blog.id, {...blog, likes: blog.likes + 1})
      const blogsAfterUpdate = await blogService.getAll()
      setBlogs(blogsAfterUpdate)
    } catch (exception) {
      console.log('Like unsuccesful')
    }
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
    <div style={hideWhenVisible}>
      {blog.title} {blog.author} {' '}
      <button onClick={toggleVisibility}>view</button>
    </div>
    <div style={showWhenVisible}>
      <div>
        {blog.title} {blog.author} {' '}
        <button onClick={toggleVisibility}>hide</button>
      </div>
      <div>
        {blog.url}
      </div>
      <div>
        likes: {blog.likes} {' '}
        <button onClick={handleLike}>like</button>
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