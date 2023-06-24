import { bind } from '@adonisjs/route-model-binding'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Tender from 'App/Models/Tender'
import User from 'App/Models/User'
import IndexValidator from 'App/Validators/Tenders/IndexValidator'
import StoreValidator from 'App/Validators/Tenders/StoreValidator'
import UpdateValidator from 'App/Validators/Tenders/UpdateValidator'
import { Duration } from 'luxon'

export default class TendersController {
  public async index({ request }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const tenders = await Tender.query().preload('wonTenderBid').paginate(page, perPage)

    return tenders
  }

  public async store({ request, auth, bouncer }: HttpContextContract) {
    const {
      title: title,
      description: description,
      starting_price: startingPrice,
      duration: duration,
      technical_specification: technicalSpecification,
      purchase_type: purchaseType,
      industry,
    } = await request.validate(StoreValidator)

    await bouncer.with('AuctionPolicy').authorize('create')

    const user = await User.findOrFail(auth.user!.id)

    const tender = new Tender()

    tender.merge({
      title,
      description,
      startingPrice,
      duration: Duration.fromISO(duration),
      profileId: auth.user!.selectedProfileId!,
      purchaseType,
      industry,
    })

    if (technicalSpecification) {
      tender.merge({
        technicalSpecification: Attachment.fromFile(technicalSpecification),
      })
    }

    user.auctions_attempts = user.auctions_attempts - 1

    await user.save()

    await tender.save()

    return {
      data: tender,
    }
  }

  @bind()
  public async show({}: HttpContextContract, tender: Tender) {
    await tender.load('wonTenderBid', (query) => query.preload('profile'))
    await tender.load('profile')

    return {
      data: tender,
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, tender: Tender) {
    // if (request.all().won_tender_bid_id) {
    //   await bouncer.with('TenderPolicy').allows('updateWinner', tender)

    //   const { won_tender_bid_id: wonTenderBidId } = await request.validate(UpdateWinnerValidator)

    //   tender.merge({
    //     wonTenderBidId,
    //   })

    //   await tender.save()

    //   const wonTenderBid = await TenderBid.findOrFail(wonTenderBidId)

    //   await wonTenderBid.load('profile')

    //   await wonTenderBid.profile.load('user')

    //   const chat = await Chat.create({
    //     name: `${auth.user!.firstName} ${auth.user!.lastName}, ${
    //       wonTenderBid.profile.user.firstName
    //     } ${wonTenderBid.profile.user.lastName}`,
    //   })

    //   await chat
    //     .related('members')
    //     .createMany([{ userId: auth.user!.id }, { userId: wonTenderBid.profile.user.id }])

    //   return {
    //     data: tender,
    //   }
    // }

    await bouncer.with('TenderPolicy').allows('update', tender)

    const {
      title: title,
      description: description,
      starting_price: startingPrice,
      duration: duration,
      technical_specification: technicalSpecification,
      purchase_type: purchaseType,
    } = await request.validate(UpdateValidator)

    tender.merge({
      title,
      description,
      startingPrice,
      purchaseType,
    })

    if (duration) {
      tender.merge({
        duration: Duration.fromISO(duration),
      })
    }

    if (technicalSpecification) {
      tender.merge({
        technicalSpecification: Attachment.fromFile(technicalSpecification),
      })
    }

    await tender.save()

    return {
      data: tender,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, tender: Tender) {
    await bouncer.with('TenderPolicy').allows('delete', tender)

    await tender.delete()
  }
}
