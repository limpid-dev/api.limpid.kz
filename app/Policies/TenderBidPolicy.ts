import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
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

  public async view(user: User, tender: Tender, tenderBid: TenderBid) {
    await tenderBid.load('profile')

    if (user.id === tenderBid.profile.userId) {
      return true
    }

    if (tender.id !== tenderBid.tenderId) {
      return false
    }

    if (tender.finishedAt) {
      if (DateTime.now() > tender.finishedAt) {
        return true
      }
    }

    return false
  }

  public async create(user: User, tender: Tender) {
    if (!user.selectedProfileId) {
      return Bouncer.deny('Profile required', 422)
    }
    const now = DateTime.now()
    if ((now >= user.paymentStart && now <= user.paymentEnd) || user.paymentEnd === null) {
      if (user.auctionsAttempts > 0) {
        await tender.load('profile')

        return !!tender.verifiedAt && user.id !== tender.profile.userId
      }
      return Bouncer.deny('Number of attempts has ended', 402)
    }
    return Bouncer.deny('Tariff has expired', 402)
  }

  public async update(user: User, tender: Tender, tenderBid: TenderBid) {
    if (tender.id !== tenderBid.tenderId) {
      return false
    }

    if (tender.finishedAt) {
      if (DateTime.now() < tender.finishedAt) {
        await tenderBid.load('profile')

        return user.id === tenderBid.profile.userId
      }
    }

    return false
  }
}
