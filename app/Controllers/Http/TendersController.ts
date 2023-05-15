import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Tender from 'App/Models/Tender'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileOrganizationActionValidator from 'App/Validators/ProfileOrganizationActionValidator'
import TenderStoreValidator from 'App/Validators/TenderStoreValidator'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class TendersController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(PaginationValidator)

    return Tender.query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async show({}: HttpContextContract, tender: Tender) {
    return { data: tender }
  }

  public async store({ request, bouncer }: HttpContextContract) {
    const payload = await request.validate(TenderStoreValidator)
    const { profileId } = await request.validate(ProfileOrganizationActionValidator)

    const profile = await Profile.findOrFail(profileId)
    const newProfile = await Profile.query().where('id', profile.userId).preload('user').first()
    const now = DateTime.now()

    if (!newProfile) {
      return { message: 'Профиль не найден' }
    }
    const user = await User.findOrFail(newProfile.id)

    if ((now >= user.payment_start && now <= user.payment_end) || user.payment_end === null) {
      if (user.auction_atmpts > 0) {
        await bouncer.with('TenderPolicy').authorize('create', profile)
        const tender = await profile.related('tenders').create(payload)

        user.auction_atmpts = user.auction_atmpts - 1
        await user.save()

        return { data: tender }
      } else {
        throw new Error('У вас недостаточно попыток')
      }
    } else {
      throw new Error('Ваш тариф просрочен')
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, tender: Tender) {
    await bouncer.with('TenderPolicy').authorize('delete', tender)
    await tender.delete()
  }
}
