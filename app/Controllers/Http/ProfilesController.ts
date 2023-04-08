import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import ProfilesDestroyValidator from 'App/Validators/ProfilesDestroyValidator'
import ProfilesIndexValidator from 'App/Validators/ProfilesIndexValidator'
import ProfilesShowValidator from 'App/Validators/ProfilesShowValidator'
import ProfilesStoreValidator from 'App/Validators/ProfilesStoreValidator'
import ProfilesUpdateValidator from 'App/Validators/ProfilesUpdateValidator'
import { DateTime } from 'luxon'

export default class ProfilesController {
  public async index({ request, auth }: HttpContextContract) {
    const payload = await request.validate(ProfilesIndexValidator)

    return await Profile.query()
      .whereNotNull('verifiedAt')
      .whereNotNull('publishedAt')
      .andWhereNotNull('publishedAt')
      .orWhere('userId', auth.user?.id!)
      .paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate(ProfilesStoreValidator)

    if (auth.user) {
      return Profile.create({
        userId: auth.user.id,
        ...payload,
      })
    }
  }

  public async show({ request, auth }: HttpContextContract) {
    const payload = await request.validate(ProfilesShowValidator)

    return await Profile.query()
      .where('id', payload.params.profileId)
      .whereNotNull('verifiedAt')
      .andWhereNotNull('publishedAt')
      .orWhere('userId', auth.user?.id!)
      .firstOrFail()
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const { params, isPublished, ...payload } = await request.validate(ProfilesUpdateValidator)

    const profile = await Profile.findByOrFail('id', params.profileId)

    if (auth.user) {
      if (profile.userId === auth.user.id) {
        profile.merge({
          publishedAt: isPublished ? DateTime.now() : null,
          ...payload,
        })

        return await profile.save()
      }

      return response.forbidden({
        errors: [
          {
            message: 'You are not authorized to update this profile',
          },
        ],
      })
    }
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(ProfilesDestroyValidator)

    if (auth.user) {
      const profile = await Profile.findByOrFail('id', payload.params.profileId)

      if (profile.userId === auth.user.id) {
        await profile.delete()
        return response.gone()
      }

      return response.forbidden({
        errors: [
          {
            message: 'You are not authorized to delete this profile',
          },
        ],
      })
    }
  }
}
