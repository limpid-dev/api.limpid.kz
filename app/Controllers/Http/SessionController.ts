import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Session/StoreValidator'

export default class SessionController {
  public async store({ request, auth, response }: HttpContextContract) {
    const { email, password } = await request.validate(StoreValidator)

    const attempt = await auth.use('api').attempt(email, password, { expiresIn: '7d' })

    response.status(201)

    return {
      data: attempt,
    }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    response.status(204)
    await auth.use('api').logout()
  }
}
