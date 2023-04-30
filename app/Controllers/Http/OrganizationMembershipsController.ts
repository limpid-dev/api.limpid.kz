import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organization from 'App/Models/Organization'
import OrganizationMembership from 'App/Models/OrganizationMembership'
import OrganizationMembershipStoreValidator from 'App/Validators/OrganizationMembershipStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class OrganizationMembershipsController {
  @bind()
  public async index({ request }: HttpContextContract, organization: Organization) {
    const payload = await request.validate(PaginationValidator)

    return organization.related('memberships').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, organization: Organization) {
    await bouncer.with('OrganizationMembershipPolicy').authorize('create', organization)

    const payload = await request.validate(OrganizationMembershipStoreValidator)

    const membership = await organization.related('memberships').create({
      userId: payload.userId,
      type: 'member',
    })

    return {
      data: membership,
    }
  }

  @bind()
  public async destroy(
    { bouncer }: HttpContextContract,
    organization: Organization,
    membership: OrganizationMembership
  ) {
    await bouncer.with('OrganizationMembershipPolicy').authorize('delete', organization, membership)
    await membership.delete()
  }
}
