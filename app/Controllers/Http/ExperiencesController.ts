import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Experience from 'App/Models/Experience'
import Profile from 'App/Models/Profile'
import ExperiencesDestroyValidator from 'App/Validators/ExperiencesDestroyValidator'
import ExperiencesIndexValidator from 'App/Validators/ExperiencesIndexValidator'
import ExperiencesStoreValidator from 'App/Validators/ExperiencesStoreValidator'
import ExperiencesUpdateValidator from 'App/Validators/ExperiencesUpdateValidator'

export default class ExperiencesController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ExperiencesIndexValidator)

    return await Experience.query()
      .where('profileId', payload.params.profileId)
      .paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(ExperiencesStoreValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        return await Experience.create({
          profileId: params.profileId,
          ...payload,
        })
      }
    }

    return response.forbidden({})
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(ExperiencesUpdateValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const contact = await Experience.findOrFail(params.experienceId)

        return await contact.merge(payload).save()
      }
    }

    return response.forbidden({})
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const { params } = await request.validate(ExperiencesDestroyValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const contact = await Experience.findOrFail(params.experienceId)

        return await contact.delete()
      }
    }

    return response.forbidden({})
  }
}
