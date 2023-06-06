import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import IndexValidator from 'App/Validators/Chats/Messages/IndexValidator'
import StoreValidator from 'App/Validators/Chats/Messages/StoreValidator'

export default class MessagesController {
  @bind()
  public async index({ bouncer, request }: HttpContextContract, chat: Chat) {
    await bouncer.with('ChatMessagesPolicy').authorize('viewList', chat)

    const { page, per_page: perPage } = await request.validate(IndexValidator)

    return chat.related('messages').query().paginate(page, perPage)
  }

  @bind()
  public async store({ bouncer, request, response }: HttpContextContract, chat: Chat) {
    await bouncer.with('ChatMessagesPolicy').authorize('create', chat)

    const { message } = await request.validate(StoreValidator)

    const chatMessage = await chat.related('messages').create({
      message,
    })

    response.created()

    return {
      data: chatMessage,
    }
  }
}
