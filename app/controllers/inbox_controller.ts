import { getMails } from '#services/demo/mails'
import type { HttpContext } from '@adonisjs/core/http'

export default class InboxController {
  async index({ inertia }: HttpContext) {
    return inertia.render('inbox', { mails: getMails() })
  }
}
