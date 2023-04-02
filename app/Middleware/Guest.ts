import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GuestMiddleware {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.isLoggedIn) {
      response.forbidden({
        errors: [
          {
            message: 'You are already logged in',
          },
        ],
      })
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
