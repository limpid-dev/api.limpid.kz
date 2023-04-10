import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnVerifiedException from 'App/Exceptions/UnVerifiedException'
import SessionStoreValidator from 'App/Validators/SessionStoreValidator'

export default class SessionController {
  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate(SessionStoreValidator)

    const attempt = await auth.use(payload.mode).attempt(payload.email, payload.password)

    if (!auth.user!.verifiedAt) {
      throw new UnVerifiedException('Unverified access', 403, 'E_UNVERIFIED_ACCESS')
    }

    return {
      data: attempt,
    }
  }

  public async show({ auth }: HttpContextContract) {
    return { data: auth.user }
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
