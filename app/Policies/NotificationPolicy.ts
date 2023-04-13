import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Notification from 'App/Models/Notification'

export default class NotificationPolicy extends BasePolicy {
  public async update(user: User, notification: Notification) {
    return user.id === notification.userId
  }
}
