import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Certificate from 'App/Models/Certificate'
import Profile from 'App/Models/Profile'
import StoreValidator from 'App/Validators/Certificates/StoreValidator'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import UpdateValidator from 'App/Validators/Certificates/UpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class CertificatesController {
  @bind()
  public async index({request}: HttpContextContract, profile: Profile) {
    const {page,per_page:perPage} = await request.validate(PaginationValidator)

    return await Certificate.query().where('profileId', profile.id).paginate(page,perPage)
  }

  @bind()
  public async store({ bouncer, request }: HttpContextContract, profile: Profile) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('create', profile)
    const {
      title,
      description,
      institution,
      issued_at: issuedAt,
      expired_at: expiredAt,
      attachment,
    } = await request.validate(StoreValidator)

    const certificate = new Certificate()

    certificate.merge({
      title,
      description,
      institution,
      issuedAt,
      expiredAt,
      profileId: profile.id,
    })

    if (attachment) {
      certificate.merge({
        attachment: Attachment.fromFile(attachment),
      })
    }

    await certificate.save()

    return { data: certificate }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    profile: Profile,
    certificate: Certificate
  ) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('update', profile, certificate)

    const {
      title,
      description,
      institution,
      issued_at: issuedAt,
      expired_at: expiredAt,
      attachment,
    } = await request.validate(UpdateValidator)

    certificate.merge({
      title,
      description,
      institution,
      issuedAt,
      expiredAt,
    })

    if (attachment) {
      certificate.merge({
        attachment: Attachment.fromFile(attachment),
      })
    }

    await certificate.save()

    return { data: certificate }
  }

  @bind()
  public async destroy(
    { bouncer }: HttpContextContract,
    profile: Profile,
    certificate: Certificate
  ) {
    await bouncer.with('ProfileSubResourcePolicy').authorize('delete', profile, certificate)

    await certificate.delete()
  }
}
