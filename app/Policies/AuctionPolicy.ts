import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Auction from 'App/Models/Auction'
import { DateTime } from 'luxon'

export default class AuctionPolicy extends BasePolicy {
  public async update(user: User, auction: Auction) {
    await auction.load('profile')

    return user.id === auction.profile.userId && !auction.verifiedAt
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
