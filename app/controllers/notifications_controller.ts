import { getNotifications } from '#services/demo/notifications'

export default class NotificationsController {
  /**
   * JSON endpoint consumed by the notifications slideover, which is
   * part of the persistent dashboard layout rather than a page.
   */
  async index() {
    return getNotifications()
  }
}
