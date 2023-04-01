import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersShowValidator from 'App/Validators/UsersShowValidator'

export default class UsersController {
  public async store({}: HttpContextContract) {}

  public async show({ request }: HttpContextContract) {
    const payload = await request.validate(UsersShowValidator)

    return User.find(payload.id)
  }
}
