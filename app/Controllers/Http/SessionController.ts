import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionStoreValidator from 'App/Validators/SessionStoreValidator'

export default class SessionController {
  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate(SessionStoreValidator)

    return await auth.use(payload.mode).attempt(payload.email, payload.password)
  }

  public async show({ auth }: HttpContextContract) {
    return auth.user
  }

  public destroy({ auth }: HttpContextContract) {
    return auth.logout()
  }
}
