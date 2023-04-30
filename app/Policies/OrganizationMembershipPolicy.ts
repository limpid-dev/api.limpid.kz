import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import OrganizationMembership from 'App/Models/OrganizationMembership'
import Organization from 'App/Models/Organization'

export default class OrganizationMembershipPolicy extends BasePolicy {
  public async viewList(user: User, organization: Organization) {
    const membership = await organization
      .related('memberships')
      .query()
      .where('userId', user.id)
      .first()

    return !!membership
  }
  public async create(user: User, organization: Organization) {
    const membership = await organization
      .related('memberships')
      .query()
      .where('userId', user.id)
      .andWhere('type', 'owner')
      .first()

    return !!membership
  }
  public async delete(user: User, organization: Organization, membership: OrganizationMembership) {
    const userMembership = await organization
      .related('memberships')
      .query()
      .where('userId', user.id)
      .andWhere('type', 'owner')
      .first()

    return !!userMembership && userMembership.id !== membership.id
  }
}
