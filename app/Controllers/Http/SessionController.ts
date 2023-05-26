import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Session/StoreValidator'

export default class SessionController {
  public async store({ auth, request, response }: HttpContextContract) {
    const { email, password } = await request.validate(StoreValidator)

    const attempt = await auth.attempt(email, password)

    response.status(201)

    return {
      data: attempt,
    }
  }

  public async show({ auth }: HttpContextContract) {
    return {
      data: auth.user,
    }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    await auth.logout()
    response.status(204)
  }
}
