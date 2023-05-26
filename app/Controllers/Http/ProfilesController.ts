import { bind } from '@adonisjs/route-model-binding'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import IndexValidator from 'App/Validators/Profiles/IndexValidator'
import StoreValidator from 'App/Validators/Profiles/StoreValidator'
import UpdateOrganizationValidator from 'App/Validators/Profiles/UpdateOrganizationValidator'
import UpdatePersonalValidator from 'App/Validators/Profiles/UpdatePersonalValidator'

export default class ProfilesController {
  public async index({ request, bouncer }: HttpContextContract) {
    const {
      page,
      per_page: perPage,
      user_id: userId,
      industry,
      is_personal: isPersonal,
      search,
    } = await request.validate(IndexValidator)

    const profilesQuery = Profile.query()

    profilesQuery.where('isVisible', true)

    profilesQuery.if(userId, (query) => {
      query.andWhere('userId', userId!)
    })

    profilesQuery.if(industry, (query) => {
      query.andWhereIn('industry', industry!)
    })

    profilesQuery.if(isPersonal, (query) => {
      query.andWhere('isPersonal', isPersonal!)
    })

    profilesQuery.if(search, (query) => {
      query.andWhere((query) => {
        query.where('displayName', 'ilike', `%${search}%`)
        query.orWhere('location', 'ilike', `%${search}%`)
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
          return {
            id: profile.id,
            is_visible: profile.isVisible,
            display_name: profile.displayName,
          }
        }
      })
    )

    return {
      meta: profiles.getMeta(),
      data: allowedToViewProfiles,
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
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
      avatar,
    } = await request.validate(StoreValidator)

    const avatarAttachment = avatar ? Attachment.fromFile(avatar) : null

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
      avatar: avatarAttachment,
    })

    response.status(201)

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
          display_name: profile.displayName,
        },
      }
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfilePolicy').authorize('update', profile)
    if (profile.isPersonal) {
      const {
        display_name: displayName,
        description,
        location,
        industry,
        owned_intellectual_resources: ownedIntellectualResources,
        owned_material_resources: ownedMaterialResources,
        is_visible: isVisible,
        avatar,
      } = await request.validate(UpdatePersonalValidator)

      profile.merge({
        displayName,
        description,
        location,
        industry,
        ownedIntellectualResources,
        ownedMaterialResources,
        isVisible,
      })

      if (avatar) {
        profile.merge({
          avatar: Attachment.fromFile(avatar),
        })
      }
    } else {
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
        avatar,
      } = await request.validate(UpdateOrganizationValidator)

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

      if (avatar) {
        profile.merge({
          avatar: Attachment.fromFile(avatar),
        })
      }
    }

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
