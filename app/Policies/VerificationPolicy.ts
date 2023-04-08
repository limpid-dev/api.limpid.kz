import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Token from 'App/Models/Token'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class VerificationPolicy extends BasePolicy {
  public store(user: User) {
    return !user.verifiedAt
  }

  public update(user: User, token: Token) {
    if (user.verifiedAt) {
      return false
    }

    if (token.expiredAt < DateTime.now()) {
      return false
    }

    if (token.type !== 'VERIFICATION') {
      return false
    }

    if (token.userId !== user.id) {
      return false
    }

    return true
  }
}
