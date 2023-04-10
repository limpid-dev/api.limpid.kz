import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
  public async update(currentUser: User, user: User) {
    return currentUser.id === user.id
  }
}
