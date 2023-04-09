import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'
import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecoveryEmail from 'App/Mailers/RecoveryEmail'
import User from 'App/Models/User'
import RecoveryStoreValidator from 'App/Validators/RecoveryStoreValidator'

export default class RecoveryController {
  @bind()
  public async store({ request }: HttpContextContract, user: User) {
    const payload = await request.validate(RecoveryStoreValidator)

    const url = Route.builder()
      .params({
        email: user.email,
      })
      .qs({
        password: payload.password,
        redirectUri: payload.redirectUri,
      })
      .prefixUrl(Env.get('DOMAIN'))
      .makeSigned('/recoveries/:email', {
        expiresIn: '5m',
        purpose: 'recovery',
      })

    await new RecoveryEmail(user, url).sendLater()
  }

  @bind()
  public async show({ request, response }: HttpContextContract, user: User) {
    if (request.hasValidSignature('verification')) {
      await user.merge({ password: request.qs().password }).save()
      response.redirect(request.qs().redirectUri)
    }
  }
}
