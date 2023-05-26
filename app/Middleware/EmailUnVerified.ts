import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EmailVerifiedException from 'App/Exceptions/EmailVerifiedException'

export default class EmailUnVerified {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user?.emailVerifiedAt !== null) {
      throw new EmailVerifiedException()
    }
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
