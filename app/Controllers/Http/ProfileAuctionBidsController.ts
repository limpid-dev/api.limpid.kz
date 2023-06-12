import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import PaginationValidator from 'App/Validators/PaginationValidator'

export default class ProfileAuctionBidsController {
  @bind()
  public async index({ request }: HttpContextContract, profile: Profile) {
    const { page, per_page: perPage } = await request.validate(PaginationValidator)

    return profile.related('auctionBids').query().preload('auction').paginate(page, perPage)
  }
}
