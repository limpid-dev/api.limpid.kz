import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersMeUpdateValidator from 'App/Validators/UsersMeUpdateValidator'

export default class UsersMeController {
  public async index({ auth }: HttpContextContract) {
    return auth.user
  }

  public async update({ request, auth }: HttpContextContract) {
    const payload = await request.validate(UsersMeUpdateValidator)

    await auth.user?.merge(payload).save()
  }
}
