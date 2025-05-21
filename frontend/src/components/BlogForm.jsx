const BlogForm = ({
    handleSubmit,
    handleTitleChange,
    handleAuthorChange,
    handleUrlChange,
    title,
    author,
    url
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
            <h2>Create new</h2>
            <div>
                title:
                <input
                type="text"
                value={title}
                name='title'
                onChange = {handleTitleChange}
                />
            </div>
            <div>
                author:
                <input
                type="text"
                value={author}
                name='author'
                onChange = {handleAuthorChange}
                />
            </div>
            <div>
                url:
                <input
                type="text"
                value={url}
                name="url"
                onChange={handleUrlChange}
                />
            </div>
            <button type="submit">create</button>
        </div>
    </form>
    )
}

export default BlogForm