import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersMeController {
  public async index({ auth }: HttpContextContract) {
    return auth.user
  }
}
