import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreValidator from 'App/Validators/EmailVerification/StoreValidator'
import { TOTP } from 'otpauth'
import EmailVerification from 'App/Mailers/EmailVerification'
import UpdateValidator from 'App/Validators/EmailVerification/UpdateValidator'
import { DateTime } from 'luxon'
import InvalidTokenException from 'App/Exceptions/InvalidTokenException'

export default class EmailVerificationController {
  public async store({ request }: HttpContextContract) {
    const { email } = await request.validate(StoreValidator)

    const user = await User.findByOrFail('email', email)

    const totp = new TOTP({
      secret: user.secret,
    })

    const token = totp.generate()

    await new EmailVerification(user, token).sendLater()
  }

  public async update({ request }: HttpContextContract) {
    const { email, token } = await request.validate(UpdateValidator)

    const user = await User.findByOrFail('email', email)

    const totp = new TOTP({
      secret: user.secret,
    })

    const isValid = totp.validate({ token }) !== null

    if (isValid) {
      user.merge({ emailVerifiedAt: DateTime.now() })
      await user.save()
    } else {
      throw new InvalidTokenException()
    }
  }
}
