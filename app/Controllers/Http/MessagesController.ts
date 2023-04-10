import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Project from 'App/Models/Project'
import MessagesStoreValidator from 'App/Validators/MessagesStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileActionValidator from 'App/Validators/ProfileActionValidator'

export default class MessagesController {
  @bind()
  public async index({ request, bouncer }: HttpContextContract, project: Project) {
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('MessagePolicy').authorize('viewList', profile, project)

    const payload = await request.validate(PaginationValidator)

    const message = project.related('messages').query().paginate(payload.page, payload.perPage)

    return {
      data: message,
    }
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('MessagePolicy').authorize('create', profile, project)

    const payload = await request.validate(MessagesStoreValidator)

    const message = await project.related('messages').create(payload)

    return {
      data: message,
    }
  }
}
