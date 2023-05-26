import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Tender from 'App/Models/Tender'
import TenderBid from 'App/Models/TenderBid'
import IndexValidator from 'App/Validators/TenderBids/IndexValidator'
import StoreValidator from 'App/Validators/TenderBids/StoreValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { bind } from '@adonisjs/route-model-binding'

export default class TenderBidsController {
  public async index({ request }: HttpContextContract) {
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

    return tenderBids
  }

  public async store({ request, auth, bouncer, response }: HttpContextContract) {
    const { tender_id: tenderId, price } = await request.validate(StoreValidator)

    const tender = await Tender.findOrFail(tenderId)

    await bouncer.with('TenderBidPolicy').allows('create', tender)

    if (tender.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([rules.range(1, tender.startingPrice)]),
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
  public async show({}: HttpContextContract, tenderBid: TenderBid) {
    return {
      data: tenderBid,
    }
  }

  @bind()
  public async update({ bouncer, request }: HttpContextContract, tenderBid: TenderBid) {
    await tenderBid.load('tender')

    await bouncer.with('TenderBidPolicy').allows('update', tenderBid.tender, tenderBid)

    const { price } = await request.validate({
      schema: schema.create({
        price: schema.number([rules.range(1, tenderBid.price)]),
      }),
    })

    tenderBid.merge({ price })

    await tenderBid.save()

    return {
      data: tenderBid,
    }
  }
}
