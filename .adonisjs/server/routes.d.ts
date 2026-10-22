import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'inbox': { paramsTuple?: []; params?: {} }
    'customers': { paramsTuple?: []; params?: {} }
    'notifications': { paramsTuple?: []; params?: {} }
    'settings.general': { paramsTuple?: []; params?: {} }
    'settings.members': { paramsTuple?: []; params?: {} }
    'settings.notifications': { paramsTuple?: []; params?: {} }
    'settings.security': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'inbox': { paramsTuple?: []; params?: {} }
    'customers': { paramsTuple?: []; params?: {} }
    'notifications': { paramsTuple?: []; params?: {} }
    'settings.general': { paramsTuple?: []; params?: {} }
    'settings.members': { paramsTuple?: []; params?: {} }
    'settings.notifications': { paramsTuple?: []; params?: {} }
    'settings.security': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'inbox': { paramsTuple?: []; params?: {} }
    'customers': { paramsTuple?: []; params?: {} }
    'notifications': { paramsTuple?: []; params?: {} }
    'settings.general': { paramsTuple?: []; params?: {} }
    'settings.members': { paramsTuple?: []; params?: {} }
    'settings.notifications': { paramsTuple?: []; params?: {} }
    'settings.security': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}