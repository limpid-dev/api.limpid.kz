import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Chat from 'App/Models/Chat'

export default class ChatPolicy extends BasePolicy {
  public async delete(user: User, chat: Chat) {
    return user.id === chat.userId
  }
}
