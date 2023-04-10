import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Certificate from 'App/Models/Certificate'
import File from 'App/Models/File'
import Profile from 'App/Models/Profile'
import CertificateFilesStoreValidator from 'App/Validators/CertificateFilesStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class CertificateFilesController {
  @bind()
  public async index(
    { request }: HttpContextContract,
    _profile: Profile,
    certificate: Certificate
  ) {
    const payload = await request.validate(PaginationValidator)

    return await certificate.related('files').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store(
    { request, bouncer }: HttpContextContract,
    profile: Profile,
    certificate: Certificate
  ) {
    await bouncer.with('CertificateFilePolicy').authorize('create', profile, certificate)

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
    profile: Profile,
    certificate: Certificate,
    file: File
  ) {
    await bouncer.with('CertificateFilePolicy').authorize('delete', profile, certificate, file)

    await file.delete()
  }
}
