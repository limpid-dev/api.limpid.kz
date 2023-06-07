import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Auction from './Auction'
import Profile from './Profile'

export default class AuctionBid extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
