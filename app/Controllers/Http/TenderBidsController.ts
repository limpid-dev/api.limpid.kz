import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Tender from 'App/Models/Tender'
import TenderBid from 'App/Models/TenderBid'
import User from 'App/Models/User'
import IndexValidator from 'App/Validators/TenderBids/IndexValidator'
import StoreValidator from 'App/Validators/TenderBids/StoreValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { bind } from '@adonisjs/route-model-binding'
// import TenderBidPolicy from 'App/Policies/TenderBidPolicy'

const PRICE_MODIFIER = 0.99

export default class TenderBidsController {
  @bind()
  public async index({ request }: HttpContextContract, tender: Tender) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const tenderBidQuery = TenderBid.query()
      .where('tenderId', tender.id)
      .preload('profile', (q) => {
        q.preload('user')
      })

    const tenderBids = await tenderBidQuery.paginate(page, perPage)

    tenderBids.queryString(request.qs())

    // const allowedToViewTenderBids = await Promise.all(
    //   tenderBids.map(async (tenderBid) => {
    //     const isAllowedToView = await bouncer
    //       .with('TenderBidPolicy')
    //       .allows('view', tender, tenderBid)

    //     if (isAllowedToView) {
    //       return tenderBid
    //     }

    //     return TenderBidPolicy.stripRestrictedViewFieldsFromTenderBid(tenderBid)
    //   })
    // )

    return tenderBids
  }

  @bind()
  public async store({ request, auth, bouncer }: HttpContextContract, tender: Tender) {
    const { price } = await request.validate(StoreValidator)

    await bouncer.with('TenderBidPolicy').allows('create', tender)

    const user = await User.findOrFail(auth.user!.id)

    if (tender.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([rules.range(1, tender.startingPrice * PRICE_MODIFIER)]),
        }),
      })
    }

    const tenderBid = tender.related('bids').create({
      price,
      profileId: auth.user!.selectedProfileId!,
    })

    user.auctions_attempts = user.auctions_attempts - 1

    await user.save()

    return {
      data: tenderBid,
    }
  }

  @bind()
  public async show({ auth }: HttpContextContract, tender: Tender) {
    const tenderBid = await tender
      .related('bids')
      .query()
      .where('profileId', auth.user!.selectedProfileId!)
      .firstOrFail()

    return {
      data: tenderBid,
    }
  }

  @bind()
  public async update({ bouncer, request, auth }: HttpContextContract, tender: Tender) {
    const tenderBid = await tender
      .related('bids')
      .query()
      .where('profileId', auth.user!.selectedProfileId!)
      .firstOrFail()

    await bouncer.with('TenderBidPolicy').allows('update', tender, tenderBid)

    const { price } = await request.validate({
      schema: schema.create({
        price: schema.number([rules.range(1, tenderBid.price * 0.99)]),
      }),
    })

    tenderBid.merge({ price })

    await tenderBid.save()

    return {
      data: tenderBid,
    }
  }
}
