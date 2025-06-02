import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { test, beforeEach, describe, expect, vi } from 'vitest'

describe('By default', () => {

  beforeEach(() => {
    const blog = {
      title: 'This is a title',
      author: 'This is an author',
      url: 'ThisSite.domain',
      likes: 9,
      user: {
        id: 'This is a test ID',
        name: 'This is a user test name',
        username: 'This is a user test username'
      }
    }

    render(<Blog blog={blog} currUser = {{ usernam: 'This is a user test username' }} />)
  })

  test('only the Author and Title are rendered and shown', () => {
    const authorAndTitleOnly = screen.getByTestId('titleAndAuthor')
    expect(authorAndTitleOnly).toBeVisible()
  })

  test('Other fields are not shown', () => {
    const allInfo = screen.getByTestId('allFields')
    expect(allInfo).not.toBeVisible()
  })

})

describe('when the "view" button is clicked', () => {
  const user = userEvent.setup()
  const mockHandler = vi.fn()

  beforeEach(async () => {
    const blog = {
      title: 'This is a title',
      author: 'This is an author',
      url: 'ThisSite.domain',
      likes: 9,
      user: {
        id: 'This is a test ID',
        name: 'This is a user test name',
        username: 'This is a user test username'
      }
    }

    render(<Blog blog={blog} currUser = {{ username: 'This is a user test username' }} handleLike={mockHandler}/>)

    const viewButton = screen.getByTestId('ViewAllFields')
    await user.click(viewButton)
  })

  test('the fields: "likes" and "url" are shown.', async () => {
    const allInfo = screen.getByTestId('allFields')
    expect(allInfo).toBeVisible()
  })

  test('Subsequently when the like button is clicked the like handler is called', async () => {
    const likeButton = screen.getByTestId('likeBlog')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)

  })

})