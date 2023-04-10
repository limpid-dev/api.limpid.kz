import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import File from 'App/Models/File'
import Profile from 'App/Models/Profile'
import Certificate from 'App/Models/Certificate'

export default class CertificateFilePolicy extends BasePolicy {
  public async create(user: User, profile: Profile, certificate: Certificate) {
    return user.id === profile.userId && certificate.profileId === profile.id
  }
  public async delete(user: User, profile: Profile, certificate: Certificate, file: File) {
    return (
      user.id === profile.userId &&
      certificate.profileId === profile.id &&
      certificate.id === file.certificateId
    )
  }
}
