import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EmailUnVerifiedException from 'App/Exceptions/EmailUnVerifiedException'

export default class EmailVerified {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user?.emailVerifiedAt === null) {
      throw new EmailUnVerifiedException()
    }
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
