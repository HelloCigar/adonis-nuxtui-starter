/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

/**
 * Send visitors to the dashboard when logged in, or to the login page otherwise
 */
router
  .get('/', async ({ auth, response }) => {
    return (await auth.check())
      ? response.redirect().toRoute('dashboard')
      : response.redirect().toRoute('session.create')
  })
  .as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.on('dashboard').renderInertia('dashboard', {}).as('dashboard')
    router.get('inbox', [controllers.Inbox, 'index']).as('inbox')
    router.get('customers', [controllers.Customers, 'index']).as('customers')
    router.get('notifications', [controllers.Notifications, 'index']).as('notifications')

    router.resource('posts', controllers.Posts).where('id', router.matchers.uuid())
    router
      .shallowResource('posts.comments', controllers.Comments)
      .only(['store', 'destroy'])
      .where('post_id', router.matchers.uuid())
      .where('id', router.matchers.uuid())

    router
      .group(() => {
        router.on('/').renderInertia('settings/index', {}).as('general')
        router.get('members', [controllers.Members, 'index']).as('members')
        router.on('notifications').renderInertia('settings/notifications', {}).as('notifications')
        router.on('security').renderInertia('settings/security', {}).as('security')
      })
      .prefix('settings')
      .as('settings')

    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
