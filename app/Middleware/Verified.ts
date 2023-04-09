import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnVerifiedException from 'App/Exceptions/UnVerifiedException'

export default class Verified {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user?.verifiedAt) {
      throw new UnVerifiedException('Unverified access', 403, 'E_UNVERIFIED_ACCESS')
    }
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
