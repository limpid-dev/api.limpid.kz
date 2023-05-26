import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import IndexValidator from 'App/Validators/Users/IndexValidator'
import StoreValidator from 'App/Validators/Users/StoreValidator'
import UpdateValidator from 'App/Validators/Users/UpdateValidator'

export default class UsersController {
  public async index({ request }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const users = await User.query().paginate(page, perPage)

    return users
  }

  public async store({ request }: HttpContextContract) {
    const { email, password } = await request.validate(StoreValidator)

    const user = await User.updateOrCreate({ email }, { email, password })

    return {
      data: user,
    }
  }

  @bind()
  public async show({}: HttpContextContract, user: User) {
    return {
      data: user,
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, user: User) {
    await bouncer.with('UserPolicy').authorize('update', user)
    const { email, password } = await request.validate(UpdateValidator)

    user.merge({ email, password })

    await user.save()

    return {
      data: user,
    }
  }
}
