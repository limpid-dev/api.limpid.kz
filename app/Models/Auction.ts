import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AuctionBid from './AuctionBid'
import File from './File'
import Profile from './Profile'

export default class Auction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public profileId: number

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => File)
  public files: HasMany<typeof File>

  @column()
  public title: string

  @column()
  public description: string

  @column.dateTime()
  public finishedAt: DateTime

  @column()
  public startingPrice: number | null

  @column()
  public purchasePrice: number | null

  @hasMany(() => AuctionBid)
  public bids: HasMany<typeof AuctionBid>
}
