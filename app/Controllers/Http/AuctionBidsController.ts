import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auction from 'App/Models/Auction'
import AuctionBid from 'App/Models/AuctionBid'
import Profile from 'App/Models/Profile'
import AuctionBidStoreValidator from 'App/Validators/AuctionBidStoreValidator'
import AuctionBidUpdateValidator from 'App/Validators/AuctionBidUpdateValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileOrganizationActionValidator from 'App/Validators/ProfileOrganizationActionValidator'
import { DateTime } from 'luxon'

export default class AuctionBidsController {
  @bind()
  public async index({ request }: HttpContextContract, auction: Auction) {
    const payload = await request.validate(PaginationValidator)

    return auction.related('bids').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request, bouncer }: HttpContextContract, auction: Auction) {
    const { profileId } = await request.validate(ProfileOrganizationActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('AuctionBidPolicy').authorize('create', profile, auction)

    const payload = await request.validate(AuctionBidStoreValidator)

    if (auction.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([rules.range(auction.startingPrice, 999999999999999.9999)]),
        }),
      })
    }

    const bid = await auction.related('bids').create(payload)

    if (auction.purchasePrice) {
      if (bid.price >= auction.purchasePrice) {
        await bid.merge({ wonAt: DateTime.now() }).save()
        await auction.merge({ finishedAt: DateTime.now() }).save()
      }
    }

    return { data: bid }
  }

  @bind()
  public async update(
    { request, bouncer }: HttpContextContract,
    auction: Auction,
    bid: AuctionBid
  ) {
    const { profileId } = await request.validate(ProfileOrganizationActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('AuctionBidPolicy').authorize('update', profile, auction, bid)

    const payload = await request.validate(AuctionBidUpdateValidator)

    if (auction.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([rules.range(auction.startingPrice, 999999999999999.9999)]),
        }),
      })
    }

    await bid.merge(payload).save()

    if (auction.purchasePrice) {
      if (bid.price >= auction.purchasePrice) {
        await bid.merge({ wonAt: DateTime.now() }).save()
        await auction.merge({ finishedAt: DateTime.now() }).save()
      }
    }

    return { data: bid }
  }

  @bind()
  public async destroy(
    { request, bouncer }: HttpContextContract,
    auction: Auction,
    bid: AuctionBid
  ) {
    const { profileId } = await request.validate(ProfileOrganizationActionValidator)

    const profile = await Profile.findOrFail(profileId)

    await bouncer.with('AuctionBidPolicy').authorize('delete', profile, auction, bid)

    await bid.delete()
  }
}
