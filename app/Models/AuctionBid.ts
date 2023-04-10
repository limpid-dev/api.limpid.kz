import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ModelQueryBuilderContract,
  afterCreate,
  beforeCreate,
  beforeDelete,
  beforeFetch,
  beforeFind,
  beforeSave,
  beforeUpdate,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Auction from './Auction'
import Profile from './Profile'

type AuctionBidQuery = ModelQueryBuilderContract<typeof AuctionBid>

export default class AuctionBid extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public wondAt: DateTime | null

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
        await bid.merge({ wondAt: DateTime.now() }).save()
        await winningBid.merge({ wondAt: null }).save()
      }
    } else {
      await bid.merge({ wondAt: DateTime.now() }).save()
    }
  }

  @beforeUpdate()
  public static async beforeUpdate(bid: AuctionBid) {
    const winningBid = await AuctionBid.query()
      .where('auctionId', bid.auctionId)
      .orderBy('price', 'desc')
      .firstOrFail()

    if (bid.price > winningBid.price) {
      await bid.merge({ wondAt: DateTime.now() }).save()
      await winningBid.merge({ wondAt: null }).save()
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
        await newWinningBid.merge({ wondAt: DateTime.now() }).save()
      }
    }
  }
}
