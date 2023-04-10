import { bind } from '@adonisjs/route-model-binding'
import Env from '@ioc:Adonis/Core/Env'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import User from 'App/Models/User'
import VerificationStoreValidator from 'App/Validators/VerificationStoreValidator'
import { DateTime } from 'luxon'

export default class VerificationController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(VerificationStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    const url = Route.builder()
      .params([user.email])
      .qs({
        redirectUrl: payload.redirectUrl,
      })
      .prefixUrl(Env.get('DOMAIN'))
      .makeSigned('VerificationController.show', {
        expiresIn: '5m',
        purpose: 'verification',
      })

    await new VerifyEmail(user, url).sendLater()
  }

  @bind()
  public async show({ request, response }: HttpContextContract, user: User) {
    if (request.hasValidSignature('verification')) {
      await user.merge({ verifiedAt: DateTime.now() }).save()
      response.redirect(request.qs().redirectUri)
    }
  }
}
