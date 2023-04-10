import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileActionValidator from 'App/Validators/ProfileActionValidator'
import ProjectFilesStoreValidator from 'App/Validators/ProjectFilesStoreValidator'

export default class ProjectFilesController {
  @bind()
  public async index({ request }: HttpContextContract, project: Project) {
    const payload = await request.validate(PaginationValidator)

    return await project.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('ProjectFilePolicy').authorize('create', profile, project)

    const payload = await request.validate(ProjectFilesStoreValidator)

    const file = await File.from(payload.file)
      .merge({
        projectId: project.id,
      })
      .save()

    return { data: file }
  }

  public async destroy({ request, bouncer }: HttpContextContract, project: Project, file: File) {
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('ProjectFilePolicy').authorize('delete', profile, project, file)

    await file.delete()
  }
}
