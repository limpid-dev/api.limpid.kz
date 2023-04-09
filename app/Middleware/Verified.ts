import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Verified {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user?.verifiedAt) {
      return response.abort({ errors: [{ message: 'E_UNVERIFIED_ACCESS Unverified access' }] }, 403)
    }
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
