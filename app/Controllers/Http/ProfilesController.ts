import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import ProfilesPolicy from 'App/Policies/ProfilesPolicy'
import IndexValidator from 'App/Validators/Profiles/IndexValidator'
import StoreValidator from 'App/Validators/Profiles/StoreValidator'
import UpdateValidator from 'App/Validators/Profiles/UpdateValidator'
import { bind } from '@adonisjs/route-model-binding'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class ProfilesController {
  public async index({ request, bouncer }: HttpContextContract) {
    const {
      page,
      per_page: perPage,
      user_id: userId,
      industry,
      search,
    } = await request.validate(IndexValidator)

    const profilesQuery = Profile.query()

    profilesQuery.where('isPersonal', true)
    profilesQuery.where('isVisible', true)

    if (userId) {
      profilesQuery.where('userId', userId)
    }

    if (industry) {
      profilesQuery.whereIn('industry', industry)
    }

    if (search) {
      profilesQuery.andWhere((query) => {
        query.whereLike('displayName', `%${search}%`)
        query.orWhereILike('location', `%${search}%`)
        query.orWhereILike('displayName', `%${search}%`)
        query.orWhereILike('description', `%${search}%`)
        query.orWhereILike('location', `%${search}%`)
        query.orWhereILike('ownedIntellectualResources', `%${search}%`)
        query.orWhereILike('ownedMaterialResources', `%${search}%`)
        query.orWhereILike('performance', `%${search}%`)
      })
    }

    const profiles = await profilesQuery.paginate(page, perPage)

    const formattedOrganizations = await Promise.all(
      profiles.map(async (profile) => {
        const isAllowedToView = await bouncer.with('ProfilesPolicy').allows('view', profile)

        if (isAllowedToView) {
          return {
            organization: profile,
          }
        } else {
          return ProfilesPolicy.stripRestrictedViewFieldsFromProfile(profile)
        }
      })
    )

    return {
      meta: profiles.getMeta(),
      data: formattedOrganizations,
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const {
      display_name: displayName,
      description,
      location,
      industry,
      owned_intellectual_resources: ownedIntellectualResources,
      owned_material_resources: ownedMaterialResources,
      tin,
      is_visible: isVisible,
      avatar,
    } = await request.validate(StoreValidator)

    const profile = new Profile()

    profile.merge({
      displayName,
      description,
      location,
      industry,
      ownedIntellectualResources,
      ownedMaterialResources,
      tin,
      isVisible,
      isPersonal: true,
      userId: auth.user!.id,
    })

    if (avatar) {
      profile.merge({
        avatar: Attachment.fromFile(avatar),
      })
    }

    await profile.save()

    response.status(201)

    return {
      data: profile,
    }
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, profile: Profile) {
    const isAllowedToView = await bouncer.with('ProfilesPolicy').allows('view', profile)

    if (isAllowedToView) {
      return {
        data: profile,
      }
    } else {
      return { data: ProfilesPolicy.stripRestrictedViewFieldsFromProfile(profile) }
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfilesPolicy').authorize('update', profile)

    const {
      display_name: displayName,
      description,
      location,
      industry,
      owned_intellectual_resources: ownedIntellectualResources,
      owned_material_resources: ownedMaterialResources,
      tin,
      is_visible: isVisible,
      avatar,
    } = await request.validate(UpdateValidator)

    profile.merge({
      displayName,
      description,
      location,
      industry,
      ownedIntellectualResources,
      ownedMaterialResources,
      tin,
      isVisible,
    })

    if (avatar) {
      profile.merge({
        avatar: Attachment.fromFile(avatar),
      })
    }

    await profile.save()

    return {
      data: profile,
    }
  }

  @bind()
  public async destroy({ bouncer, response }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfilesPolicy').authorize('delete', profile)

    await profile.delete()

    response.status(204)
  }
}
