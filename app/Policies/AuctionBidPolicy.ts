import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Auction from 'App/Models/Auction'
import AuctionBid from 'App/Models/AuctionBid'
import { DateTime } from 'luxon'

export default class AuctionBidPolicy extends BasePolicy {
  public async create(user: User, profile: Profile, auction: Auction) {
    return (
      user.id === profile.userId &&
      auction.finishedAt < DateTime.now() &&
      auction.profileId !== profile.id
    )
  }
  public async update(user: User, profile: Profile, auction: Auction, bid: AuctionBid) {
    return (
      user.id === profile.userId &&
      auction.finishedAt < DateTime.now() &&
      auction.profileId !== profile.id &&
      bid.profileId === profile.id
    )
  }
  public async delete(user: User, profile: Profile, auction: Auction, bid: AuctionBid) {
    return (
      user.id === profile.userId &&
      auction.finishedAt < DateTime.now() &&
      auction.profileId !== profile.id &&
      bid.profileId === profile.id
    )
  }
}
