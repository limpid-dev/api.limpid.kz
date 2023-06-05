import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class ProfileTenderBidsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return profile.related('tenderBids').query().preload('tender').paginate(page, perPage)
  }
}
