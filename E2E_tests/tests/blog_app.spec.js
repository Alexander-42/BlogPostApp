const { test, expect, describe, beforeEach } = require('@playwright/test')

const CONFIG = require('../utils/config')

const createBlog = async (page, title, author, url) => {
    await page.getByRole('textbox').first().fill(title)
    await page.getByRole('textbox').nth(1).fill(author)
    await page.getByRole('textbox').last().fill(url)
    await page.getByRole('button', {name: 'create'}).click()
}

const fillCredentialsAndPressLogin = async (page, username, password) => {
    await page.getByRole('textbox').first().fill(username)
    await page.getByRole('textbox').last().fill(password)
    await page.getByTestId('login-submit').click()
}

const createUser = async ( request, name, username, password ) => {
    await request.post('http://localhost:3003/api/users', {
        data: {
            name: name,
            username: username,
            password: password
        }
    })
}

const clearUsersAndInitializeWithTester = async ( request ) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await createUser(request, 'TestAccount', 'tester', CONFIG.TesterPassword)
}

describe('Blog app', () => {

    beforeEach(async ({ page, request }) => {
        await clearUsersAndInitializeWithTester(request)
        await page.goto('http://localhost:5173')
    })

    test('Front page can be opened and login form is visible', async ({ page }) => {
        const loginForm = page.getByTestId('LoginFormID')
        await expect(loginForm).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await fillCredentialsAndPressLogin(page, 'tester', CONFIG.TesterPassword)
            await expect(page.getByText('TestAccount logged in')).toBeVisible()
        })

        test('fails with incorrect credentials', async ({ page }) => {
            await fillCredentialsAndPressLogin(page, 'incorrectUsername', CONFIG.IncorrectPassword)
            await expect(page.getByText('Incorrect username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await fillCredentialsAndPressLogin(page, 'tester', CONFIG.TesterPassword)
            await page.getByRole('button', {name: 'create'}).click()
        })

        test('a user can create a blog', async ({ page }) => {
            await createBlog(page, 'This is a testblog', 'Author', 'testurl')
            await expect(page.getByText('This is a testblog Author view')).toBeVisible()
        })

        test('a user can like a blog', async ({ page }) => {
            await createBlog(page, 'This is a likable blog', 'Author', 'testurl')
            await page.getByRole('button', {name: 'view'}).click()
            await page.getByRole('button', {name: 'like'}).click()
            await expect(page.getByText('likes: 1')).toBeVisible()
        })

        test('a user can remove a blog that they added', async ({ page }) => {
            await createBlog(page, 'This blog is to be removed', 'Author', 'testurl')
            await page.getByRole('button', {name: 'view'}).click()
            page.on('dialog', async ( dialog ) => {
                await dialog.accept()
            })
            await page.getByRole('button', {name: 'delete'}).click()
            await expect(page.getByText('Deletion successful!')).toBeVisible()
            await expect(page.getByText('This blog is to be removed Auhor')).not.toBeVisible()
        })

        describe('if user did not add the blog', () => {
            beforeEach(async ({ page, request }) => {
                await createBlog(page, 'This blog cannot be deleted by test2', 'Author', 'testurl')
                await createUser(request, 'Tester2', 'test2', CONFIG.SecondTestPassword)
                await page.getByRole('button', {name: 'Logout'}).click()
                await fillCredentialsAndPressLogin(page, 'test2', CONFIG.SecondTestPassword)
            })

            test('cannot see the delete button', async ({ page }) => {
                await page.getByRole('button', {name: 'view'}).click()
                await expect(page.getByRole('button', {name: 'delete'})).not.toBeVisible()
            })
        })
    })

})