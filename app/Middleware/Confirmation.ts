import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ConfirmationValidator from 'App/Validators/ConfirmationValidator'

export default class ConfirmationMiddleware {
  public async handle({ request, auth }: HttpContextContract, next: () => Promise<void>) {
    const payload = await request.validate(ConfirmationValidator)

    await auth.verifyCredentials(payload['@confirmation'].email, payload['@confirmation'].password)

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
