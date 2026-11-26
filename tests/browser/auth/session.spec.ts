import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth / login and logout', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('a user signs in with valid credentials', async ({ visit }) => {
    await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secret-password',
    })

    const page = await visit('/login')

    await page.getByLabel('Email').fill('ada@example.com')
    await page.getByLabel('Password', { exact: true }).fill('secret-password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await page.assertPath('/dashboard')
    await page.assertTextContains('body', 'Ada Lovelace')
  })

  test('sign in is refused with a wrong password', async ({ visit }) => {
    await User.create({ email: 'ada@example.com', password: 'secret-password' })

    const page = await visit('/login')

    await page.getByLabel('Email').fill('ada@example.com')
    await page.getByLabel('Password', { exact: true }).fill('wrong-password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await page.assertTextContains('body', 'Invalid user credentials')
    await page.assertPath('/login')

    const dashboard = await visit('/dashboard')
    await dashboard.assertPath('/login')
  })

  test('sign in is refused for an unknown email', async ({ visit }) => {
    const page = await visit('/login')

    await page.getByLabel('Email').fill('nobody@example.com')
    await page.getByLabel('Password', { exact: true }).fill('secret-password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await page.assertTextContains('body', 'Invalid user credentials')
    await page.assertPath('/login')
  })

  test('a signed-in user logs out from the user menu', async ({ visit, browserContext }) => {
    const user = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secret-password',
    })
    await browserContext.loginAs(user)

    const page = await visit('/dashboard')
    await page.getByRole('button', { name: 'Ada Lovelace' }).first().click()
    await page.getByRole('menuitem', { name: 'Log out' }).click()

    await page.assertPath('/login')

    const dashboard = await visit('/dashboard')
    await dashboard.assertPath('/login')
  })
})

test.group('Auth / route protection', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('a guest opening {path} is sent to the login page')
    .with(['/', '/dashboard', '/inbox', '/customers', '/settings', '/settings/members'])
    .run(async ({ visit }, path) => {
      const page = await visit(path)

      await page.assertPath('/login')
    })

  test('a signed-in user opening {path} is sent to the dashboard')
    .with(['/', '/login'])
    .run(async ({ visit, browserContext }, path) => {
      const user = await User.create({ email: 'ada@example.com', password: 'secret-password' })
      await browserContext.loginAs(user)

      const page = await visit(path)

      await page.assertPath('/dashboard')
    })
})
