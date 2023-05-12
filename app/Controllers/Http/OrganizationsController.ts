import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organization from 'App/Models/Organization'
import OrganizationStoreValidator from 'App/Validators/OrganizationStoreValidator'
import OrganizationUpdateValidator from 'App/Validators/OrganizationUpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class OrganizationsController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(PaginationValidator)

    return Organization.query().paginate(payload.page, payload.perPage)
  }

  public async store({ auth, request }: HttpContextContract) {
    const user = auth.user!
    const payload = await request.validate(OrganizationStoreValidator)

    const organization = await Organization.create(payload)

    await organization.related('memberships').create({
      userId: user.id,
      type: 'owner',
    })

    return {
      data: organization,
    }
  }

  @bind()
  public async show({}: HttpContextContract, organization: Organization) {
    return {
      data: organization,
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, organization: Organization) {
    await bouncer.with('OrganizationPolicy').authorize('update', organization)

    const payload = await request.validate(OrganizationUpdateValidator)

    organization.merge(payload)

    await organization.save()

    return {
      data: organization,
    }
  }

  @bind()
  public async delete({ bouncer }: HttpContextContract, organization: Organization) {
    await bouncer.with('OrganizationPolicy').authorize('delete', organization)

    await organization.delete()
  }
}
