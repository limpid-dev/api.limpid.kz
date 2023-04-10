import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Auction from 'App/Models/Auction'
import Profile from 'App/Models/Profile'

export default class AuctionPolicy extends BasePolicy {
  public async delete(user: User, profile: Profile, auction: Auction) {
    return user.id === profile.userId && profile.id === auction.profileId
  }
}
