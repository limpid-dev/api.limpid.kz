import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Contact from 'App/Models/Contact'
import Organization from 'App/Models/Organization'
import User from 'App/Models/User'

export default class OrganizationContactPolicy extends BasePolicy {
  public async create(user: User, organization: Organization) {
    const owner = await user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner
  }
  public async update(user: User, organization: Organization, contact: Contact) {
    const owner = await user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner && contact.organizationId === organization.id
  }
  public async delete(user: User, organization: Organization, contact: Contact) {
    const owner = await user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner && contact.organizationId === organization.id
  }
}
