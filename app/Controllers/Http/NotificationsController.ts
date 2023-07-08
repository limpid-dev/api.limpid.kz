import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from 'App/Models/Notification'
import PaginationValidator from 'App/Validators/PaginationValidator'
import { DateTime } from 'luxon'

export default class NotificationsController {
  public async index({ request, auth }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return auth.user?.related('notifications').query().whereNull('readAt').paginate(page, perPage)
  }

  @bind()
  public async show({}: HttpContextContract, notification: Notification) {
    return {
      data: notification,
    }
  }

  @bind()
  public async read({}: HttpContextContract, notification: Notification) {
    notification.merge({
      readAt: DateTime.now(),
    })

    await notification.save()

    return {
      data: notification,
    }
  }
}
