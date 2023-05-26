import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class ProfilePolicy extends BasePolicy {
  public async view(user: User, profile: Profile) {
    if (profile.isVisible) {
      return true
    } else {
      return user.id === profile.userId
    }
  }
  public async update(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async delete(user: User, profile: Profile) {
    return user.id === profile.userId && !profile.isPersonal
  }
}
