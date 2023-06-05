import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProfileMember from 'App/Models/ProfileMember'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class OrganizationMembershipsController {
  public async index({ request, auth }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return auth.user!.related('profileMemberships').query().paginate(page, perPage)
  }

  @bind()
  public async show({}: HttpContextContract, organizationMembership: ProfileMember) {
    return {
      data: organizationMembership,
    }
  }

  @bind()
  public async destroy({ response }: HttpContextContract, organizationMembership: ProfileMember) {
    await organizationMembership.delete()

    response.noContent()
  }
}
