import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvalidTokenException from 'App/Exceptions/InvalidTokenException'
import RecoverPassword from 'App/Mailers/RecoverPassword'
import ApiToken from 'App/Models/ApiToken'
import User from 'App/Models/User'
import UpdateValidator from 'App/Validators/PasswordRecovery/UpdateValidator'
import StoreValidator from 'App/Validators/PasswordRecovery/StoreValidator'
import { DateTime } from 'luxon'

export default class PasswordRecoveryController {
  public async store({ request, auth, response }: HttpContextContract) {
    const { email } = await request.validate(StoreValidator)

    const user = await User.findByOrFail('email', email)

    const token = await ApiToken.generate(user, {
      type: 'PASSWORD_RECOVERY',
      size: 8,
      expiresAt: DateTime.now().plus({ minutes: 15 }),
    })

    await new RecoverPassword(auth.user!, token).sendLater()

    response.status(201)
  }

  public async update({ request, auth }: HttpContextContract) {
    const { token, password } = await request.validate(UpdateValidator)

    const isTokenValid = await ApiToken.isValid(token, 'PASSWORD_RECOVERY')

    if (isTokenValid) {
      auth.user?.merge({
        password,
      })

      await auth.user?.save()
    } else {
      throw new InvalidTokenException('Password Recovery Token')
    }
  }
}
