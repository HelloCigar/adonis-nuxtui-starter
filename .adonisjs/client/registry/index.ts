/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

export type { Route, Path } from './schema.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [[0,"/"]],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [[0,"signup"]],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [[0,"signup"]],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.store']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [[0,"dashboard"]],
    types: placeholder as Registry['dashboard']['types'],
  },
  'inbox': {
    methods: ["GET","HEAD"],
    pattern: '/inbox',
    tokens: [[0,"inbox"]],
    types: placeholder as Registry['inbox']['types'],
  },
  'customers': {
    methods: ["GET","HEAD"],
    pattern: '/customers',
    tokens: [[0,"customers"]],
    types: placeholder as Registry['customers']['types'],
  },
  'notifications': {
    methods: ["GET","HEAD"],
    pattern: '/notifications',
    tokens: [[0,"notifications"]],
    types: placeholder as Registry['notifications']['types'],
  },
  'posts.index': {
    methods: ["GET","HEAD"],
    pattern: '/posts',
    tokens: [[0,"posts"]],
    types: placeholder as Registry['posts.index']['types'],
  },
  'posts.create': {
    methods: ["GET","HEAD"],
    pattern: '/posts/create',
    tokens: [[0,"posts"],[0,"create"]],
    types: placeholder as Registry['posts.create']['types'],
  },
  'posts.store': {
    methods: ["POST"],
    pattern: '/posts',
    tokens: [[0,"posts"]],
    types: placeholder as Registry['posts.store']['types'],
  },
  'posts.show': {
    methods: ["GET","HEAD"],
    pattern: '/posts/:id',
    tokens: [[0,"posts"],[1,"id"]],
    types: placeholder as Registry['posts.show']['types'],
  },
  'posts.edit': {
    methods: ["GET","HEAD"],
    pattern: '/posts/:id/edit',
    tokens: [[0,"posts"],[1,"id"],[0,"edit"]],
    types: placeholder as Registry['posts.edit']['types'],
  },
  'posts.update': {
    methods: ["PUT","PATCH"],
    pattern: '/posts/:id',
    tokens: [[0,"posts"],[1,"id"]],
    types: placeholder as Registry['posts.update']['types'],
  },
  'posts.destroy': {
    methods: ["DELETE"],
    pattern: '/posts/:id',
    tokens: [[0,"posts"],[1,"id"]],
    types: placeholder as Registry['posts.destroy']['types'],
  },
  'posts.comments.store': {
    methods: ["POST"],
    pattern: '/posts/:post_id/comments',
    tokens: [[0,"posts"],[1,"post_id"],[0,"comments"]],
    types: placeholder as Registry['posts.comments.store']['types'],
  },
  'posts.comments.destroy': {
    methods: ["DELETE"],
    pattern: '/comments/:id',
    tokens: [[0,"comments"],[1,"id"]],
    types: placeholder as Registry['posts.comments.destroy']['types'],
  },
  'settings.general': {
    methods: ["GET","HEAD"],
    pattern: '/settings',
    tokens: [[0,"settings"]],
    types: placeholder as Registry['settings.general']['types'],
  },
  'settings.members': {
    methods: ["GET","HEAD"],
    pattern: '/settings/members',
    tokens: [[0,"settings"],[0,"members"]],
    types: placeholder as Registry['settings.members']['types'],
  },
  'settings.notifications': {
    methods: ["GET","HEAD"],
    pattern: '/settings/notifications',
    tokens: [[0,"settings"],[0,"notifications"]],
    types: placeholder as Registry['settings.notifications']['types'],
  },
  'settings.security': {
    methods: ["GET","HEAD"],
    pattern: '/settings/security',
    tokens: [[0,"settings"],[0,"security"]],
    types: placeholder as Registry['settings.security']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [[0,"logout"]],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
