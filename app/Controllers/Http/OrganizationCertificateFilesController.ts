import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Certificate from 'App/Models/Certificate'
import File from 'App/Models/File'
import Organization from 'App/Models/Organization'
import CertificateFilesStoreValidator from 'App/Validators/CertificateFilesStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class OrganizationCertificateFilesController {
  @bind()
  public async index(
    { request }: HttpContextContract,
    _organization: Organization,
    certificate: Certificate
  ) {
    const payload = await request.validate(PaginationValidator)

    return await certificate.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store(
    { request, bouncer }: HttpContextContract,
    organization: Organization,
    certificate: Certificate
  ) {
    await bouncer
      .with('OrganizationCertificateFilePolicy')
      .authorize('create', organization, certificate)

    const payload = await request.validate(CertificateFilesStoreValidator)

    const file = await File.from(payload.file)
      .merge({
        certificateId: certificate.id,
      })
      .save()

    return {
      file,
    }
  }

  @bind()
  public async destroy(
    { bouncer }: HttpContextContract,
    organization: Organization,
    certificate: Certificate,
    file: File
  ) {
    await bouncer
      .with('OrganizationCertificateFilePolicy')
      .authorize('delete', organization, certificate, file)

    await file.delete()
  }
}
