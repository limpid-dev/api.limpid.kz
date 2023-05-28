import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organization from 'App/Models/Organization'
import OrganizationPolicy from 'App/Policies/OrganizationPolicy'
import IndexValidator from 'App/Validators/Organizations/IndexValidator'
import StoreValidator from 'App/Validators/Organizations/StoreValidator'
import UpdateValidator from 'App/Validators/Organizations/UpdateValidator'

export default class OrganizationsController {
  public async index({ request, bouncer }: HttpContextContract) {
    const {
      page,
      per_page: perPage,
      user_id: userId,
      industry,
      search,
    } = await request.validate(IndexValidator)

    const organizationsQuery = Organization.query()

    organizationsQuery.where('isVisible', true)
    organizationsQuery.where('isPersonal', false)

    organizationsQuery.if(userId, (query) => {
      query.andWhere('userId', userId!)
    })

    organizationsQuery.if(industry, (query) => {
      query.andWhereIn('industry', industry!)
    })

    organizationsQuery.if(search, (query) => {
      query.andWhere((query) => {
        query.whereLike('displayName', `%${search}%`)
        query.orWhereILike('location', `%${search}%`)
      })
    })

    const profiles = await organizationsQuery.paginate(page, perPage)

    const allowedToViewOrganizations = await Promise.all(
      profiles.map(async (profile) => {
        const isAllowedToView = await bouncer.with('OrganizationPolicy').allows('view', profile)

        if (isAllowedToView) {
          return {
            profile,
          }
        } else {
          return OrganizationPolicy.stripRestrictedViewFieldsFromOrganization(profile)
        }
      })
    )

    return {
      meta: profiles.getMeta(),
      data: allowedToViewOrganizations,
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
      performance,
      legal_structure: legalStructure,
      is_visible: isVisible,
      avatar,
    } = await request.validate(StoreValidator)

    const avatarToSave = avatar ? Attachment.fromFile(avatar) : undefined

    const organization = await auth.user!.related('organizations').create({
      displayName,
      description,
      location,
      industry,
      ownedIntellectualResources,
      ownedMaterialResources,
      tin,
      performance,
      legalStructure,
      isVisible,
      avatar: avatarToSave,
      isPersonal: false,
    })

    response.status(201)

    return {
      data: organization,
    }
  }

  public async show({ bouncer }: HttpContextContract, organization: Organization) {
    const isAllowedToView = await bouncer.with('OrganizationPolicy').allows('view', organization)

    if (isAllowedToView) {
      return {
        data: organization,
      }
    } else {
      return { data: OrganizationPolicy.stripRestrictedViewFieldsFromOrganization(organization) }
    }
  }

  public async update({ request, bouncer }: HttpContextContract, organization: Organization) {
    await bouncer.with('OrganizationPolicy').authorize('update', organization)

    const {
      display_name: displayName,
      description,
      location,
      industry,
      owned_intellectual_resources: ownedIntellectualResources,
      owned_material_resources: ownedMaterialResources,
      tin,
      legal_structure: legalStructure,
      performance,
      is_visible: isVisible,
      avatar,
    } = await request.validate(UpdateValidator)

    organization.merge({
      displayName,
      description,
      location,
      industry,
      ownedIntellectualResources,
      ownedMaterialResources,
      tin,
      legalStructure,
      performance,
      isVisible,
    })

    if (avatar) {
      organization.merge({
        avatar: Attachment.fromFile(avatar),
      })
    }

    await organization.save()

    return {
      data: organization,
    }
  }

  public async destroy({ bouncer, response }: HttpContextContract, organization: Organization) {
    await bouncer.with('OrganizationPolicy').authorize('delete', organization)

    await organization.delete()

    response.status(204)
  }
}
