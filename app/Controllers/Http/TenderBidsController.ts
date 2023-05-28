import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Tender from 'App/Models/Tender'
import TenderBid from 'App/Models/TenderBid'
import IndexValidator from 'App/Validators/TenderBids/IndexValidator'
import StoreValidator from 'App/Validators/TenderBids/StoreValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { bind } from '@adonisjs/route-model-binding'
import TenderBidPolicy from 'App/Policies/TenderBidPolicy'

const PRICE_MODIFIER = 0.99

export default class TenderBidsController {
  @bind()
  public async index({ request, bouncer }: HttpContextContract, tender: Tender) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const tenderBidQuery = TenderBid.query().where('tenderId', tender.id)

    const tenderBids = await tenderBidQuery.paginate(page, perPage)

    tenderBids.queryString(request.qs())

    const allowedToViewTenderBids = await Promise.all(
      tenderBids.map(async (tenderBid) => {
        const isAllowedToView = await bouncer
          .with('TenderBidPolicy')
          .allows('view', tender, tenderBid)

        if (isAllowedToView) {
          return tenderBid
        }

        return TenderBidPolicy.stripRestrictedViewFieldsFromTenderBid(tenderBid)
      })
    )

    return {
      meta: tenderBids.getMeta(),
      data: allowedToViewTenderBids,
    }
  }

  @bind()
  public async store({ request, auth, bouncer, response }: HttpContextContract, tender: Tender) {
    const { price } = await request.validate(StoreValidator)

    await bouncer.with('TenderBidPolicy').allows('create', tender)

    if (tender.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([rules.range(1, tender.startingPrice * PRICE_MODIFIER)]),
        }),
      })
    }

    if (auth.user?.selectedOrganizationId === null) {
      auth.user.load('profile')
      const tenderBid = tender.related('bids').create({
        price,
        profileId: auth.user!.profile.id,
      })
      response.status(201)

      return {
        data: tenderBid,
      }
    }

    const tenderBid = tender.related('bids').create({
      price,
      profileId: auth.user!.selectedOrganizationId,
    })
    response.status(201)

    return {
      data: tenderBid,
    }
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, tender: Tender, tenderBid: TenderBid) {
    const isAllowedToView = await bouncer.with('TenderBidPolicy').allows('view', tender, tenderBid)

    if (isAllowedToView) {
      return { data: tenderBid }
    }

    return {
      data: TenderBidPolicy.stripRestrictedViewFieldsFromTenderBid(tenderBid),
    }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    tender: Tender,
    tenderBid: TenderBid
  ) {
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
