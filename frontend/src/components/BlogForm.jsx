import { useState } from 'react'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { setSuccessMessage } from '../reducers/successMessageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'

const BlogForm = ({
  toggleVisibility,
  blogFormRef,
  setBlogs
}) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      await blogService.create({
        title, author, url
      })
      toggleVisibility(blogFormRef)
      const allBlogsAfterPost = await blogService.getAll()
      setBlogs(allBlogsAfterPost)
      setTitle('')
      setAuthor('')
      setUrl('')
      dispatch(setSuccessMessage(`New blog "${title}" by ${author} added`, 5))
    } catch (exception) {
      console.log(exception.response.data.error)
      dispatch(setErrorMessage(exception.response.data.error, 5))
    }
  }

  return (
    <form onSubmit={handleNewBlog}>
      <div>
        <h2>Create new</h2>
        <div>
                title:
          <input
            type="text"
            value={title}
            name='title'
            onChange = {({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
                author:
          <input
            type="text"
            value={author}
            name='author'
            onChange = {({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
                url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </div>
    </form>
  )
}

export default BlogForm