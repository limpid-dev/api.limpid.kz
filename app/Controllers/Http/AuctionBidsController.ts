import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auction from 'App/Models/Auction'
import AuctionBid from 'App/Models/AuctionBid'
import Chat from 'App/Models/Chat'
import IndexValidator from 'App/Validators/AuctionBids/IndexValidator'
import StoreValidator from 'App/Validators/AuctionBids/StoreValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { bind } from '@adonisjs/route-model-binding'
import AuctionBidPolicy from 'App/Policies/AuctionBidPolicy'

const PRICE_MODIFIER = 1.01

export default class AuctionBidsController {
  @bind()
  public async index({ request, bouncer }: HttpContextContract, auction: Auction) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const auctionBidQuery = AuctionBid.query().where('auctionId', auction.id)

    const auctionBids = await auctionBidQuery.paginate(page, perPage)

    auctionBids.queryString(request.qs())

    const allowedToViewAuctionBids = await Promise.all(
      auctionBids.map(async (auctionBid) => {
        const isAllowedToView = await bouncer
          .with('AuctionBidPolicy')
          .allows('view', auction, auctionBid)

        if (isAllowedToView) {
          return auctionBid
        }

        return AuctionBidPolicy.stripRestrictedViewFieldsFromAuctionBid(auctionBid)
      })
    )

    return {
      meta: auctionBids.getMeta(),
      data: allowedToViewAuctionBids,
    }
  }

  @bind()
  public async store({ request, auth, bouncer }: HttpContextContract, auction: Auction) {
    const { price } = await request.validate(StoreValidator)

    await bouncer.with('AuctionBidPolicy').allows('create', auction)

    if (auction.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([
            rules.range(auction.startingPrice * PRICE_MODIFIER, Number.MAX_SAFE_INTEGER),
          ]),
        }),
      })
    }

    if (price != auction.purchasePrice) {
      const auctionBid = auction.related('bids').create({
        price,
        profileId: auth.user!.selectedProfileId!,
      })
      return {
        data: auctionBid,
      }
    } else {
      const auctionBid = await auction.related('bids').create({
        price,
        profileId: auth.user!.selectedProfileId!,
      })

      auction.merge({
        wonAuctionBidId: auctionBid.id,
      })

      await auction.save()

      const wonAuctionBid = await AuctionBid.findOrFail(auctionBid.id)
      const wonAuction = await Auction.findOrFail(auction.id)

      await wonAuctionBid.load('profile')

      await wonAuctionBid.profile.load('user')
      await wonAuction.load('profile')

      await wonAuction.profile.load('user')

      const chat = await Chat.create({
        name: `${wonAuction.profile.user.firstName} ${wonAuction.profile.user.lastName}, ${wonAuctionBid.profile.user.firstName} ${wonAuctionBid.profile.user.lastName}`,
      })

      await chat
        .related('members')
        .createMany([
          { userId: wonAuction.profile.user.id },
          { userId: wonAuctionBid.profile.user.id },
        ])
      return {
        data: auction,
      }
    }
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, auction: Auction, auctionBid: AuctionBid) {
    const isAllowedToView = await bouncer
      .with('AuctionBidPolicy')
      .allows('view', auction, auctionBid)

    if (isAllowedToView) {
      return { data: auctionBid }
    }

    return {
      data: AuctionBidPolicy.stripRestrictedViewFieldsFromAuctionBid(auctionBid),
    }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    auction: Auction,
    auctionBid: AuctionBid
  ) {
    await bouncer.with('AuctionBidPolicy').allows('update', auction, auctionBid)

    const { price } = await request.validate({
      schema: schema.create({
        price: schema.number([rules.range(auctionBid.price * 1.01, Number.MAX_SAFE_INTEGER)]),
      }),
    })

    if (price != auction.purchasePrice) {
      auctionBid.merge({ price })

      await auctionBid.save()

      return {
        data: auctionBid,
      }
    } else {
      auctionBid.merge({ price })

      await auctionBid.save()

      auction.merge({
        wonAuctionBidId: auctionBid.id,
      })

      await auction.save()

      const wonAuctionBid = await AuctionBid.findOrFail(auctionBid.id)

      const wonAuction = await Auction.findOrFail(auction.id)

      await wonAuctionBid.load('profile')

      await wonAuctionBid.profile.load('user')

      await wonAuction.load('profile')

      await wonAuction.profile.load('user')

      const chat = await Chat.create({
        name: `${wonAuction.profile.user.firstName} ${wonAuction.profile.user.lastName}, ${wonAuctionBid.profile.user.firstName} ${wonAuctionBid.profile.user.lastName}`,
      })

      await chat
        .related('members')
        .createMany([
          { userId: wonAuction.profile.user.id },
          { userId: wonAuctionBid.profile.user.id },
        ])
      return {
        data: auction,
      }
    }
  }
}
