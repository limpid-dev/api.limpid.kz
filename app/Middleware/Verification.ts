import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnVerifiedException from 'App/Exceptions/UnVerifiedException'

export default class VerificationMiddleware {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user) {
      if (!auth.user.verifiedAt) {
        throw new UnVerifiedException('You are not verified', 403, 'E_UNVERIFIED')
      }
    }

    await next()
  }
}
