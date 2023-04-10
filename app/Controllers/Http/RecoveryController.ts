import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'
import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecoveryEmail from 'App/Mailers/RecoveryEmail'
import User from 'App/Models/User'
import RecoveryStoreValidator from 'App/Validators/RecoveryStoreValidator'

export default class RecoveryController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(RecoveryStoreValidator)

    const user = await User.findByOrFail('email', payload.email)

    const url = Route.builder()
      .params([user.email])
      .qs({
        password: payload.password,
        redirectUrl: payload.redirectUrl,
      })
      .prefixUrl(Env.get('DOMAIN'))
      .makeSigned('RecoveryController.show', {
        expiresIn: '5m',
        purpose: 'recovery',
      })

    await new RecoveryEmail(user, url).sendLater()
  }

  @bind()
  public async show({ request, response }: HttpContextContract, user: User) {
    if (request.hasValidSignature('recovery')) {
      await user.merge({ password: request.qs().password }).save()
      response.redirect(request.qs().redirectUri)
    }
  }
}
