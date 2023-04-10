import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Auction from 'App/Models/Auction'
import Profile from 'App/Models/Profile'
import File from 'App/Models/File'

export default class AuctionFilePolicy extends BasePolicy {
  public async create(user: User, profile: Profile, auction: Auction) {
    return user.id === profile.userId && auction.profileId === profile.id
  }
  public async delete(user: User, profile: Profile, auction: Auction, file: File) {
    return (
      user.id === profile.userId &&
      auction.profileId === profile.id &&
      auction.id === file.auctionId
    )
  }
}
