import { string, safeEqual } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import User from 'App/Models/User'
import VerificationStoreValidator from 'App/Validators/VerificationStoreValidator'
import { DateTime } from 'luxon'
import Redis from '@ioc:Adonis/Addons/Redis'
import VerificationUpdateValidator from 'App/Validators/VerificationUpdateValidator'

export default class VerificationController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(VerificationStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = string.generateRandom(6)

    await Redis.set(`verification:${user.id}`, token, 'EX', 60 * 5)

    await new VerifyEmail(user, token).sendLater()
  }

  public async update({ request, response }: HttpContextContract) {
    const payload = await request.validate(VerificationUpdateValidator)

    const user = await User.findByOrFail('email', payload.email)

    const token = await Redis.get(`verification:${user.id}`)

    if (token) {
      if (safeEqual(token, payload.token)) {
        await user.merge({ verifiedAt: DateTime.now() }).save()
        await Redis.del(`verification:${user.id}`)
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
