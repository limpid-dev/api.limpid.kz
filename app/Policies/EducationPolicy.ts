import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Education from 'App/Models/Education'

export default class EducationPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(user: User, profile: Profile, education: Education) {
    return user.id === profile.userId && education.profileId === profile.id
  }
  public async delete(user: User, profile: Profile, education: Education) {
    return user.id === profile.userId && education.profileId === profile.id
  }
}
