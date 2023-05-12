import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organization from 'App/Models/Organization'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileOrganizationActionValidator from 'App/Validators/ProfileOrganizationActionValidator'
import ProjectsStoreValidator from 'App/Validators/ProjectsStoreValidator'
import ProjectsUpdateValidator from 'App/Validators/ProjectsUpdateValidator'
import { DateTime } from 'luxon'

export default class ProjectsController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(PaginationValidator)

    return await Project.query().paginate(payload.page, payload.perPage)
  }

  public async store({ bouncer, request }: HttpContextContract) {
    const payload = await request.validate(ProjectsStoreValidator)
    const { profileId, organizationId } = await request.validate(ProfileOrganizationActionValidator)

    if (profileId) {
      const profile = await Profile.findOrFail(profileId)

      await bouncer.with('ProjectPolicy').authorize('create', profile)
      const project = await Project.create(payload)

      await project.related('projectMemberships').create({
        profileId: profile.id,
        type: 'owner',
        acceptedAt: DateTime.now(),
      })

      return { data: project }
    }
    if (organizationId) {
      const organization = await Organization.findOrFail(organizationId)

      await bouncer.with('ProjectPolicy').authorize('create', organization)
      const project = await Project.create(payload)

      await project.related('projectMemberships').create({
        organizationId: organization.id,
        type: 'owner',
        acceptedAt: DateTime.now(),
      })

      return { data: project }
    }
  }

  @bind()
  public async show({}: HttpContextContract, project: Project) {
    return { data: project }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(ProjectsUpdateValidator)

    await bouncer.with('ProjectPolicy').authorize('update', project)

    await project.merge(payload).save()

    return { data: project }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectPolicy').authorize('delete', project)

    await project.delete()
  }
}
