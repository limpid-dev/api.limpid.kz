import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProjectFilesStoreValidator from 'App/Validators/ProjectFilesStoreValidator'
import ProjectsDestroyValidator from 'App/Validators/ProjectsDestroyValidator'

export default class ProjectFilesController {
  @bind()
  public async index({ request }: HttpContextContract, project: Project) {
    const payload = await request.validate(PaginationValidator)

    return project.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async show({}: HttpContextContract, _: Project, file: File) {
    return { data: file }
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(ProjectFilesStoreValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('ProjectFilePolicy').authorize('create', profile, project)

    const location = `./${profile.id}/projects/${project.id}/files`

    await payload.file.moveToDisk(location, {
      name: payload.file.clientName,
      visibility: 'public',
    })

    const file = await File.create({
      location: `${location}/${payload.file.clientName}`,
      projectId: project.id,
      mimeType: `${payload.file.type}/${payload.file.subtype}`,
      name: payload.file.clientName,
      extname: payload.file.extname,
      visibility: 'public',
      size: payload.file.size,
    })

    return { data: file }
  }

  @bind()
  public async destroy({ request, bouncer }: HttpContextContract, project: Project, file: File) {
    const payload = await request.validate(ProjectsDestroyValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    await bouncer.with('ProjectFilePolicy').authorize('delete', profile, project, file)

    await file.delete()
  }
}
