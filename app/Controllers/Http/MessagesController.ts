import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import MessagesIndexValidator from 'App/Validators/MessagesIndexValidator'
import MessagesStoreValidator from 'App/Validators/MessagesStoreValidator'

export default class MessagesController {
  @bind()
  public async index({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(MessagesIndexValidator)

    await bouncer.with('MessagePolicy').authorize('viewList', project)

    const message = project.related('messages').query().paginate(payload.page, payload.perPage)

    return {
      data: message,
    }
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, project: Project) {
    const payload = await request.validate(MessagesStoreValidator)

    await bouncer.with('MessagePolicy').authorize('create', project)

    const message = await project.related('messages').create(payload)

    return {
      data: message,
    }
  }
}
