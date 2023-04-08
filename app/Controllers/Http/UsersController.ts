import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersStoreValidator from 'App/Validators/UsersStoreValidator'
import UsersUpdateValidator from 'App/Validators/UsersUpdateValidator'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(UsersStoreValidator)

    return User.create(payload)
  }

  public async show({ params }: HttpContextContract) {
    return User.find(params.id)
  }

  public async update({ request, params }: HttpContextContract) {
    const payload = await request.validate(UsersUpdateValidator)

    const user = await User.findOrFail(params.id)

    return user.merge(payload).save()
  }
}
