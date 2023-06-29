import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Tender from 'App/Models/Tender'
import { DateTime } from 'luxon'

export default class TenderPolicy extends BasePolicy {
  public async create(user: User) {
    if (!user.selectedProfileId) {
      return Bouncer.deny('Profile required', 422)
    }
    const now = DateTime.now()
    if ((now >= user.paymentStart && now <= user.paymentEnd) || user.paymentEnd === null) {
      if (user.auctionsAttempts > 0) {
        return true
      }
      return Bouncer.deny('Number of attempts has ended', 402)
    }
    return Bouncer.deny('Tariff has expired', 402)
  }

  public async update(user: User, tender: Tender) {
    await tender.load('profile')

    return user.id === tender.profile.userId && !tender.verifiedAt
  }

  public async updateWinner(user: User, tender: Tender) {
    await tender.load('profile')

    if (tender.finishedAt) {
      return user.id === tender.profile.userId && DateTime.now() > tender.finishedAt
    }

    return false
  }

  public async delete(user: User, tender: Tender) {
    await tender.load('profile')

    return user.id === tender.profile.userId && !tender.verifiedAt
  }
}
