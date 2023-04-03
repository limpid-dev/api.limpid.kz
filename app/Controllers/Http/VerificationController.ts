import Mail from '@ioc:Adonis/Addons/Mail'
import { base64, string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token from 'App/Models/Token'
import User from 'App/Models/User'
import VerificationStoreValidator from 'App/Validators/VerificationStoreValidator'
import VerificationUpdateValidator from 'App/Validators/VerificationUpdateValidator'
import { DateTime } from 'luxon'

export default class VerificationController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(VerificationStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    await user.related('tokens').query().where('type', 'VERIFICATION').delete()

    const token = string.generateRandom(64)

    await user.related('tokens').create({
      expiredAt: DateTime.now().plus({ hours: 1 }),
      type: 'VERIFICATION',
      token,
    })

    await Mail.sendLater((message) => {
      message
        .from('info@limpid.kz')
        .to(user.email)
        .subject('Email verification')
        .text(base64.encode(token))
    })
  }

  public async update({ request }: HttpContextContract) {
    const payload = await request.validate(VerificationUpdateValidator)

    const token = await Token.query()
      .where('token', base64.decode(payload.params.token))
      .andWhere('type', 'VERIFICATION')
      .andWhere('expiredAt', '>', DateTime.now().toSQL())
      .preload('user')
      .firstOrFail()

    await token.user.merge({ verifiedAt: DateTime.now() }).save()

    await token.delete()
  }
}
