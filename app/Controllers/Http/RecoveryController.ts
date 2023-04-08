import { string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecoveryEmail from 'App/Mailers/RecoveryEmail'
import Token from 'App/Models/Token'
import RecoveryUpdateValidator from 'App/Validators/RecoveryUpdateValidator'
import { DateTime } from 'luxon'

export default class RecoveryController {
  public async store({ auth, bouncer }: HttpContextContract) {
    const user = auth.user!

    await bouncer.with('RecoveryPolicy').authorize('create')

    await user.related('tokens').query().where('type', 'RECOVERY').delete()

    const token = string.generateRandom(64)

    await user.related('tokens').create({
      expiredAt: DateTime.now().plus({ hours: 1 }),
      type: 'RECOVERY',
      token,
    })

    await new RecoveryEmail(user, token).sendLater()
  }

  public async update({ request, bouncer }: HttpContextContract) {
    const payload = await request.validate(RecoveryUpdateValidator)

    const token = await Token.findByOrFail('token', payload.token)

    await bouncer.with('RecoveryPolicy').authorize('update', token)

    const user = await token.related('user').query().firstOrFail()

    user.merge({ password: payload.password })

    await user.save()

    await token.delete()
  }
}
