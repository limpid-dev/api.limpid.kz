import { string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecoveryEmail from 'App/Mailers/RecoveryEmail'
import Token from 'App/Models/Token'
import User from 'App/Models/User'
import RecoveryStoreValidator from 'App/Validators/RecoveryStoreValidator'
import RecoveryUpdateValidator from 'App/Validators/RecoveryUpdateValidator'
import { DateTime } from 'luxon'

export default class RecoveryController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(RecoveryStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    await user.related('tokens').query().where('type', 'RECOVERY').delete()

    const token = string.generateRandom(64)

    await user.related('tokens').create({
      expiredAt: DateTime.now().plus({ hours: 1 }),
      type: 'RECOVERY',
      token,
    })

    await new RecoveryEmail(user, token).sendLater()
  }

  public async update({ request }: HttpContextContract) {
    const payload = await request.validate(RecoveryUpdateValidator)

    const token = await Token.query()
      .where('token', payload.token)
      .andWhere('type', 'RECOVERY')
      .andWhere('expiredAt', '>', DateTime.now().toSQL())
      .preload('user')
      .firstOrFail()

    token.user.merge({ password: payload.password })

    await token.user.save()

    await token.delete()
  }
}
