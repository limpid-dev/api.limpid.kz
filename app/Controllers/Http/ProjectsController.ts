import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileActionValidator from 'App/Validators/ProfileActionValidator'
import ProjectsStoreValidator from 'App/Validators/ProjectsStoreValidator'
import ProjectsUpdateValidator from 'App/Validators/ProjectsUpdateValidator'

export default class ProjectsController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(PaginationValidator)

    return await Project.query().paginate(payload.page, payload.perPage)
  }

  public async store({ bouncer, request }: HttpContextContract) {
    const payload = await request.validate(ProjectsStoreValidator)
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('ProjectPolicy').authorize('create', profile)

    const project = await profile.related('projects').create(payload)

    return { data: project }
  }

  @bind()
  public async show({}: HttpContextContract, project: Project) {
    return { data: project }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(ProjectsUpdateValidator)
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('ProjectPolicy').authorize('update', profile, project)

    await project.merge(payload).save()

    return { data: project }
  }

  @bind()
  public async destroy({ request, bouncer }: HttpContextContract, project: Project) {
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('ProjectPolicy').authorize('delete', profile, project)

    await project.delete()
  }
}
