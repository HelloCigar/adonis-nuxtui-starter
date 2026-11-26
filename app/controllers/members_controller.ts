import { getMembers } from '#services/demo/members'
import type { HttpContext } from '@adonisjs/core/http'

export default class MembersController {
  async index({ inertia }: HttpContext) {
    return inertia.render('settings/members', { members: getMembers() })
  }
}
