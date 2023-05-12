import { safeEqual, string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecoveryEmail from 'App/Mailers/RecoveryEmail'
import User from 'App/Models/User'
import RecoveryStoreValidator from 'App/Validators/RecoveryStoreValidator'
import RecoveryUpdateValidator from 'App/Validators/RecoveryUpdateValidator'
import { DateTime } from 'luxon'

export default class RecoveryController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(RecoveryStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = string.generateRandom(6)

    await user.related('tokens').query().where('type', "recovery").delete()

    await user.related('tokens').create({
      token,
      type: 'recovery',
      expiresAt: DateTime.now().plus({
        minutes: 5,
      }),
    })

    await new RecoveryEmail(user, token).sendLater()
  }

  public async update({ request, response }: HttpContextContract) {
    const payload = await request.validate(RecoveryUpdateValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = await user
      .related('tokens')
      .query()
      .where('token', payload.token)
      .andWhere('type', 'recovery')
      .andWhere('expiresAt', '>', DateTime.now().toSQL())
      .first()

    if (token) {
      if (safeEqual(token.token, payload.token)) {
        await user.merge({ password: payload.password }).save()
        await token.delete()
        return
      }
    }

    return response.abort(
      {
        errors: [
          {
            message: 'Invalid token',
          },
        ],
      },
      422
    )
  }
}
