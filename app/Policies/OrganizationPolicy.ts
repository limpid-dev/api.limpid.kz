import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import { action } from '@ioc:Adonis/Addons/Bouncer'

export default class OrganizationPolicy extends BasePolicy {
  public static stripRestrictedViewFieldsFromOrganization = (organization: Profile) => ({
    id: organization.id,
    is_visible: organization.isVisible,
    display_name: organization.displayName,
  })

  @action({ allowGuest: true })
  public async view(user: User | null, organization: Profile) {
    if (organization.isVisible) {
      return true
    }
    return !!user && user.id === organization.userId
  }
  public async update(user: User, organization: Profile) {
    return user.id === organization.userId
  }
  public async delete(user: User, organization: Profile) {
    return user.id === organization.userId
  }
}
