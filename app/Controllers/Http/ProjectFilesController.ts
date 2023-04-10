import { bind } from '@adonisjs/route-model-binding'
import Drive from '@ioc:Adonis/Core/Drive'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import Project from 'App/Models/Project'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProjectFilesStoreValidator from 'App/Validators/ProjectFilesStoreValidator'

export default class ProjectFilesController {
  @bind()
  public async index({ request }: HttpContextContract, project: Project) {
    const payload = await request.validate(PaginationValidator)

    return await project.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectFilePolicy').authorize('create', project)

    const payload = await request.validate(ProjectFilesStoreValidator)

    const location = `./projects/${project.id}/files`
    const contentType = `${payload.file.extname}/${payload.file.subtype}`
    const visibility = 'public'
    const name = payload.file.clientName
    const size = payload.file.size
    const extname = payload.file.extname

    await payload.file.moveToDisk(location, {
      name,
      contentType,
      visibility,
      contentLength: size,
    })

    const file = await project.related('files').create({
      name,
      location,
      visibility,
      contentType,
      size,
      extname,
    })

    return { data: file }
  }

  public async destroy({ bouncer }: HttpContextContract, project: Project, file: File) {
    await bouncer.with('ProjectFilePolicy').authorize('delete', project, file)
    await Drive.delete(file.location)
    await file.delete()
  }
}
