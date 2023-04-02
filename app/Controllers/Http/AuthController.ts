import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthLoginValidator from 'App/Validators/AuthLoginValidator'

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const payload = await request.validate(AuthLoginValidator)

    if (payload.mode === 'web') {
      await auth.use('web').attempt(payload.email, payload.password)
    }

    if (payload.mode === 'api') {
      const attempt = await auth.use('api').attempt(payload.email, payload.password)

      return attempt.toJSON()
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
