import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class UsersController {
  public async index({ request }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    const users = await User.query().paginate(page, perPage)

    return users.queryString(request.qs())
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
