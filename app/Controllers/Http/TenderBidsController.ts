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
  public async index({ request, bouncer }: HttpContextContract) {
    const {
      page,
      per_page: perPage,
      profile_id: profileId,
      tender_id: tenderId,
    } = await request.validate(IndexValidator)

    const tenderBidQuery = TenderBid.query()

    tenderBidQuery.if(profileId, (query) => {
      query.where('profileId', profileId!)
    })

    tenderBidQuery.if(tenderId, (query) => {
      query.where('tenderId', tenderId!)
    })

    const tenderBids = await tenderBidQuery.paginate(page, perPage)

    tenderBids.queryString(request.qs())

    const allowedToViewTenderBids = await Promise.all(
      tenderBids.map(async (tenderBid) => {
        const isAllowedToView = await bouncer.with('TenderBidPolicy').allows('view', tenderBid)

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

  public async store({ request, auth, bouncer, response }: HttpContextContract) {
    const { tender_id: tenderId, price } = await request.validate(StoreValidator)

    const tender = await Tender.findOrFail(tenderId)

    await bouncer.with('TenderBidPolicy').allows('create', tender)

    if (tender.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([rules.range(1, tender.startingPrice * PRICE_MODIFIER)]),
        }),
      })
    }

    const tenderBid = TenderBid.create({
      tenderId,
      price,
      profileId: auth.user?.selectedProfileId,
    })

    response.status(201)

    return {
      data: tenderBid,
    }
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, tenderBid: TenderBid) {
    const isAllowedToView = await bouncer.with('TenderBidPolicy').allows('view', tenderBid)

    if (isAllowedToView) {
      return { data: tenderBid }
    }

    return {
      data: TenderBidPolicy.stripRestrictedViewFieldsFromTenderBid(tenderBid),
    }
  }

  @bind()
  public async update({ bouncer, request }: HttpContextContract, tenderBid: TenderBid) {
    await bouncer.with('TenderBidPolicy').allows('update', tenderBid)

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
