import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auction from 'App/Models/Auction'
import AuctionBid from 'App/Models/AuctionBid'
import Chat from 'App/Models/Chat'
import User from 'App/Models/User'
import IndexValidator from 'App/Validators/AuctionBids/IndexValidator'
import StoreValidator from 'App/Validators/AuctionBids/StoreValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { bind } from '@adonisjs/route-model-binding'
import AuctionBidPolicy from 'App/Policies/AuctionBidPolicy'
import { DateTime } from 'luxon'

const PRICE_MODIFIER = 1.01

export default class AuctionBidsController {
  @bind()
  public async index({ request, bouncer }: HttpContextContract, auction: Auction) {
    const { page, per_page: perPage } = await request.validate(IndexValidator)

    const auctionBidQuery = AuctionBid.query().where('auctionId', auction.id).preload('profile')

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
    const now = DateTime.now()

    const user = await User.findOrFail(auth.user!.id)

    if (auction.finishedAt) {
      if (auction.finishedAt < now) {
        const winnerBid = await AuctionBid.query()
          .where('auctionId', auction.id)
          .orderBy('price', 'desc')
          .firstOrFail()

        auction.merge({
          wonAuctionBidId: winnerBid.id,
        })

        auction.save()

        return { data: auction }
      }
    

    const { price } = await request.validate(StoreValidator)

    await bouncer.with('AuctionBidPolicy').authorize('create', auction)

    if (auction.startingPrice) {
      await request.validate({
        schema: schema.create({
          price: schema.number([
            rules.range(auction.startingPrice * PRICE_MODIFIER, Number.MAX_SAFE_INTEGER),
          ]),
        }),
      })
    }

    if (price !== auction.purchasePrice) {
      const auctionBid = auction.related('bids').create({
        price,
        profileId: auth.user!.selectedProfileId!,
      })

      user.auctions_attempts = user.auctions_attempts - 1

      await user.save()

      return {
        data: auctionBid,
      }
    } 
    if (price === auction.purchasePrice) {
      const auctionBid = await auction.related('bids').create({
        price,
        profileId: auth.user!.selectedProfileId!,
      })

      user.auctions_attempts = user.auctions_attempts - 1

      auction.merge({
        wonAuctionBidId: auctionBid.id,
      })

      await auction.save()

      await user.save()

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
        data: auction, wonAuctionBid
      }
    }
    }
  }

  @bind()
  public async show({ auth }: HttpContextContract, auction: Auction) {
    if (!auth.user!.selectedProfileId) {
      throw new Error
    }

    const auctionBidQuery = await AuctionBid.query().where('auctionId', auction.id).where('profileId', auth.user!.selectedProfileId).firstOrFail()

    return {
      data: auctionBidQuery
    }
  }

  @bind()
  public async update(
    { bouncer, request }: HttpContextContract,
    auction: Auction,
    auctionBid: AuctionBid
  ) {
    const now = DateTime.now()

    if (auction.finishedAt) {
      if (auction.finishedAt < now) {
        const winnerBid = await AuctionBid.query()
          .where('auctionId', auction.id)
          .orderBy('price', 'desc')
          .firstOrFail()

        auction.merge({
          wonAuctionBidId: winnerBid.id,
        })

        auction.save()

        return { data: auction }
      }

    await bouncer.with('AuctionBidPolicy').allows('update', auction, auctionBid)

    const { price } = await request.validate({
      schema: schema.create({
        price: schema.number([rules.range(auctionBid.price * 1.01, Number.MAX_SAFE_INTEGER)]),
      }),
    })

    if (price !== auction.purchasePrice) {
      auctionBid.merge({ price })

      await auctionBid.save()

      return {
        data: auctionBid,
      }
    }  
    if (price === auction.purchasePrice) {
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
        data: auction, wonAuctionBid
      }
    }}
  }
}
