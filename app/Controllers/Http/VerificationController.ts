import { string, safeEqual } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import User from 'App/Models/User'
import VerificationStoreValidator from 'App/Validators/VerificationStoreValidator'
import { DateTime } from 'luxon'
import VerificationUpdateValidator from 'App/Validators/VerificationUpdateValidator'

export default class VerificationController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(VerificationStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = string.generateRandom(6)

    await user.related('tokens').query().where('type', 'verification').delete()

    await user.related('tokens').create({
      token,
      type: 'verification',
      expiresAt: DateTime.now().plus({
        minutes: 5,
      }),
    })

    await new VerifyEmail(user, token).sendLater()
  }

  public async update({ request, response }: HttpContextContract) {
    const payload = await request.validate(VerificationUpdateValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = await user
      .related('tokens')
      .query()
      .where('token', payload.token)
      .andWhere('type', 'verification')
      .andWhere('expiresAt', '>', DateTime.now().toSQL())
      .first()

    if (token) {
      if (safeEqual(token.token, payload.token)) {
        await user.merge({ verifiedAt: DateTime.now() }).save()
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
