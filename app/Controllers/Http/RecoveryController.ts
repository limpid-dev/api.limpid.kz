import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token from 'App/Models/Token'
import User from 'App/Models/User'
import RecoveryStoreValidator from 'App/Validators/RecoveryStoreValidator'
import RecoveryUpdateValidator from 'App/Validators/RecoveryUpdateValidator'
import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class RecoveryController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(RecoveryStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = string.generateRandom(64)

    await user.related('tokens').create({
      expiresAt: DateTime.now().plus({ hours: 1 }),
      type: 'RECOVERY',
      token,
    })

    await Mail.sendLater((message) => {
      message.from('info@limpid.kz').to(user.email).subject('Password recovery').text(token)
    })
  }

  public async update({ request }: HttpContextContract) {
    const payload = await request.validate(RecoveryUpdateValidator)

    const token = await Token.query()
      .where('token', payload.params.token)
      .andWhere('type', 'RECOVERY')
      .andWhere('expiresAt', '>', DateTime.now().toSQL())
      .preload('user')
      .firstOrFail()

    await token.user.merge({ password: payload.password }).save()
    await token.delete()
  }
}
