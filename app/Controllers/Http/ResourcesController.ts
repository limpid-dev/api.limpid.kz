import Database from '@ioc:Adonis/Lucid/Database'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ResourceIndexValidator from 'App/Validators/ResourceIndexValidator'

export default class ResourcesController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ResourceIndexValidator)

    return await Database.from('resources')
      .where('profile_id', payload.params.profileId)
      .paginate(payload.page, payload.perPage)
  }

  public async store({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
