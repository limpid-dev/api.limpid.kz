import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Session/StoreValidator'

export default class SessionController {
  public async store({ auth, request }: HttpContextContract) {
    const { email, password } = await request.validate(StoreValidator)

    const attempt = await auth.attempt(email, password)

    return {
      data: attempt,
    }
  }

  public async show({ auth }: HttpContextContract) {
    return {
      data: auth.user,
    }
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
