import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersStoreValidator from 'App/Validators/UsersStoreValidator'
import UsersUpdateValidator from 'App/Validators/UsersUpdateValidator'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(UsersStoreValidator)

    const user = await User.create(payload)

    return { data: user }
  }

  @bind()
  public async show({}: HttpContextContract, user: User) {
    return { data: user }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, user: User) {
    await bouncer.with('UserPolicy').authorize('update', user)
    const payload = await request.validate(UsersUpdateValidator)

    user.merge(payload)

    await user.save()

    return { data: user }
  }
}
