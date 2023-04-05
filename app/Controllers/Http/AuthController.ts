import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import AuthLoginValidator from 'App/Validators/AuthLoginValidator'
import { DateTime } from 'luxon'

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(AuthLoginValidator)

    const user = await Database.from('users').where('email', payload.email).firstOrFail()

    const isValid = await Hash.verify(user.password, payload.password)

    if (!isValid) {
      return response.badRequest({
        errors: [
          {
            message: 'E_INVALID_AUTH_PASSWORD: Password mis-match',
          },
        ],
      })
    }

    const isBanned = await Database.from('bans')
      .from('bans')
      .where('user_id', user.id)
      .andWhere('expired_at', '>', DateTime.now().toSQL())
      .orWhereNull('expired_at')
      .first()

    if (isBanned) {
      return response.forbidden({
        errors: [
          {
            message: 'E_AUTHORIZATION_FAILURE: Banned access',
            description: isBanned.description,
          },
        ],
      })
    }

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
