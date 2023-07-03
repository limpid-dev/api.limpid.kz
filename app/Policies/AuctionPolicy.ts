import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Auction from 'App/Models/Auction'
import { DateTime } from 'luxon'

export default class AuctionPolicy extends BasePolicy {
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

  public async update(user: User, auction: Auction) {
    if (!auction.finishedAt) {
      await auction.load('profile')

      return user.id === auction.profile.userId && !auction.verifiedAt
    }
  }

  public async updateWinner(user: User, auction: Auction) {
    await auction.load('profile')

    if (auction.finishedAt) {
      return user.id === auction.profile.userId && DateTime.now() > auction.finishedAt
    }

    return false
  }

  public async delete(user: User, auction: Auction) {
    await auction.load('profile')

    return user.id === auction.profile.userId && !auction.verifiedAt
  }
}
