import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import File from 'App/Models/File'
import Organization from 'App/Models/Organization'

export default class OrganizationFilePolicy extends BasePolicy {
  public async create(user: User, organization: Organization) {
    const owner = await user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner
  }
  public async delete(user: User, organization: Organization, file: File) {
    const owner = await user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner && file.organizationId === organization.id
  }
}
