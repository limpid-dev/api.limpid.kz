import { compose } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import Profile from './Profile'
import AuctionBid from './AuctionBid'
import { Searchable } from 'App/Mixins/Searchable'

export default class Auction extends compose(BaseModel, Searchable) {
  public static search = ['title', 'description']

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
