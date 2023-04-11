import Redis from '@ioc:Adonis/Addons/Redis'
import { safeEqual, string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecoveryEmail from 'App/Mailers/RecoveryEmail'
import User from 'App/Models/User'
import RecoveryStoreValidator from 'App/Validators/RecoveryStoreValidator'
import RecoveryUpdateValidator from 'App/Validators/RecoveryUpdateValidator'

export default class RecoveryController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(RecoveryStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = string.generateRandom(6)

    await Redis.set(`recovery:${user.id}`, token, 'EX', 60 * 5)

    await new RecoveryEmail(user, token).sendLater()
  }

  public async show({ request, response }: HttpContextContract) {
    const payload = await request.validate(RecoveryUpdateValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = await Redis.get(`recovery:${user.id}`)

    if (token) {
      if (safeEqual(token, payload.token)) {
        await user.merge({ password: payload.password }).save()
        await Redis.del(`recovery:${user.id}`)
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
