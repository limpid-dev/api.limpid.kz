import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Profile from 'App/Models/Profile'
import IndexValidator from 'App/Validators/Organizations/IndexValidator'
import { bind } from '@adonisjs/route-model-binding'
import OrganizationsPolicy from 'App/Policies/OrganizationsPolicy'
import UpdateValidator from 'App/Validators/Organizations/UpdateValidator'
import StoreValidator from 'App/Validators/Organizations/StoreValidator'

export default class OrganizationsController {
  public async index({ request, bouncer }: HttpContextContract) {
    const {
      page,
      per_page: perPage,
      user_id: userId,
      industry,
      search,
    } = await request.validate(IndexValidator)

    const organizationsQuery = Profile.query()

    organizationsQuery.where('isPersonal', false)
    organizationsQuery.where('isVisible', true)

    if (userId) {
      organizationsQuery.where('userId', userId)
    }

    if (industry) {
      organizationsQuery.whereIn('industry', industry)
    }

    if (search) {
      organizationsQuery.andWhere((query) => {
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

    const organizations = await organizationsQuery.paginate(page, perPage)

    const formattedOrganizations = await Promise.all(
      organizations.map(async (organization) => {
        const isAllowedToView = await bouncer
          .with('OrganizationsPolicy')
          .allows('view', organization)

        if (isAllowedToView) {
          return {
            organization,
          }
        } else {
          return OrganizationsPolicy.stripRestrictedViewFieldsFromOrganization(organization)
        }
      })
    )

    organizations.queryString(request.qs())

    return {
      meta: organizations.getMeta(),
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
      performance,
      legal_structure: legalStructure,
      is_visible: isVisible,
      avatar,
    } = await request.validate(StoreValidator)

    const organization = new Profile()

    organization.merge({
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
      isPersonal: false,
      userId: auth.user!.id,
    })

    if (avatar) {
      organization.merge({
        avatar: Attachment.fromFile(avatar),
      })
    }

    await organization.save()

    response.status(201)

    return {
      data: organization,
    }
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, organization: Profile) {
    const isAllowedToView = await bouncer.with('OrganizationsPolicy').allows('view', organization)

    if (isAllowedToView) {
      return {
        data: organization,
      }
    } else {
      return { data: OrganizationsPolicy.stripRestrictedViewFieldsFromOrganization(organization) }
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, organization: Profile) {
    await bouncer.with('OrganizationsPolicy').authorize('update', organization)

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

  @bind()
  public async destroy({ bouncer, response }: HttpContextContract, organization: Profile) {
    await bouncer.with('OrganizationsPolicy').authorize('delete', organization)

    await organization.delete()

    response.status(204)
  }
}
