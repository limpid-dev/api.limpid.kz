import { bind } from '@adonisjs/route-model-binding'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import ProfilePolicy from 'App/Policies/ProfilePolicy'
import IndexValidator from 'App/Validators/Profiles/IndexValidator'
import UpdateValidator from 'App/Validators/Profiles/UpdateValidator'

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

    profilesQuery.where('isVisible', true)
    profilesQuery.where('isPersonal', true)

    profilesQuery.if(userId, (query) => {
      query.andWhere('userId', userId!)
    })

    profilesQuery.if(industry, (query) => {
      query.andWhereIn('industry', industry!)
    })

    profilesQuery.if(search, (query) => {
      query.andWhere((query) => {
        query.whereLike('displayName', `%${search}%`)
        query.orWhereILike('location', `%${search}%`)
      })
    })

    const profiles = await profilesQuery.paginate(page, perPage)

    const allowedToViewProfiles = await Promise.all(
      profiles.map(async (profile) => {
        const isAllowedToView = await bouncer.with('ProfilePolicy').allows('view', profile)

        if (isAllowedToView) {
          return {
            profile,
          }
        } else {
          return ProfilePolicy.stripRestrictedViewFieldsFromProfile(profile)
        }
      })
    )

    return {
      meta: profiles.getMeta(),
      data: allowedToViewProfiles,
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
      return { data: ProfilePolicy.stripRestrictedViewFieldsFromProfile(profile) }
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
}
