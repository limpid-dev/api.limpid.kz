import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import ProfilesIndexValidator from 'App/Validators/ProfilesIndexValidator'

export default class ProfilesController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ProfilesIndexValidator)

    return await Database.from('profiles').paginate(payload.page, payload.perPage)
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
