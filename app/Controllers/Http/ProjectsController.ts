import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import ProjectsDestroyValidator from 'App/Validators/ProjectsDestroyValidator'
import ProjectsIndexValidator from 'App/Validators/ProjectsIndexValidator'
import ProjectsShowValidator from 'App/Validators/ProjectsShowValidator'
import ProjectsStoreValidator from 'App/Validators/ProjectsStoreValidator'
import ProjectsUpdateValidator from 'App/Validators/ProjectsUpdateValidator'

export default class ProjectsController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(ProjectsIndexValidator)

    return Project.query().paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(ProjectsStoreValidator)

    if (auth.user) {
      const profile = await auth.user
        .related('profiles')
        .query()
        .where('id', payload.profileId)
        .first()

      if (profile) {
        const project = await profile.related('projects').create(payload)

        return project
      }

      return response.forbidden({
        errors: [
          {
            message: 'You are not authorized to perform this action',
          },
        ],
      })
    }
  }

  public async show({ request }: HttpContextContract) {
    const payload = await request.validate(ProjectsShowValidator)

    return Project.findOrFail(payload.params.projectId)
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(ProjectsUpdateValidator)

    const project = await Project.findOrFail(payload.params.projectId)

    if (auth.user) {
      const profile = await auth.user
        .related('profiles')
        .query()
        .where('id', project.profileId)
        .first()

      if (profile) {
        project.merge(payload)
        return await project.save()
      }

      return response.forbidden({
        errors: [
          {
            message: 'You are not authorized to perform this action',
          },
        ],
      })
    }
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(ProjectsDestroyValidator)

    const project = await Project.findOrFail(payload.params.projectId)

    if (auth.user) {
      const profile = await auth.user
        .related('profiles')
        .query()
        .where('id', project.profileId)
        .first()

      if (profile) {
        return await project.delete()
      }

      return response.forbidden({
        errors: [
          {
            message: 'You are not authorized to perform this action',
          },
        ],
      })
    }
  }
}
