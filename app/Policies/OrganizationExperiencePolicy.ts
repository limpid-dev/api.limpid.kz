import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Experience from 'App/Models/Experience'
import Organization from 'App/Models/Organization'

export default class OrganizationExperiencePolicy extends BasePolicy {
  public async create(user: User, organization: Organization) {
    const owner = user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner
  }
  public async update(user: User, organization: Organization, experience: Experience) {
    const owner = user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner && experience.organizationId === organization.id
  }
  public async delete(user: User, organization: Organization, experience: Experience) {
    const owner = user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner && experience.organizationId === organization.id
  }
}
