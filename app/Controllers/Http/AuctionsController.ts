import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auction from 'App/Models/Auction'
import Profile from 'App/Models/Profile'
import AuctionStoreValidator from 'App/Validators/AuctionStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileActionValidator from 'App/Validators/ProfileActionValidator'

export default class AuctionsController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.validate(PaginationValidator)

    return await Auction.query().qs(request.qs()).paginate(payload.page, payload.perPage)
  }

  @bind()
  public async show({}: HttpContextContract, auction: Auction) {
    return {
      data: auction,
    }
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(AuctionStoreValidator)
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    const auction = await profile.related('auctions').create(payload)

    return {
      data: auction,
    }
  }

  @bind()
  public async destroy({ request, bouncer }: HttpContextContract, auction: Auction) {
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('AuctionPolicy').authorize('delete', profile, auction)

    await auction.delete()
  }
}
