import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionsStoreValidator from 'App/Validators/SessionsStoreValidator'

export default class SessionsController {
  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate(SessionsStoreValidator)

    return await auth.use(payload.mode).attempt(payload.email, payload.password)
  }

  public destroy({ auth }: HttpContextContract) {
    return auth.logout()
  }
}
