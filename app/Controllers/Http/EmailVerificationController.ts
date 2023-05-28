import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvalidTokenException from 'App/Exceptions/InvalidTokenException'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import ApiToken from 'App/Models/ApiToken'
import UpdateValidator from 'App/Validators/EmailVerification/UpdateValidator'
import { DateTime } from 'luxon'

export default class EmailVerificationController {
  public async store({ bouncer, auth, response }: HttpContextContract) {
    await bouncer.with('VerificationPolicy').authorize('create')

    const token = await ApiToken.generate(auth.user!, {
      type: 'EMAIL_VERIFICATION',
      size: 8,
      expiresAt: DateTime.now().plus({ minutes: 15 }),
    })

    await new VerifyEmail(auth.user!, token).sendLater()

    response.status(201)
  }

  public async update({ request, auth }: HttpContextContract) {
    const { token } = await request.validate(UpdateValidator)

    const isTokenValid = await ApiToken.isValid(token, 'EMAIL_VERIFICATION')

    if (isTokenValid) {
      auth.user?.merge({
        emailVerifiedAt: DateTime.now(),
      })

      await auth.user?.save()
    } else {
      throw new InvalidTokenException('Email Verification Token')
    }
  }
}
