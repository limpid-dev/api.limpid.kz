import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import ProjectMember from 'App/Models/ProjectMember'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class ProjectMembershipsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return profile.related('projectMemberships').query().paginate(page, perPage)
  }

  @bind()
  public async show({}: HttpContextContract, _profile: Profile, projectMembership: ProjectMember) {
    return {
      data: projectMembership,
    }
  }

  @bind()
  public async destroy(
    {}: HttpContextContract,
    _profile: Profile,
    projectMembership: ProjectMember
  ) {
    await projectMembership.delete()
  }
}
