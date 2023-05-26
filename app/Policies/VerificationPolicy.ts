import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class VerificationPolicy extends BasePolicy {
  public async create(user: User) {
    return user.emailVerifiedAt === null
  }
}
