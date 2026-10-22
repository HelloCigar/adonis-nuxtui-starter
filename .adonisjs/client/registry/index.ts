/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

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
