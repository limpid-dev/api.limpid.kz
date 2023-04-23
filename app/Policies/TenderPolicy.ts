import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Tender from 'App/Models/Tender'
import Profile from 'App/Models/Profile'

export default class TenderPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.id === profile.userId
  }

  public async delete(user: User, tender: Tender) {
    const profile = await user.related('profiles').query().where('id', tender.profileId).first()

    return !!profile && !tender.verifiedAt
  }
}
