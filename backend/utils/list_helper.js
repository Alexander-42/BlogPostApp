const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    total = 0
    blogs.forEach(element => {
        total += element.likes
    })
    return total
}

const favoriteBlog = (blogs) => {
    let favorite = blogs.length > 0 ? blogs[0] : 'List is empty'

    if (favorite !== 'List is empty') {
        favorite = blogs.reduce((max, item) => {
            return item.likes > max.likes ? item : max
        })
    }

    return favorite
}

const mostBlogs = (blogs) => {
    const noOfBlogs = blogs.length
    let most = noOfBlogs > 0 ? blogs[0] : 'List is empty'

    if (noOfBlogs === 1) {
        most = {author: most.author, blogs: 1}
    } else if (noOfBlogs > 1) {
        const blogsGroupedByAuthor = lodash.groupBy(blogs, 'author')
        const authors = Object.keys(blogsGroupedByAuthor)
        const blogsByAuthor = Object.values(blogsGroupedByAuthor)
        
        const blogsPerAuthor = blogsByAuthor.map((blogsArray) => blogsArray.length)

        const authorBlogNoPairs = lodash.zip(authors, blogsPerAuthor)

        const authorBlogNoPairsDesc = authorBlogNoPairs.sort((a,b) => b[1] - a[1])

        most = {author: authorBlogNoPairsDesc[0][0], blogs: authorBlogNoPairsDesc[0][1] }
    }
    return most
}

const mostLikesHelper = (blogsArray) => {
    const numberOfBlogs = blogsArray.length
    let totalLikes = blogsArray.reduce((total, blog) => total + blog.likes, 0)
    return totalLikes
}

const mostLikes = (blogs) => {
    const noOfBlogs = blogs.length
    let most = noOfBlogs > 0 ? blogs[0] : 'the list is empty'

    if (noOfBlogs === 1) {
        most = {author: most.author, likes: most.likes}
    } else if (noOfBlogs > 1) {
        const blogsGroupedByAuthor = lodash.groupBy(blogs, 'author')
        const authors = Object.keys(blogsGroupedByAuthor)
        const blogsByAuthor = Object.values(blogsGroupedByAuthor)
        
        const blogsPerAuthor = blogsByAuthor.map((blogsArray) => mostLikesHelper(blogsArray))

        const authorLikes = lodash.zip(authors, blogsPerAuthor)

        const authorLikesDesc = authorLikes.sort((a,b) => b[1] - a[1])

        most = {author: authorLikesDesc[0][0], likes: authorLikesDesc[0][1] }
    }
    return most
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}