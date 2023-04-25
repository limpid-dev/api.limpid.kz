import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Tender from 'App/Models/Tender'
import AuctionBidStoreValidator from 'App/Validators/AuctionBidStoreValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import ProfileActionValidator from 'App/Validators/ProfileActionValidator'
import TenderBid from 'App/Models/TenderBid'
import AuctionBidUpdateValidator from 'App/Validators/AuctionBidUpdateValidator'

export default class TenderBidsController {
  @bind()
  public async index({ request }: HttpContextContract, tender: Tender) {
    const payload = await request.validate(PaginationValidator)

    return tender.related('bids').query().paginate(payload.page, payload.perPage)
  }

  @bind()
  public async store({ request }: HttpContextContract, tender: Tender) {
    const { profileId } = await request.validate(ProfileActionValidator)

    const profile = await Profile.findOrFail(profileId)

    const payload = await request.validate(AuctionBidStoreValidator)

    if (tender.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([rules.range(1, tender.startingPrice)]),
        }),
      })
    }

    const bid = await tender.related('bids').create({ ...payload, profileId: profile.id })

    return { data: bid }
  }

  @bind()
  public async update({ request }: HttpContextContract, tender: Tender, bid: TenderBid) {
    const payload = await request.validate(AuctionBidUpdateValidator)

    if (tender.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([rules.range(1, tender.startingPrice)]),
        }),
      })
    }

    await request.validate({
      schema: schema.create({
        price: schema.number([rules.range(1, bid.price * 0.99)]),
      }),
    })

    await bid.merge(payload).save()

    return { data: bid }
  }
}
