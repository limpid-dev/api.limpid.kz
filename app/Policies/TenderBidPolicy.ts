import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import TenderBid from 'App/Models/TenderBid'
import Tender from 'App/Models/Tender'
import { DateTime } from 'luxon'

export default class TenderBidPolicy extends BasePolicy {
  public static stripRestrictedViewFieldsFromTenderBid = (tenderBid: TenderBid) => ({
    id: tenderBid.id,
    tenderId: tenderBid.tenderId,
    price: tenderBid.price,
    createdAt: tenderBid.createdAt,
    updatedAt: tenderBid.updatedAt,
  })

  public async view(user: User, tenderBid: TenderBid) {
    await tenderBid.load('profile')

    if (user.id === tenderBid.profile.userId) {
      return true
    }

    await tenderBid.load('tender')

    if (tenderBid.tender.finishedAt) {
      if (DateTime.now() > tenderBid.tender.finishedAt) {
        return true
      }
    }

    return false
  }

  public async create(user: User, tender: Tender) {
    await tender.load('profile')

    return !!tender.verifiedAt && user.id !== tender.profile.userId
  }

  public async update(user: User, tenderBid: TenderBid) {
    await tenderBid.load('tender')

    if (tenderBid.tender.finishedAt) {
      if (DateTime.now() < tenderBid.tender.finishedAt) {
        await tenderBid.load('profile')

        return user.id === tenderBid.profile.userId
      }
    }

    return false
  }
}
