import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import MessagesStoreValidator from 'App/Validators/MessagesStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileOrganizationActionValidator from 'App/Validators/ProfileOrganizationActionValidator'

export default class MessagesController {
  @bind()
  public async index({ request, bouncer }: HttpContextContract, project: Project) {
    await bouncer.with('MessagePolicy').authorize('viewList', project)

    const payload = await request.validate(PaginationValidator)

    return project.related('messages').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const { profileId } = await request.validate(ProfileOrganizationActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('MessagePolicy').authorize('create', profile, project)

    const payload = await request.validate(MessagesStoreValidator)

    const message = await project.related('messages').create(payload)

    return {
      data: message,
    }
  }
}
