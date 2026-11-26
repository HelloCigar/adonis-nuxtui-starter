import DemoCustomersService from '#services/demo/customers'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class CustomersController {
  @inject()
  async index({ inertia }: HttpContext, customers: DemoCustomersService) {
    return inertia.render('customers', { customers: customers.all() })
  }
}
