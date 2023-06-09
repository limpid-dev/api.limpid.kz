import { bind } from '@adonisjs/route-model-binding'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import Tender from 'App/Models/Tender'
import TenderBid from 'App/Models/TenderBid'
import User from 'App/Models/User'
import UpdateWinnerValidator from 'App/Validators/Tenders/UpdateWinnerValidator'
import IndexValidator from 'App/Validators/Tenders/IndexValidator'
import StoreValidator from 'App/Validators/Tenders/StoreValidator'
import UpdateValidator from 'App/Validators/Tenders/UpdateValidator'
import { Duration } from 'luxon'

export default class TendersController {
  public async index({ request }: HttpContextContract) {
    const {
      page,
      per_page: perPage,
      industry,
      profile_id: profileId,
      search,
    } = await request.validate(IndexValidator)

    const query = Tender.query()

    if (profileId) {
      query.where('profileId', profileId)
    }

    if (industry) {
      query.whereIn('industry', industry)
    }

    if (search) {
      query.andWhere((query) => {
        query.whereLike('title', `%${search}%`).orWhereLike('description', `%${search}%`)
      })
    }

    const tenders = await query
      .preload('profile', (q) => {
        q.preload('user')
      })
      .paginate(page, perPage)

    tenders.queryString(request.qs())

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

    user.auctionsAttempts = user.auctionsAttempts - 1

    await user.save()

    await tender.save()

    return {
      data: tender,
    }
  }

  @bind()
  public async show({}: HttpContextContract, tender: Tender) {
    if (tender.wonTenderBidId !== null) {
      const tenders = await Tender.query()
        .preload('wonTenderBid', (profileQuery) => {
          profileQuery.preload('profile')
        })
        .preload('profile')
        .where('id', tender.id)
        .firstOrFail()
      return {
        data: tenders,
      }
    } else {
      const tenders = await Tender.query()
        .preload('bids', (profileQuery) => {
          profileQuery.preload('profile')
        })
        .preload('profile')
        .where('id', tender.id)
        .firstOrFail()
      return {
        data: tenders,
      }
    }
  }

  @bind()
  public async update({ request, bouncer }: HttpContextContract, tender: Tender) {
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
  public async showWinner({}, tender: Tender) {
    tender.load('wonTenderBid', (q) => {
      q.preload('profile', (q) => {
        q.preload('user')
      })
    })

    return {
      data: tender.wonTenderBid,
    }
  }

  @bind()
  public async updateWinner({ request, bouncer, auth }: HttpContextContract, tender: Tender) {
    await bouncer.with('TenderPolicy').allows('updateWinner', tender)

    const { won_tender_bid_id: wonTenderBidId } = await request.validate(UpdateWinnerValidator)

    tender.merge({
      wonTenderBidId,
    })

    await tender.save()

    const wonTenderBid = await TenderBid.findOrFail(wonTenderBidId)

    await wonTenderBid.load('profile')

    await wonTenderBid.profile.load('user')

    const chat = await Chat.create({
      name: `${auth.user!.firstName} ${auth.user!.lastName}, ${
        wonTenderBid.profile.user.firstName
      } ${wonTenderBid.profile.user.lastName}`,
    })

    await chat
      .related('members')
      .createMany([{ userId: auth.user!.id }, { userId: wonTenderBid.profile.user.id }])

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
