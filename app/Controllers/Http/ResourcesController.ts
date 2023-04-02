import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Resource from 'App/Models/Resource'
import ResourceIndexValidator from 'App/Validators/ResourceIndexValidator'
import ResourceStoreValidator from 'App/Validators/ResourceStoreValidator'

export default class ResourcesController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ResourceIndexValidator)

    return await Database.from('resources')
      .where('profile_id', payload.params.profileId)
      .paginate(payload.page, payload.perPage)
  }

  public async store({ request }: HttpContextContract) {
    const { params, ...payload } = await request.validate(ResourceStoreValidator)

    Resource.create({ profileId: params.profileId, ...payload })
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
