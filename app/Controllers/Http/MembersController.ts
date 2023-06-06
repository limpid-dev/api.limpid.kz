import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class MembersController {
  @bind()
  public async index({ request }: HttpContextContract, chat: Chat) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return chat.related('members').query().paginate(page, perPage)
  }
}
