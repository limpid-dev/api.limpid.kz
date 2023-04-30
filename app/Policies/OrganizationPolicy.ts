import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organization from 'App/Models/Organization'

export default class OrganizationPolicy extends BasePolicy {
  public async update(user: User, organization: Organization) {
    const membership = user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!membership
  }
  public async delete(user: User, organization: Organization) {
    const membership = user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!membership
  }
}
