import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersStoreValidator from 'App/Validators/UsersStoreValidator'
import UsersUpdateValidator from 'App/Validators/UsersUpdateValidator'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(UsersStoreValidator)

    const createdUser = await User.create(payload)

    return { data: createdUser }
  }

  @bind()
  public async show({}: HttpContextContract, user: User) {
    return { data: user }
  }

  @bind()
  public async update({ request }: HttpContextContract, user: User) {
    const payload = await request.validate(UsersUpdateValidator)

    const mergedUser = user.merge(payload)

    const savedUser = await mergedUser.save()

    return { data: savedUser }
  }
}
