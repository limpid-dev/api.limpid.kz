import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Verification {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user?.isVerified) {
      response.forbidden({ errors: [{ message: 'Unverified access' }] })
    }
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
