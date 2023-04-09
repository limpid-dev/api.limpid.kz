import { bind } from '@adonisjs/route-model-binding'
import Drive from '@ioc:Adonis/Core/Drive'
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

    const location = `./profiles/${profile.id}/certificates/${certificate.id}/files`
    const contentType = `${payload.file.extname}/${payload.file.subtype}`
    const visibility = 'public'
    const name = payload.file.clientName
    const size = payload.file.size
    const extname = payload.file.extname

    await payload.file.moveToDisk(location, {
      name,
      contentType,
      visibility,
      contentLength: size,
    })

    const file = await certificate.related('files').create({
      name,
      location,
      visibility,
      contentType,
      size,
      extname,
      profileId: profile.id,
    })

    return { data: file }
  }

  @bind()
  public async show(
    {}: HttpContextContract,
    _profile: Profile,
    _certificate: Certificate,
    file: File
  ) {
    return { data: file }
  }

  public async destroy(
    { bouncer }: HttpContextContract,
    profile: Profile,
    certificate: Certificate,
    file: File
  ) {
    await bouncer.with('CertificateFilePolicy').authorize('delete', profile, certificate, file)
    await Drive.delete(file.location)
    await file.delete()
  }
}
