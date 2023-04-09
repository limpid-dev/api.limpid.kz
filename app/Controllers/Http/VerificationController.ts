import Redis from '@ioc:Adonis/Addons/Redis'
import Hash from '@ioc:Adonis/Core/Hash'
import { string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import VerificationUpdateValidator from 'App/Validators/VerificationUpdateValidator'
import { DateTime } from 'luxon'

export default class VerificationController {
  public async store({ auth }: HttpContextContract) {
    const token = string.generateRandom(64)

    const hashedToken = await Hash.make(token)

    await Redis.set(`verification:${auth.user!.id}`, hashedToken, 'EX', 60 * 60 * 5)

    await new VerifyEmail(auth.user!, token).sendLater()
  }

  public async update({ request, auth }: HttpContextContract) {
    const payload = await request.validate(VerificationUpdateValidator)

    const token = await Redis.get(`verification:${auth.user!.id}`)

    if (token) {
      if (await Hash.verify(token, payload.token)) {
        auth.user!.merge({ verifiedAt: DateTime.now() })
        await auth.user!.save()
      }
    }
  }
}
