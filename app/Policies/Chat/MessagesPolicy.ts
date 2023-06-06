import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Chat from 'App/Models/Chat'

export default class MessagesPolicy extends BasePolicy {
  public async viewList(user: User, chat: Chat) {
    return !!chat.related('members').query().where('userId', user.id)
  }
  public async create(user: User, chat: Chat) {
    return !!chat.related('members').query().where('userId', user.id)
  }
}
