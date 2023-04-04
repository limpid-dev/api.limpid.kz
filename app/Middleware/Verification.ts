import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnVerifiedException from 'App/Exceptions/UnVerifiedException'

export default class VerificationMiddleware {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user?.isVerified) {
      throw new UnVerifiedException()
    }

    await next()
  }
}
