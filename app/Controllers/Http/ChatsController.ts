import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import ChatMember from 'App/Models/ChatMember'
import IndexValidator from 'App/Validators/Chats/IndexValidator'
import StoreValidator from 'App/Validators/Chats/StoreValidator'

export default class ChatsController {
  public async index({ request, auth }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const chatsMemberships = await ChatMember.query()
      .where('userId', auth.user!.id)
      .preload('chat')
      .paginate(page, perPage)

    const chats = chatsMemberships.map((chatsMembership) => chatsMembership.chat)

    return {
      meta: chatsMemberships.getMeta(),
      data: chats,
    }
  }

  public async store({ request }: HttpContextContract) {
    const { user_ids: userIds, name } = await request.validate(StoreValidator)

    const chat = await Chat.create({
      name,
    })

    await chat.related('members').createMany(userIds.map((id) => ({ userId: id })))

    return {
      data: chat,
    }
  }

  @bind()
  public async show({}: HttpContextContract, chat: Chat) {
    return {
      data: chat,
    }
  }

  @bind()
  public async destroy({ auth }: HttpContextContract, chat: Chat) {
    const membership = await chat
      .related('members')
      .query()
      .where('userId', auth.user!.id)
      .firstOrFail()

    await membership.delete()
  }
}
