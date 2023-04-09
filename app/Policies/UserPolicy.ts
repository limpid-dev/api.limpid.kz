import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
  public async update(user: User, anotherUser: User) {
    return user.id === anotherUser.id
  }
}
