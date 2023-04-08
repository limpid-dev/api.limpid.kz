import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersStoreValidator from 'App/Validators/UsersStoreValidator'
import UsersUpdateValidator from 'App/Validators/UsersUpdateValidator'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(UsersStoreValidator)

    return await User.create(payload)
  }

  @bind()
  public async show({}: HttpContextContract, user: User) {
    return user
  }

  @bind()
  public async update({ request }: HttpContextContract, user: User) {
    const payload = await request.validate(UsersUpdateValidator)

    return await user.merge(payload).save()
  }
}
