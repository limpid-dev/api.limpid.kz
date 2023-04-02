import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersShowValidator from 'App/Validators/UsersShowValidator'
import UsersStoreValidator from 'App/Validators/UsersStoreValidator'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(UsersStoreValidator)

    return User.create(payload)
  }

  public async show({ request }: HttpContextContract) {
    const payload = await request.validate(UsersShowValidator)

    return User.find(payload.id)
  }
}