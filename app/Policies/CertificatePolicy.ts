import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Certificate from 'App/Models/Certificate'
import Profile from 'App/Models/Profile'

export default class CertificatePolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }
  public async update(user: User, profile: Profile, certificate: Certificate) {
    return user.id === profile.userId && certificate.profileId === profile.id
  }
  public async delete(user: User, profile: Profile, certificate: Certificate) {
    return user.id === profile.userId && certificate.profileId === profile.id
  }
}
