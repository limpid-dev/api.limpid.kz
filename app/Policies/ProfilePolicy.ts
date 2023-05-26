import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import { action } from '@ioc:Adonis/Addons/Bouncer'

export default class ProfilePolicy extends BasePolicy {
  @action({allowGuest:true})
  public async view(user: User|null, profile: Profile) {
    if (profile.isVisible) {
      return true
    } 
        return !!user && user.id === profile.userId
  }
  public async update(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async delete(user: User, profile: Profile) {
    return user.id === profile.userId && !profile.isPersonal
  }
}
