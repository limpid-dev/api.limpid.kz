import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Auction from 'App/Models/Auction'
import Profile from 'App/Models/Profile'
import { DateTime } from 'luxon'

export default class AuctionPolicy extends BasePolicy {
  public async update(user: User, profile: Profile, auction: Auction) {
    return (
      user.id === profile.userId &&
      profile.id === auction.profileId &&
      auction.startedAt <
        DateTime.now().minus({
          days: 1,
        })
    )
  }
  public async delete(user: User, profile: Profile, auction: Auction) {
    return (
      user.id === profile.userId &&
      profile.id === auction.profileId &&
      auction.startedAt <
        DateTime.now().minus({
          days: 1,
        })
    )
  }
}
