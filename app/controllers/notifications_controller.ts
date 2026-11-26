import DemoNotificationsService from '#services/demo/notifications'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class NotificationsController {
  /**
   * JSON endpoint consumed by the notifications slideover, which is
   * part of the persistent dashboard layout rather than a page.
   */
  @inject()
  async index(_ctx: HttpContext, notifications: DemoNotificationsService) {
    return notifications.all()
  }
}
