import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfilesStoreValidator from 'App/Validators/ProfilesStoreValidator'
import ProfilesUpdateValidator from 'App/Validators/ProfilesUpdateValidator'

export default class ProfilesController {
  public async index({ request, auth }: HttpContextContract) {
    const user = auth.user!
    const payload = await request.validate(PaginationValidator)

    return await Profile.query()
      .whereNotNull('verifiedAt')
      .orWhere('userId', user.id)
      .paginate(payload.page, payload.perPage)
  }

  public async store({ bouncer, request, auth }: HttpContextContract) {
    await bouncer.with('ProfilePolicy').authorize('create')

    const user = auth.user!
    const payload = await request.validate(ProfilesStoreValidator)

    const profile = await Profile.create({
      userId: user.id,
      ...payload,
    })

    return {
      data: profile,
    }
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfilePolicy').authorize('view', profile)

    return { data: profile }
  }

  @bind()
  public async update({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfilePolicy').authorize('update', profile)

    const payload = await request.validate(ProfilesUpdateValidator)

    const mergedProfile = profile.merge(payload)

    const savedProfile = await mergedProfile.save()

    return {
      data: savedProfile,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfilePolicy').authorize('delete', profile)

    await profile.delete()
  }
}
