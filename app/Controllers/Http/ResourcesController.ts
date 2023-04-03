import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Profile from 'App/Models/Profile'
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

  public async store({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(ResourceStoreValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        return Resource.create({ profileId: params.profileId, ...payload })
      }
    }

    return response.forbidden({
      errors: [
        {
          message: 'You are not allowed to create a resource for this profile',
        },
      ],
    })
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}