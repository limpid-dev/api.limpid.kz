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

    profilesQuery.preload('user')

    profilesQuery.where('isPersonal', true)

    if (userId) {
      profilesQuery.where('userId', userId)
    }

    if (industry) {
      profilesQuery.whereIn('industry', industry)
    }

    if (search) {
      profilesQuery.andWhere((query) => {
        query.whereLike('displayName', `%${search}%`)
        query.orWhereLike('location', `%${search}%`)
        query.orWhereLike('displayName', `%${search}%`)
        query.orWhereLike('description', `%${search}%`)
        query.orWhereLike('location', `%${search}%`)
        query.orWhereLike('ownedIntellectualResources', `%${search}%`)
        query.orWhereLike('ownedMaterialResources', `%${search}%`)
        query.orWhereLike('performance', `%${search}%`)
      })
    }

    const profiles = await profilesQuery.paginate(page, perPage)

    const formattedOrganizations = await Promise.all(
      profiles.map(async (profile) => {
        const isAllowedToView = await bouncer.with('ProfilesPolicy').allows('view', profile)

        if (isAllowedToView) {
          return profile
        } else {
          return ProfilesPolicy.stripRestrictedViewFieldsFromProfile(profile)
        }
      })
    )

    profiles.queryString(request.qs())

    return {
      meta: profiles.getMeta(),
      data: formattedOrganizations,
    }
  }

  public async store({ request, auth }: HttpContextContract) {
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
      instagram_url: instagramUrl,
      whatsapp_url: whatsappUrl,
      website_url: websiteUrl,
      telegram_url: telegramUrl,
      two_gis_url: twoGisUrl,
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
      instagramUrl,
      whatsappUrl,
      websiteUrl,
      telegramUrl,
      twoGisUrl,
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
  public async show({ auth, bouncer }: HttpContextContract, profile: Profile) {
    const isAllowedToView = await bouncer.with('ProfilesPolicy').allows('view', profile)

    await profile.load('user')

    if (auth.user?.id !== profile.user.id) {
      profile.views += 1

      await profile.save()
    }

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
      instagram_url: instagramUrl,
      whatsapp_url: whatsappUrl,
      website_url: websiteUrl,
      telegram_url: telegramUrl,
      two_gis_url: twoGisUrl,
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
      instagramUrl,
      whatsappUrl,
      websiteUrl,
      telegramUrl,
      twoGisUrl,
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
  public async destroy({ bouncer }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfilesPolicy').authorize('delete', profile)

    await profile.delete()
  }
}
