import DemoMailsService from '#services/demo/mails'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class InboxController {
  @inject()
  async index({ inertia }: HttpContext, mails: DemoMailsService) {
    return inertia.render('inbox', { mails: mails.all() })
  }
}
