import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import ChatMember from 'App/Models/ChatMember'
import StoreValidator from 'App/Validators/Chats/StoreValidator'

export default class ChatsController {
  public async index({ auth }: HttpContextContract) {
    const userChats = await auth.user!.related('chats').query()
    const chatsIds = await ChatMember.query().where('userId', auth.user!.id).preload('chat')

    const memberChats = chatsIds.map((chatMember) => chatMember.chat)

    return {
      data: [...userChats, ...memberChats],
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const { user_ids: userIds } = await request.validate(StoreValidator)

    const chat = await Chat.create({ userId: auth.user!.id })

    await chat.related('members').createMany(userIds.map((id) => ({ userId: id })))

    response.created()

    return {
      data: chat,
    }
  }

  @bind()
  public async destroy({ response, bouncer }: HttpContextContract, chat: Chat) {
    await bouncer.with('ChatPolicy').allows('delete', chat)

    await chat.delete()

    response.noContent()
  }
}
