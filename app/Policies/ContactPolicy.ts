import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Contact from 'App/Models/Contact'

export default class ContactPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    const exists = await user.related('profiles').query().where('id', profile.id).first()

    return !!exists
  }
  public async update(user: User, _profile: Profile, contact: Contact) {
    const exists = await user.related('contacts').query().where('id', contact.id).first()

    return !!exists
  }
  public async delete(user: User, _profile: Profile, contact: Contact) {
    const exists = await user.related('contacts').query().where('id', contact.id).first()

    return !!exists
  }
}
