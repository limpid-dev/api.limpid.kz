import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Resource from 'App/Models/Resource'
import ResourcesIndexValidator from 'App/Validators/ResourcesIndexValidator'
import ResourcesStoreValidator from 'App/Validators/ResourcesStoreValidator'

export default class ResourcesController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ResourcesIndexValidator)

    return await Resource.query()
      .where('profileId', payload.params.profileId)
      .paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(ResourcesStoreValidator)

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
