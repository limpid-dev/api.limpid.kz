import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Certificate from 'App/Models/Certificate'
import Profile from 'App/Models/Profile'

export default class CertificatePolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    const exists = await user.related('profiles').query().where('id', profile.id).first()

    return !!exists
  }
  public async update(user: User, certificate: Certificate) {
    const exists = await user.related('certificates').query().where('id', certificate.id).first()

    return !!exists
  }
  public async delete(user: User, certificate: Certificate) {
    const exists = await user.related('certificates').query().where('id', certificate.id).first()

    return !!exists
  }
}
