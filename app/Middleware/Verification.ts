import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerificationMiddleware {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user?.isVerified) {
      return response.forbidden()
    }

    await next()
  }
}
