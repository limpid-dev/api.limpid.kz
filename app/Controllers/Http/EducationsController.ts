import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Education from 'App/Models/Education'
import Profile from 'App/Models/Profile'
import EducationsDestroyValidator from 'App/Validators/EducationsDestroyValidator'
import EducationsIndexValidator from 'App/Validators/EducationsIndexValidator'
import EducationsStoreValidator from 'App/Validators/EducationsStoreValidator'
import EducationsUpdateValidator from 'App/Validators/EducationsUpdateValidator'

export default class EducationsController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(EducationsIndexValidator)

    return await Education.query()
      .where('profileId', payload.params.profileId)
      .paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(EducationsStoreValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        return await Education.create({
          profileId: params.profileId,
          ...payload,
        })
      }
    }

    return response.forbidden({})
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const { params, ...payload } = await request.validate(EducationsUpdateValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const contact = await Education.findOrFail(params.educationId)

        return await contact.merge(payload).save()
      }
    }

    return response.forbidden({})
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const { params } = await request.validate(EducationsDestroyValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const contact = await Education.findOrFail(params.educationId)

        return await contact.delete()
      }
    }

    return response.forbidden({})
  }
}
