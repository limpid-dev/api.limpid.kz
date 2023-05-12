import {
  BelongsTo,
  beforeCreate,
  beforeDelete,
  beforeUpdate,
  belongsTo,
  column,
  BaseModel,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Auction from './Auction'
import Profile from './Profile'

export default class AuctionBid extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public wonAt: DateTime | null

  @column()
  public auctionId: number

  @belongsTo(() => Auction)
  public auction: BelongsTo<typeof Auction>

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column()
  public price: number

  @beforeCreate()
  public static async beforeCreate(bid: AuctionBid) {
    const winningBid = await AuctionBid.query()
      .where('auctionId', bid.auctionId)
      .orderBy('price', 'desc')
      .first()

    if (winningBid) {
      if (bid.price > winningBid.price) {
        await bid.merge({ wonAt: DateTime.now() }).save()
        await winningBid.merge({ wonAt: null }).save()
      }
    } else {
      await bid.merge({ wonAt: DateTime.now() }).save()
    }
  }

  @beforeUpdate()
  public static async beforeUpdate(bid: AuctionBid) {
    const winningBid = await AuctionBid.query()
      .where('auctionId', bid.auctionId)
      .orderBy('price', 'desc')
      .firstOrFail()

    if (bid.price > winningBid.price) {
      await bid.merge({ wonAt: DateTime.now() }).save()
      await winningBid.merge({ wonAt: null }).save()
    }
  }

  @beforeDelete()
  public static async beforeDelete(bid: AuctionBid) {
    const winningBid = await AuctionBid.query()
      .where('auctionId', bid.auctionId)
      .orderBy('price', 'desc')
      .firstOrFail()

    if (winningBid.id === bid.id) {
      const newWinningBid = await AuctionBid.query()
        .where('auctionId', bid.auctionId)
        .andWhereNot('id', bid.id)
        .orderBy('price', 'desc')
        .first()

      if (newWinningBid) {
        await newWinningBid.merge({ wonAt: DateTime.now() }).save()
      }
    }
  }
}
