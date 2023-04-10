import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Experience from 'App/Models/Experience'

export default class ExperiencePolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(user: User, profile: Profile, experience: Experience) {
    return user.id === profile.userId && experience.profileId === profile.id
  }
  public async delete(user: User, profile: Profile, experience: Experience) {
    return user.id === profile.userId && experience.profileId === profile.id
  }
}
