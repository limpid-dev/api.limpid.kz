import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auction from 'App/Models/Auction'
import IndexValidator from 'App/Validators/Auctions/IndexValidator'
import StoreValidator from 'App/Validators/Auctions/StoreValidator'
import UpdateValidator from 'App/Validators/Auctions/UpdateValidator'
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
      photo_one: photoOne,
      photo_two: photoTwo,
      photo_three: photoThree,
      photo_four: photoFour,
      photo_five: photoFive,
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

    if (photoOne) {
      auction.merge({
        photoOne: Attachment.fromFile(photoOne),
      })
    }

    if (photoTwo) {
      auction.merge({
        photoTwo: Attachment.fromFile(photoTwo),
      })
    }

    if (photoThree) {
      auction.merge({
        photoThree: Attachment.fromFile(photoThree),
      })
    }

    if (photoFour) {
      auction.merge({
        photoFour: Attachment.fromFile(photoFour),
      })
    }

    if (photoFive) {
      auction.merge({
        photoFive: Attachment.fromFile(photoFive),
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
  public async update({ request, bouncer }: HttpContextContract, auction: Auction) {

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
