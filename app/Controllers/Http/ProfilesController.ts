import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import ProfilesDestroyValidator from 'App/Validators/ProfilesDestroyValidator'
import ProfilesIndexValidator from 'App/Validators/ProfilesIndexValidator'
import ProfilesShowValidator from 'App/Validators/ProfilesShowValidator'
import ProfilesStoreValidator from 'App/Validators/ProfilesStoreValidator'
import ProfilesUpdateValidator from 'App/Validators/ProfilesUpdateValidator'

export default class ProfilesController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ProfilesIndexValidator)

    return await Profile.query().paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth }: HttpContextContract) {
    const { avatar, ...payload } = await request.validate(ProfilesStoreValidator)

    if (auth.user) {
      return Profile.create({
        userId: auth.user.id,
        avatar: avatar ? Attachment.fromFile(avatar) : null,
        ...payload,
      })
    }
  }

  public async show({ request }: HttpContextContract) {
    const payload = await request.validate(ProfilesShowValidator)

    return await Profile.findByOrFail('id', payload.params.profileId)
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const { params, avatar, ...payload } = await request.validate(ProfilesUpdateValidator)

    const profile = await Profile.findByOrFail('id', params.profileId)

    if (auth.user) {
      if (profile.userId === auth.user.id) {
        profile.merge({
          avatar: avatar ? Attachment.fromFile(avatar) : null,
          ...payload,
        })
        return await profile.save()
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
