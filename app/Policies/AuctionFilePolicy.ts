import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Auction from 'App/Models/Auction'
import File from 'App/Models/File'

export default class AuctionFilePolicy extends BasePolicy {
  public async create(user: User, auction: Auction) {
    const profile = await user.related('profiles').query().where('id', auction.profileId).first()

    return !!profile
  }
  public async delete(user: User, auction: Auction, file: File) {
    const profile = await user.related('profiles').query().where('id', auction.profileId).first()

    return !!profile && auction.id === file.auctionId
  }
}
