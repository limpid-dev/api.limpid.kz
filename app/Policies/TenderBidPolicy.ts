import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import TenderBid from 'App/Models/TenderBid'
import Tender from 'App/Models/Tender'
import { DateTime } from 'luxon'

export default class TenderBidPolicy extends BasePolicy {
  public async viewList(user: User, tender: Tender) {
    const userRelatedTender = await user.related('tenders').query().where('id', tender.id).first()

    if (userRelatedTender) {
      return true
    }

    return false
  }

  public async create(user: User, tender: Tender) {
    const userRelatedTender = await user.related('tenders').query().where('id', tender.id).first()

    if (userRelatedTender) {
      return false
    }

    return !!tender.verifiedAt
  }
  public async update(user: User, tender: Tender, tenderBid: TenderBid) {
    if (!tender.verifiedAt) {
      return false
    }

    if (DateTime.now() < tender.finishedAt!) {
      const userRelatedTenderBid = await user
        .related('tenderBids')
        .query()
        .where('id', tenderBid.id)
        .first()

      return !!userRelatedTenderBid
    }

    return false
  }
}
