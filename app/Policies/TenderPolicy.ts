import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Tender from 'App/Models/Tender'

export default class TenderPolicy extends BasePolicy {
  public async update(user: User, tender: Tender) {
    await tender.load('profile')

    return user.id === tender.profile.userId && !tender.verifiedAt
  }
  public async delete(user: User, tender: Tender) {
    await tender.load('profile')

    return user.id === tender.profile.userId && !tender.verifiedAt
  }
}
