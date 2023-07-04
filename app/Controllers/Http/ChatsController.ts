import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import ChatMember from 'App/Models/ChatMember'
import StoreValidator from 'App/Validators/Chats/StoreValidator'

const eqSet = (xs, ys) => xs.size === ys.size && [...xs].every((x) => ys.has(x))

export default class ChatsController {
  public async index({ auth }: HttpContextContract) {
    const chatsMemberships = await ChatMember.query()
      .where('userId', auth.user!.id)
      .preload('chat', (q) => {
        q.preload('messages')
      })

    const chats = chatsMemberships.map((c) => c.toJSON().chat)

    return {
      data: chats,
    }
  }

  public async store({ request }: HttpContextContract) {
    const { user_ids: userIds, name } = await request.validate(StoreValidator)

    const set = new Set(userIds)

    const allChats = await Chat.query().preload('members').whereNull('projectId').exec()

    const maybeChat = allChats.find((chat) => {
      const s = new Set(chat.members.map((a) => a.userId))

      return eqSet(set, s)
    })

    if (maybeChat) {
      return {
        data: maybeChat,
      }
    }

    const chat = await Chat.create({
      name,
    })

    await chat.related('members').createMany(Array.from(set).map((id) => ({ userId: id })))

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
