import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blogs', () => {
    const blog = {
        title: "This is a title",
        author: "This is an author",
        url: "ThisSite.domain",
        likes: 9,
        user: {
            id: "This is a test ID",
            name: "This is a user test name",
            username: "This is a user test username"
        }
    }

    render(<Blog blog={blog} />)

    const element = screen.getByTest

})