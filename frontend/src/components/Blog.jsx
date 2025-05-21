import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs }) => {
  const [visible, setVisible] = useState('')
  
  const hideWhenVisible = { display: visible ? 'none': ''}
  const showWhenVisible = { display: visible ? '' : 'none'}
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    const updatedBlog = await blogService.update(blog.id, likedBlog)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : { ...b, likes: updatedBlog.likes }))
  }

  return (
  <div style={blogStyle}>
    <div style={hideWhenVisible}>
      {blog.title} {blog.author} {' '}
      <button onClick={toggleVisibility}>view</button>
    </div>
    <div style={showWhenVisible}>
      <div>
        {blog.title} {blog.author}
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
    </div>
  </div> 

)}

export default Blog