import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import ProjectFile from 'App/Models/ProjectFile'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProjectFilesStoreValidator from 'App/Validators/ProjectFilesStoreValidator'

export default class ProjectFilesController {
  @bind()
  public async index({ request, bouncer }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectFilePolicy').authorize('viewList')

    const payload = await request.validate(PaginationValidator)

    return project.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, _: Project, projectFile: ProjectFile) {
    await bouncer.with('ProjectFilePolicy').authorize('view')

    const file = await projectFile.related('file').query().firstOrFail()

    return { data: file }
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(ProjectFilesStoreValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('ProjectFilePolicy').authorize('create', profile, project)

    const file = await File.upload(profile, payload.file, 'public')

    await ProjectFile.create({
      fileId: file.id,
      projectId: project.id,
    })

    return { data: file }
  }

  @bind()
  public async destroy({}: HttpContextContract) {}
}
