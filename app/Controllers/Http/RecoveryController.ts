import Redis from '@ioc:Adonis/Addons/Redis'
import Hash from '@ioc:Adonis/Core/Hash'
import { string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import User from 'App/Models/User'
import RecoveryStoreValidator from 'App/Validators/RecoveryStoreValidator'
import RecoveryUpdateValidator from 'App/Validators/RecoveryUpdateValidator'

export default class RecoveryController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(RecoveryStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = string.generateRandom(64)

    const hashedToken = await Hash.make(token)

    await Redis.set(`recovery:${user.id}`, hashedToken, 'EX', 60 * 60 * 5)

    await new VerifyEmail(user, token).sendLater()
  }

  public async update({ request }: HttpContextContract) {
    const payload = await request.validate(RecoveryUpdateValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = await Redis.get(`recovery:${user.id}`)

    if (token) {
      if (await Hash.verify(token, payload.token)) {
        user.merge({ password: payload.password })
        await user.save()
      }
    }
  }
}
