import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Tender from 'App/Models/Tender'

export default class TenderPolicy extends BasePolicy {
  public async update(user: User, tender: Tender) {
    const userRelatedTender = await user.related('tenders').query().where('id', tender.id).first()

    if (userRelatedTender) {
      return !tender.verifiedAt
    }

    return false
  }
  public async delete(user: User, tender: Tender) {
    const userRelatedTender = await user.related('tenders').query().where('id', tender.id).first()

    if (userRelatedTender) {
      return !tender.verifiedAt
    }

    return false
  }
}
