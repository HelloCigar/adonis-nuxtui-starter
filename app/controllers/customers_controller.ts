import { getCustomers } from '#services/demo/customers'
import type { HttpContext } from '@adonisjs/core/http'

export default class CustomersController {
  async index({ inertia }: HttpContext) {
    return inertia.render('customers', { customers: getCustomers() })
  }
}
