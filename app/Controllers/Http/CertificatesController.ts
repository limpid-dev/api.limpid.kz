import Drive from '@ioc:Adonis/Core/Drive'
import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Certificate from 'App/Models/Certificate'
import File from 'App/Models/File'
import Profile from 'App/Models/Profile'
import CertificatesStoreValidator from 'App/Validators/CertificatesStoreValidator'
import CertificatesUpdateValidator from 'App/Validators/CertificatesUpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class CertificatesController {
  @bind()
  public async index({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('CertificatePolicy').authorize('viewList', profile)
    const payload = await request.validate(PaginationValidator)

    return await profile.related('certificates').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, profile: Profile, certificate: Certificate) {
    await bouncer.with('CertificatePolicy').authorize('view', profile)

    return { data: { certificate } }
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('CertificatePolicy').authorize('create', profile)
    const payload = await request.validate(CertificatesStoreValidator)

    const location = `./${profile.id}/certificates`

    await payload.file.moveToDisk(location, {
      name: payload.file.clientName,
      visibility: 'public',
    })

    const file = await File.create({
      location: `${location}/${payload.file.clientName}`,
      mimeType: `${payload.file.type}/${payload.file.subtype}`,
      name: payload.file.clientName,
      extname: payload.file.extname,
      visibility: 'public',
      size: payload.file.size,
    })

    const certificate = await profile.related('certificates').create({
      fileId: file.id,
      ...payload,
    })

    return { data: certificate }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    profile: Profile,
    certificate: Certificate
  ) {
    await bouncer.with('CertificatePolicy').authorize('update', profile)

    const payload = await request.validate(CertificatesUpdateValidator)

    if (payload.file) {
      const location = `./${profile.id}/certificates`

      await payload.file.moveToDisk(location, {
        name: payload.file.clientName,
        visibility: 'public',
      })

      const file = await File.create({
        location: `${location}/${payload.file.clientName}`,
        mimeType: `${payload.file.type}/${payload.file.subtype}`,
        name: payload.file.clientName,
        extname: payload.file.extname,
        visibility: 'public',
        size: payload.file.size,
      })

      certificate.merge({ fileId: file.id })
    }

    certificate.merge(payload)

    await certificate.save()

    return { data: certificate }
  }

  @bind()
  public async destroy(
    { bouncer }: HttpContextContract,
    profile: Profile,
    certificate: Certificate
  ) {
    await bouncer.with('CertificatePolicy').authorize('delete', profile)

    return await certificate.delete()
  }
}
