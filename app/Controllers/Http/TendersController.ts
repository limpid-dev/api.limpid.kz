import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Tender from 'App/Models/Tender'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileOrganizationActionValidator from 'App/Validators/ProfileOrganizationActionValidator'
import TenderStoreValidator from 'App/Validators/TenderStoreValidator'

export default class TendersController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(PaginationValidator)

    return Tender.query().qs(request.qs()).paginate(payload.page, payload.perPage)
  }

  @bind()
  public async show({}: HttpContextContract, tender: Tender) {
    return { data: tender }
  }

  public async store({ request, bouncer }: HttpContextContract) {
    const payload = await request.validate(TenderStoreValidator)
    const { profileId } = await request.validate(ProfileOrganizationActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('TenderPolicy').authorize('create', profile)

    const tender = await profile.related('tenders').create(payload)

    return { data: tender }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, tender: Tender) {
    await bouncer.with('TenderPolicy').authorize('delete', tender)
    await tender.delete()
  }
}
