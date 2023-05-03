import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import File from 'App/Models/File'
import Certificate from 'App/Models/Certificate'
import Organization from 'App/Models/Organization'

export default class OrganizationCertificateFilePolicy extends BasePolicy {
  public async create(user: User, organization: Organization, certificate: Certificate) {
    const owner = user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return !!owner && certificate.organizationId === organization.id
  }
  public async delete(
    user: User,
    organization: Organization,
    certificate: Certificate,
    file: File
  ) {
    const owner = user
      .related('organizationMemberships')
      .query()
      .where('organizationId', organization.id)
      .andWhere('type', 'owner')
      .first()

    return (
      !!owner &&
      certificate.organizationId === organization.id &&
      file.certificateId === certificate.id
    )
  }
}
