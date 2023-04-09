import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Procurement from 'App/Models/Procurement'
import Profile from 'App/Models/Profile'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProcurementShowValidator from 'App/Validators/ProcurementShowValidator'
import ProcurementStoreValidator from 'App/Validators/ProcurementStoreValidator'
import ProcurementUpdateValidator from 'App/Validators/ProcurementUpdateValidator'

export default class ProcurementsController {
  public async index({ request, bouncer }: HttpContextContract) {
    const payload = await request.validate(PaginationValidator)

    await bouncer.with('ProcurementPolicy').authorize('viewList')

    return await Procurement.query().paginate(payload.page, payload.perPage)
  }

  public async store({ request, bouncer }: HttpContextContract) {
    const { profileId, ...payload } = await request.validate(ProcurementStoreValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('ProcurementPolicy').authorize('create', profile)

    const procurement = await profile.related('procurements').create(payload)

    return { data: procurement }
  }

  @bind()
  public async show({ request, bouncer }: HttpContextContract, procurement: Procurement) {
    const { profileId } = await request.validate(ProcurementShowValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('ProcurementPolicy').authorize('view', profile)

    return { data: procurement }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, procurement: Procurement) {
    const { profileId, ...payload } = await request.validate(ProcurementUpdateValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('ProcurementPolicy').authorize('update', profile, procurement)

    procurement.merge(payload)

    await procurement.save()

    return { data: procurement }
  }

  @bind()
  public async destroy({ request, bouncer }: HttpContextContract, procurement: Procurement) {
    const { profileId } = await request.validate(ProcurementUpdateValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('ProcurementPolicy').authorize('delete', profile, procurement)

    await procurement.delete()
  }
}
