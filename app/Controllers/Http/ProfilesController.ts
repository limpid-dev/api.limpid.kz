import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Profile from 'App/Models/Profile'
import ProfilesIndexValidator from 'App/Validators/ProfilesIndexValidator'
import ProfilesStoreValidator from 'App/Validators/ProfilesStoreValidator'

export default class ProfilesController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ProfilesIndexValidator)

    return await Database.from('profiles').paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate(ProfilesStoreValidator)

    if (auth.user) {
      return Profile.create({ userId: auth.user.id, ...payload })
    }
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
