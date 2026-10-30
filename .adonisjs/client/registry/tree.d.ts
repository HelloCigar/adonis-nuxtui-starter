/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  posts: {
    index: typeof routes['posts.index']
    create: typeof routes['posts.create']
    store: typeof routes['posts.store']
    show: typeof routes['posts.show']
    edit: typeof routes['posts.edit']
    update: typeof routes['posts.update']
    destroy: typeof routes['posts.destroy']
    comments: {
      store: typeof routes['posts.comments.store']
      destroy: typeof routes['posts.comments.destroy']
    }
  }
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: typeof routes['dashboard']
  inbox: typeof routes['inbox']
  customers: typeof routes['customers']
  notifications: typeof routes['notifications']
  settings: {
    general: typeof routes['settings.general']
    members: typeof routes['settings.members']
    notifications: typeof routes['settings.notifications']
    security: typeof routes['settings.security']
  }
}
