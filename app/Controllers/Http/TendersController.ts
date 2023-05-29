import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Tender from 'App/Models/Tender'
import IndexValidator from 'App/Validators/Tenders/IndexValidator'
import StoreValidator from 'App/Validators/Tenders/StoreValidator'
import UpdateValidator from 'App/Validators/Tenders/UpdateValidator'
import UpdateWinnerValidator from 'App/Validators/Tenders/UpdateWinnerValidator'
import { Duration } from 'luxon'

export default class TendersController {
  public async index({ request }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const tenders = await Tender.query().preload('wonTenderBid').paginate(page, perPage)

    return tenders
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const {
      title: title,
      description: description,
      starting_price: startingPrice,
      duration: duration,
    } = await request.validate(StoreValidator)

    const tender = await auth.user!.selectedProfile.related('tenders').create({
      title,
      description,
      startingPrice,
      duration: Duration.fromISO(duration),
    })

    response.status(201)

    return {
      data: tender,
    }
  }

  @bind()
  public async show({}: HttpContextContract, tender: Tender) {
    await tender.load('wonTenderBid')

    return {
      data: tender,
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, tender: Tender) {
    if (request.all().won_tender_bid_id) {
      await bouncer.with('TenderPolicy').allows('updateWinner', tender)

      const { won_tender_bid_id: wonTenderBidId } = await request.validate(UpdateWinnerValidator)

      tender.merge({
        wonTenderBidId,
      })

      await tender.save()

      return {
        data: tender,
      }
    }

    await bouncer.with('TenderPolicy').allows('update', tender)

    const {
      title: title,
      description: description,
      starting_price: startingPrice,
      duration: duration,
    } = await request.validate(UpdateValidator)

    tender.merge({
      title,
      description,
      startingPrice,
    })

    if (duration) {
      tender.merge({
        duration: Duration.fromISO(duration),
      })
    }

    await tender.save()

    return {
      data: tender,
    }
  }

  @bind()
  public async destroy({ response, bouncer }: HttpContextContract, tender: Tender) {
    await bouncer.with('TenderPolicy').allows('delete', tender)

    await tender.delete()

    response.status(204)
  }
}
