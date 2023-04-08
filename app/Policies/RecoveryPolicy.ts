import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Token from 'App/Models/Token'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class RecoveryPolicy extends BasePolicy {
  public create(user: User) {
    return !user.verifiedAt
  }

  public update(user: User, token: Token) {
    if (user.verifiedAt) {
      return false
    }

    if (token.expiredAt < DateTime.now()) {
      return false
    }

    if (token.type !== 'RECOVERY') {
      return false
    }

    if (token.userId !== user.id) {
      return false
    }

    return true
  }
}
