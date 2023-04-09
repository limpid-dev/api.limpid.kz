import { string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import Token from 'App/Models/Token'
import VerificationUpdateValidator from 'App/Validators/VerificationUpdateValidator'
import { DateTime } from 'luxon'

export default class VerificationController {
  public async store({ auth }: HttpContextContract) {
    const user = auth.user!

    await user.related('tokens').query().where('type', 'VERIFICATION').delete()

    const token = string.generateRandom(64)

    await user.related('tokens').create({
      expiredAt: DateTime.now().plus({ hours: 1 }),
      type: 'VERIFICATION',
      token,
    })

    await new VerifyEmail(user, token).sendLater()
  }

  public async update({ request }: HttpContextContract) {
    const payload = await request.validate(VerificationUpdateValidator)

    const token = await Token.query()
      .where('token', payload.token)
      .andWhere('type', 'VERIFICATION')
      .andWhere('expiredAt', '>', DateTime.now().toSQL())
      .preload('user')
      .firstOrFail()

    const user = await token.related('user').query().firstOrFail()

    user.merge({ verifiedAt: DateTime.now() })

    await user.save()

    await token.delete()
  }
}
