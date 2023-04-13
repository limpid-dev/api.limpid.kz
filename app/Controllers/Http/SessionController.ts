import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionStoreValidator from 'App/Validators/SessionStoreValidator'

export default class SessionController {
  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate(SessionStoreValidator)

    if (payload.mode === 'web') {
      await auth.use('web').attempt(payload.email, payload.password)

      const user = await auth.authenticate()

      if (!user.verifiedAt) {
        throw new AuthenticationException('Unverified access', 'E_UNVERIFIED_ACCESS', payload.mode)
      }
    }

    if (payload.mode === 'api') {
      const attempt = await auth.use('api').attempt(payload.email, payload.password)

      if (!attempt.user.verifiedAt) {
        throw new AuthenticationException('Unverified access', 'E_UNVERIFIED_ACCESS', payload.mode)
      }

      return {
        data: attempt,
      }
    }
  }

  public async show({ auth }: HttpContextContract) {
    return { data: auth.user }
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
