import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth / login and logout', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('a user signs in with valid credentials', async ({ visit, route }) => {
    await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secret-password',
    })

    const page = await visit(route('session.create'))

    await page.getByLabel('Email', { exact: true }).fill('ada@example.com')
    await page.getByLabel('Password', { exact: true }).fill('secret-password')
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()

    await page.assertPath(route('dashboard'))
    await page.assertTextContains('body', 'Ada Lovelace')
  })

  test('sign in is refused with a wrong password', async ({ visit, route }) => {
    await User.create({ email: 'ada@example.com', password: 'secret-password' })

    const page = await visit(route('session.create'))

    await page.getByLabel('Email', { exact: true }).fill('ada@example.com')
    await page.getByLabel('Password', { exact: true }).fill('wrong-password')
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()

    await page.assertTextContains('body', 'Invalid user credentials')
    await page.assertPath(route('session.create'))
    await page.assertInputValue('input[name="email"]', 'ada@example.com')
    await page.assertInputValue('input[name="password"]', '')

    const dashboard = await visit(route('dashboard'))
    await dashboard.assertPath(route('session.create'))
  })

  test('sign in is refused for an unknown email', async ({ visit, route }) => {
    const page = await visit(route('session.create'))

    await page.getByLabel('Email', { exact: true }).fill('nobody@example.com')
    await page.getByLabel('Password', { exact: true }).fill('secret-password')
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()

    await page.assertTextContains('body', 'Invalid user credentials')
    await page.assertPath(route('session.create'))
  })

  test('a signed-in user logs out from the user menu', async ({ visit, browserContext, route }) => {
    const user = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secret-password',
    })
    await browserContext.loginAs(user)

    const page = await visit(route('dashboard'))
    await page.getByRole('button', { name: 'Ada Lovelace', exact: false }).first().click()
    await page.getByRole('menuitem', { name: 'Log out', exact: true }).click()

    await page.assertPath(route('session.create'))

    const dashboard = await visit(route('dashboard'))
    await dashboard.assertPath(route('session.create'))
  })
})

test.group('Auth / route protection', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('a guest opening {$self} is sent to the login page')
    .with([
      'home',
      'dashboard',
      'inbox',
      'customers',
      'settings.general',
      'settings.members',
    ] as const)
    .run(async ({ visit, route }, routeName) => {
      const page = await visit(route(routeName))

      await page.assertPath(route('session.create'))
    })

  test('a signed-in user opening {$self} is sent to the dashboard')
    .with(['home', 'session.create'] as const)
    .run(async ({ visit, browserContext, route }, routeName) => {
      const user = await User.create({ email: 'ada@example.com', password: 'secret-password' })
      await browserContext.loginAs(user)

      const page = await visit(route(routeName))

      await page.assertPath(route('dashboard'))
    })
})
