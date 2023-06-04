import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class ProfilesPolicy extends BasePolicy {
  public static stripRestrictedViewFieldsFromProfile = (organization: Profile) => ({
    id: organization.id,
    is_visible: organization.isVisible,
    display_name: organization.displayName,
  })

  public async view(user: User, organization: Profile) {
    if (organization.isVisible) {
      return true
    }

    return user.id === organization.userId
  }
  public async update(user: User, organization: Profile) {
    return user.id === organization.userId
  }
  public async delete(user: User, organization: Profile) {
    return user.id === organization.userId
  }
}
