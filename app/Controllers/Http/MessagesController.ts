import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Membership from 'App/Models/Membership'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import MessagesIndexValidator from 'App/Validators/MessagesIndexValidator'
import MessagesStoreValidator from 'App/Validators/MessagesStoreValidator'

export default class MessagesController {
  @bind()
  public async index({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(MessagesIndexValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    const membership = await Membership.query()
      .where('profileId', profile.id)
      .andWhere('projectId', project.id)
      .firstOrFail()

    await bouncer.with('MessagePolicy').authorize('viewList', profile, project, membership)

    const message = project.related('messages').query().paginate(payload.page, payload.perPage)

    return {
      data: message,
    }
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(MessagesStoreValidator)

    const profile = await Profile.findOrFail(payload.profileId)

    const membership = await Membership.query()
      .where('profileId', profile.id)
      .andWhere('projectId', project.id)
      .firstOrFail()

    await bouncer.with('MessagePolicy').authorize('create', profile, project, membership)

    const message = await project.related('messages').create(payload)

    return {
      data: message,
    }
  }
}
