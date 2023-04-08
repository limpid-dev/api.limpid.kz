import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Membership from 'App/Models/Membership'
import Project from 'App/Models/Project'
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
    const { profileId, ...payload } = await request.validate(ProjectsStoreValidator)

    if (auth.user) {
      const profile = await auth.user.related('profiles').query().where('id', profileId).first()

      if (profile) {
        const project = await Project.create(payload)

        await profile.related('memberships').create({
          projectId: project.id,
          type: 'ADMIN',
        })

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
    const { params, ...payload } = await request.validate(ProjectsUpdateValidator)

    const project = await Project.findOrFail(params.projectId)

    const membership = await Membership.query()
      .where('projectId', project.id)
      .preload('profile', (profileQuery) => {
        profileQuery.where('userId', auth.user?.id!)
      })
      .firstOrFail()

    if (membership.type === 'ADMIN') {
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

  public async destroy({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(ProjectsUpdateValidator)

    const project = await Project.findOrFail(payload.params.projectId)

    const membership = await Membership.query()
      .where('projectId', project.id)
      .preload('profile', (profileQuery) => {
        profileQuery.where('userId', auth.user?.id!)
      })
      .firstOrFail()

    if (membership.type === 'ADMIN') {
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
