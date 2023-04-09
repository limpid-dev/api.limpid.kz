import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Procurement from 'App/Models/Procurement'
import Profile from 'App/Models/Profile'

export default class ProcurementPolicy extends BasePolicy {
  public async viewList(user: User) {
    return true
  }

  public async view(user: User, procurement: Procurement) {
    return true
  }

  public async create(user: User, profile: Profile) {
    return !!profile.verifiedAt
  }

  public async update(user: User, profile: Profile, procurement: Procurement) {
    if (user.id !== profile.userId) {
      return false
    }

    if (procurement.profileId !== profile.id) {
      return false
    }

    return !!profile.verifiedAt
  }

  public async delete(user: User, profile: Profile, procurement: Procurement) {
    if (user.id !== profile.userId) {
      return false
    }

    if (procurement.profileId !== profile.id) {
      return false
    }

    return !!profile.verifiedAt
  }
}
