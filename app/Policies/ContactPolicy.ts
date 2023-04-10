import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Contact from 'App/Models/Contact'

export default class ContactPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(user: User, profile: Profile, contact: Contact) {
    return user.id === profile.userId && contact.profileId === profile.id
  }
  public async delete(user: User, profile: Profile, contact: Contact) {
    return user.id === profile.userId && contact.profileId === profile.id
  }
}
