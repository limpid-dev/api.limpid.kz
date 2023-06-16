import Bouncer, {  BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Auction from 'App/Models/Auction'
import { DateTime } from 'luxon'

export default class AuctionPolicy extends BasePolicy {
  public async create(user: User) {
    const now = DateTime.now()
    if (now >= user.payment_start && now <= user.payment_end || user.payment_end === null)
    {
      if (user.auctions_attempts > 0) 
      {
      return true
      }
    return Bouncer.deny('Number of attempts has ended', 403)
    }
    return Bouncer.deny('Tariff has expired', 403)
  }

  public async update(user: User, auction: Auction) {
    if (!auction.finishedAt)
    {
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
