import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Certificate from 'App/Models/Certificate'
import Profile from 'App/Models/Profile'
import CertificatesDestroyValidator from 'App/Validators/CertificatesDestroyValidator'
import CertificatesIndexValidator from 'App/Validators/CertificatesIndexValidator'
import CertificatesStoreValidator from 'App/Validators/CertificatesStoreValidator'
import CertificatesUpdateValidator from 'App/Validators/CertificatesUpdateValidator'

export default class CertificatesController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(CertificatesIndexValidator)

    return await Certificate.query()
      .where('profileId', payload.params.profileId)
      .paginate(payload.page, payload.perPage)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const { params, attachment, ...payload } = await request.validate(CertificatesStoreValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        return await Certificate.create({
          profileId: params.profileId,
          attachment: Attachment.fromFile(attachment),
          ...payload,
        })
      }
    }

    return response.forbidden({})
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const { params, attachment, ...payload } = await request.validate(CertificatesUpdateValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const certificate = await Certificate.findOrFail(params.certificateId)

        return await certificate
          .merge({
            attachment: attachment ? Attachment.fromFile(attachment) : certificate.attachment,
            ...payload,
          })
          .save()
      }
    }

    return response.forbidden({})
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const { params } = await request.validate(CertificatesDestroyValidator)

    if (auth.user) {
      const profile = await Profile.findOrFail(params.profileId)

      if (profile.userId === auth.user.id) {
        const certificate = await Certificate.findOrFail(params.certificateId)

        return await certificate.delete()
      }
    }

    return response.forbidden({})
  }
}
