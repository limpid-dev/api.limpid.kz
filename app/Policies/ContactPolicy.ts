import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class ContactPolicy extends BasePolicy {
  public async viewList(user: User, profile: Profile) {
    if (user.id === profile.userId) {
      return true
    }

    return !!user.verifiedAt && !!profile.verifiedAt
  }
  public async view(user: User, profile: Profile) {
    if (user.id === profile.userId) {
      return true
    }

    return !!user.verifiedAt && !!profile.verifiedAt
  }
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async delete(user: User, profile: Profile) {
    return user.id === profile.userId
  }
}
