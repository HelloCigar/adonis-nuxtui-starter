import DemoMembersService from '#services/demo/members'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class MembersController {
  @inject()
  async index({ inertia }: HttpContext, members: DemoMembersService) {
    return inertia.render('settings/members', { members: members.all() })
  }
}
