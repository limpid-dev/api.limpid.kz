import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotGuestException from 'App/Exceptions/NotGuestException'

export default class Guest {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    if (auth.isAuthenticated) {
      throw new NotGuestException()
    }
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
