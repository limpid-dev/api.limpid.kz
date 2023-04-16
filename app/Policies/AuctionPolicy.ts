import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Auction from 'App/Models/Auction'

export default class AuctionPolicy extends BasePolicy {
  public async delete(user: User, auction: Auction) {
    const profile = await user.related('profiles').query().where('id', auction.profileId).first()

    return !!profile
  }
}
