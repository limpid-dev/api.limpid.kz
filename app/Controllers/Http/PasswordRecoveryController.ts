import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvalidTokenException from 'App/Exceptions/InvalidTokenException'
import PasswordRecovery from 'App/Mailers/PasswordRecovery'
import User from 'App/Models/User'
import UpdateValidator from 'App/Validators/PasswordRecovery/UpdateValidator'
import StoreValidator from 'App/Validators/PasswordRecovery/StoreValidator'
import { TOTP } from 'otpauth'

export default class PasswordRecoveryController {
  public async store({ request, response }: HttpContextContract) {
    const { email } = await request.validate(StoreValidator)

    const user = await User.findByOrFail('email', email)

    const totp = new TOTP({
      secret: user.secret,
    })

    const token = totp.generate()

    await new PasswordRecovery(user, token).sendLater()

    response.status(201)
  }

  public async update({ request, response }: HttpContextContract) {
    const { email, password, token } = await request.validate(UpdateValidator)

    const user = await User.findByOrFail('email', email)

    const totp = new TOTP({
      secret: user.secret,
    })

    const isValid = totp.validate({ token }) !== null

    if (isValid) {
      user.merge({ password })
      await user.save()
      response.status(204)
    } else {
      throw new InvalidTokenException()
    }
  }
}
