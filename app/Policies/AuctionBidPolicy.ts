import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import AuctionBid from 'App/Models/AuctionBid'
import Auction from 'App/Models/Auction'
import { DateTime } from 'luxon'

export default class AuctionBidPolicy extends BasePolicy {
  public static stripRestrictedViewFieldsFromAuctionBid = (auctionBid: AuctionBid) => ({
    id: auctionBid.id,
    auctionId: auctionBid.auctionId,
    price: auctionBid.price,
    createdAt: auctionBid.createdAt,
    updatedAt: auctionBid.updatedAt,
  })

  public async view(user: User, auction: Auction, auctionBid: AuctionBid) {
    await auctionBid.load('profile')

    if (user.id === auctionBid.profile.userId) {
      return true
    }

    if (auction.id !== auctionBid.auctionId) {
      return false
    }

    if (auction.finishedAt) {
      if (DateTime.now() > auction.finishedAt) {
        return true
      }
    }

    return false
  }

  public async create(user: User, auction: Auction) {
    const now = DateTime.now()
    if ((now >= user.payment_start && now <= user.payment_end) || user.payment_end === null) {
      if (user.auctions_attempts > 0) {
        await auction.load('profile')

        return !!auction.verifiedAt && user.id !== auction.profile.userId
      }
      return Bouncer.deny('Number of attempts has ended', 402)
    }
    return Bouncer.deny('Tariff has expired', 402)
  }

  public async update(user: User, auction: Auction, auctionBid: AuctionBid) {
    if (auction.id !== auctionBid.auctionId) {
      return false
    }

    if (auction.finishedAt) {
      if (DateTime.now() < auction.finishedAt) {
        await auctionBid.load('profile')

        return user.id === auctionBid.profile.userId
      }
    }

    return false
  }
}
