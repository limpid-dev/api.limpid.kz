import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from 'App/Models/Notification'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class NotificationsController {
  public async index({ auth, request }: HttpContextContract) {
    const { page, perPage } = await request.validate(PaginationValidator)
    const user = auth.user!

    return await user.related('notifications').query().qs(request.qs()).paginate(page, perPage)
  }

  @bind()
  public async update({ bouncer }: HttpContextContract, notification: Notification) {
    await bouncer.with('NotificationPolicy').authorize('update', notification)

    await notification.read()
  }
}
