import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Certificate from 'App/Models/Certificate'
import Organization from 'App/Models/Organization'
import CertificatesStoreValidator from 'App/Validators/CertificatesStoreValidator'
import CertificatesUpdateValidator from 'App/Validators/CertificatesUpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class OrganizationCertificatesController {
  @bind()
  public async index({ request }: HttpContextContract, organization: Organization) {
    const payload = await request.validate(PaginationValidator)

    return await organization
      .related('certificates')
      .query()
      .paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, organization: Organization) {
    await bouncer.with('OrganizationCertificatePolicy').authorize('create', organization)
    const payload = await request.validate(CertificatesStoreValidator)

    const certificate = await organization.related('certificates').create(payload)

    return { data: certificate }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    organization: Organization,
    certificate: Certificate
  ) {
    await bouncer
      .with('OrganizationCertificatePolicy')
      .authorize('update', organization, certificate)

    const payload = await request.validate(CertificatesUpdateValidator)

    certificate.merge(payload)

    await certificate.save()

    return { data: certificate }
  }

  @bind()
  public async destroy(
    { bouncer }: HttpContextContract,
    organization: Organization,
    certificate: Certificate
  ) {
    await bouncer
      .with('OrganizationCertificatePolicy')
      .authorize('delete', organization, certificate)

    return await certificate.delete()
  }
}
