import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auction from 'App/Models/Auction'
import AuctionBid from 'App/Models/AuctionBid'
import Chat from 'App/Models/Chat'
import IndexValidator from 'App/Validators/Auctions/IndexValidator'
import StoreValidator from 'App/Validators/Auctions/StoreValidator'
import UpdateValidator from 'App/Validators/Auctions/UpdateValidator'
import UpdateWinnerValidator from 'App/Validators/Auctions/UpdateWinnerValidator'
import { Duration } from 'luxon'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class AuctionsController {
  public async index({ request }: HttpContextContract) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const auction = await Auction.query().preload('wonAuctionBid').paginate(page, perPage)

    return auction
  }

  public async store({ request, auth }: HttpContextContract) {
    const {
      title: title,
      description: description,
      starting_price: startingPrice,
      purchase_price: purchasePrice,
      duration: duration,
      industry: industry,
      technical_specification: technicalSpecification,
    } = await request.validate(StoreValidator)

    const auction = new Auction()

    auction.merge({
      title,
      description,
      startingPrice,
      purchasePrice,
      industry,
      duration: Duration.fromISO(duration),
      profileId: auth.user!.selectedProfileId!,
    })

    if (technicalSpecification) {
      auction.merge({
        technicalSpecification: Attachment.fromFile(technicalSpecification),
      })
    }

    await auction.save()

    return {
      data: auction,
    }
  }

  @bind()
  public async show({}: HttpContextContract, auction: Auction) {
    await auction.load('wonAuctionBid')

    return {
      data: auction,
    }
  }

  @bind()
  public async update({ request, bouncer, auth }: HttpContextContract, auction: Auction) {
    if (request.all().won_auction_bid_id) {
      await bouncer.with('AuctionPolicy').allows('updateWinner', auction)

      const { won_auction_bid_id: wonAuctionBidId } = await request.validate(UpdateWinnerValidator)

      auction.merge({
        wonAuctionBidId,
      })

      await auction.save()

      const wonAuctionBid = await AuctionBid.findOrFail(wonAuctionBidId)

      await wonAuctionBid.load('profile')

      await wonAuctionBid.profile.load('user')

      const chat = await Chat.create({
        name: `${auth.user!.firstName} ${auth.user!.lastName}, ${
          wonAuctionBid.profile.user.firstName
        } ${wonAuctionBid.profile.user.lastName}`,
      })

      await chat
        .related('members')
        .createMany([{ userId: auth.user!.id }, { userId: wonAuctionBid.profile.user.id }])

      return {
        data: auction,
      }
    }

    await bouncer.with('AuctionPolicy').allows('update', auction)

    const {
      title: title,
      description: description,
      starting_price: startingPrice,
      duration: duration,
    } = await request.validate(UpdateValidator)

    auction.merge({
      title,
      description,
      startingPrice,
    })

    if (duration) {
      auction.merge({
        duration: Duration.fromISO(duration),
      })
    }

    await auction.save()

    return {
      data: auction,
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, auction: Auction) {
    await bouncer.with('AuctionPolicy').allows('delete', auction)

    await auction.delete()
  }
}
