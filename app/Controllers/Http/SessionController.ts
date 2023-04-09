import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionStoreValidator from 'App/Validators/SessionStoreValidator'

export default class SessionController {
  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate(SessionStoreValidator)

    const attempt = await auth.use(payload.mode).attempt(payload.email, payload.password)

    return {
      data: attempt,
    }
  }

  public async show({ auth }: HttpContextContract) {
    return { data: auth.user }
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
