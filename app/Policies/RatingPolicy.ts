import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Rating from 'App/Models/Rating'

export default class RatingPolicy extends BasePolicy {
  public async create(user: User, profile: Profile) {
    return user.selectedProfileId !== profile.id
  }
  public async update(user: User, rating: Rating) {
    await rating.load('rankingProfile')
    return user.id === rating.rankingProfile.userId
  }
  public async delete(user: User, rating: Rating) {
    await rating.load('rankingProfile')
    return user.id === rating.rankingProfile.userId
  }
}
