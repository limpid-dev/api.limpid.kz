import { string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import Token from 'App/Models/Token'
import VerificationUpdateValidator from 'App/Validators/VerificationUpdateValidator'
import { DateTime } from 'luxon'

export default class VerificationController {
  public async store({ auth, bouncer }: HttpContextContract) {
    const user = auth.user!

    await bouncer.with('VerificationPolicy').authorize('create')

    await user.related('tokens').query().where('type', 'VERIFICATION').delete()

    const token = string.generateRandom(64)

    await user.related('tokens').create({
      expiredAt: DateTime.now().plus({ hours: 1 }),
      type: 'VERIFICATION',
      token,
    })

    await new VerifyEmail(user, token).sendLater()
  }

  public async update({ request, bouncer }: HttpContextContract) {
    const payload = await request.validate(VerificationUpdateValidator)

    const token = await Token.findByOrFail('token', payload.token)

    await bouncer.with('VerificationPolicy').authorize('update', token)

    const user = await token.related('user').query().firstOrFail()

    user.merge({ verifiedAt: DateTime.now() })

    await user.save()

    await token.delete()
  }
}
