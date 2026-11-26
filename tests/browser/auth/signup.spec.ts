import User from '#models/user'
import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth / signup', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('a visitor creates an account and lands on the dashboard', async ({ visit, assert }) => {
    const page = await visit('/signup')

    await page.getByLabel('Full name').fill('Ada Lovelace')
    await page.getByLabel('Email').fill('ada@example.com')
    await page.getByLabel('Password', { exact: true }).fill('secret-password')
    await page.getByLabel('Confirm password').fill('secret-password')
    await page.getByRole('button', { name: 'Create account' }).click()

    await page.assertPath('/dashboard')
    await page.assertTitleContains('Home')

    const user = await User.findByOrFail('email', 'ada@example.com')
    assert.equal(user.fullName, 'Ada Lovelace')
    assert.notEqual(user.password, 'secret-password')
    assert.isTrue(await hash.verify(user.password, 'secret-password'))
  })

  test('signup is rejected when the email is already taken', async ({ visit, assert }) => {
    await User.create({ email: 'ada@example.com', password: 'secret-password' })

    const page = await visit('/signup')

    await page.getByLabel('Email').fill('ada@example.com')
    await page.getByLabel('Password', { exact: true }).fill('another-password')
    await page.getByLabel('Confirm password').fill('another-password')
    await page.getByRole('button', { name: 'Create account' }).click()

    await page.assertTextContains('body', 'The email has already been taken')
    await page.assertPath('/signup')

    const users = await User.query().where('email', 'ada@example.com')
    assert.lengthOf(users, 1)
  })

  test('signup is rejected when the passwords do not match', async ({ visit, assert }) => {
    const page = await visit('/signup')

    await page.getByLabel('Email').fill('ada@example.com')
    await page.getByLabel('Password', { exact: true }).fill('secret-password')
    await page.getByLabel('Confirm password').fill('other-password')
    await page.getByRole('button', { name: 'Create account' }).click()

    await page.assertTextContains('body', 'must be the same')
    await page.assertPath('/signup')
    await page.assertInputValue('input[name="email"]', 'ada@example.com')
    await page.assertInputValue('input[name="password"]', '')

    assert.isNull(await User.findBy('email', 'ada@example.com'))
  })

  test('a signed-in user visiting the signup page is sent to the dashboard', async ({
    visit,
    browserContext,
  }) => {
    const user = await User.create({ email: 'ada@example.com', password: 'secret-password' })
    await browserContext.loginAs(user)

    const page = await visit('/signup')

    await page.assertPath('/dashboard')
  })
})
