const { test, expect, describe, beforeEach } = require('@playwright/test')

const UTILS = require('../utils/config')

describe('Blog app', () => {

    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'TestAccount',
                username: 'tester',
                password: UTILS.testerPassword
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Front page can be opened and login form is visible after clicking login button', async ({ page }) => {
        const pageTitle = await page.getByText("Blogs")
        await expect(pageTitle).toBeVisible()

        await page.getByRole('button', {name: 'login'}).click()

        const loginForm = page.getByTestId('LoginFormID')
        await expect(loginForm).toBeVisible()
    })
})