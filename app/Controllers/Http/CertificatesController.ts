import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Certificate from 'App/Models/Certificate'
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

    return { data: certificate }
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('CertificatePolicy').authorize('create', profile)
    const payload = await request.validate(CertificatesStoreValidator)

    const certificate = profile.related('educations').create(payload)

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
