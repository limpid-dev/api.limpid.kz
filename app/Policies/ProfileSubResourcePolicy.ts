import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Certificate from 'App/Models/Certificate'
import Profile from 'App/Models/Profile'
import Education from 'App/Models/Education'
import Contact from 'App/Models/Contact'
import Skill from 'App/Models/Skill'
import Experience from 'App/Models/Experience'

export default class ProfileSubResourcePolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(
    user: User,
    profile: Profile,
    subResource: Certificate | Education | Contact | Skill | Experience
  ) {
    return user.id === profile.userId && subResource.profileId === profile.id
  }
  public async delete(
    user: User,
    profile: Profile,
    subResource: Certificate | Education | Contact | Skill | Experience
  ) {
    return user.id === profile.userId && subResource.profileId === profile.id
  }
}
