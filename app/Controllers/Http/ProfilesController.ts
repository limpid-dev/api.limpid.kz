import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import IndexValidator from 'App/Validators/Profiles/IndexValidator'
import StoreValidator from 'App/Validators/Profiles/StoreValidator'
import UpdateValidator from 'App/Validators/Profiles/UpdateValidator'

export default class ProfilesController {
  public async index({ request }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const profiles = await Profile.query().paginate(page, perPage)

    return profiles
  }

  public async store({ auth, request }: HttpContextContract) {
    const {
      display_name: displayName,
      description,
      location,
      industry,
      owned_intellectual_resources: ownedIntellectualResources,
      owned_material_resources: ownedMaterialResources,
      bin,
      perfomance,
      type,
      is_visible: isVisible,
    } = await request.validate(StoreValidator)

    const profile = await auth.user!.related('profiles').create({
      displayName,
      description,
      location,
      industry,
      ownedIntellectualResources,
      ownedMaterialResources,
      bin,
      perfomance,
      type,
      isVisible,
      isPersonal: false,
    })

    return {
      data: profile,
    }
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, profile: Profile) {
    const isAllowedToView = await bouncer.with('ProfilePolicy').allows('view', profile)

    if (isAllowedToView) {
      return {
        data: profile,
      }
    } else {
      return {
        data: {
          id: profile.id,
          is_visible: profile.isVisible,
        },
      }
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfilePolicy').authorize('update', profile)

    const {
      display_name: displayName,
      description,
      location,
      industry,
      owned_intellectual_resources: ownedIntellectualResources,
      owned_material_resources: ownedMaterialResources,
      bin,
      perfomance,
      type,
      is_visible: isVisible,
    } = await request.validate(UpdateValidator)

    profile.merge({
      displayName,
      description,
      location,
      industry,
      ownedIntellectualResources,
      ownedMaterialResources,
      bin,
      perfomance,
      type,
      isVisible,
    })

    await profile.save()

    return {
      data: profile,
    }
  }

  @bind()
  public async destroy({ bouncer, response }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfilePolicy').authorize('delete', profile)

    await profile.delete()

    response.status(204)
  }
}
