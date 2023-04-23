import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import TenderBid from './TenderBid'
import File from './File'
import Profile from './Profile'

export default class Tender extends BaseModel {
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
  public verifiedAt: DateTime | null

  // Duration in hours
  @column()
  public duration: number

  @column()
  public startingPrice: number | null

  @hasMany(() => TenderBid)
  public bids: HasMany<typeof TenderBid>
}
